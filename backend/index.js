const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const sqlite3 = require('sqlite3').verbose();
require("dotenv").config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Ethereum provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const abi = require("./abi.json");
const contract = new ethers.Contract(contractAddress, abi, provider);

// SQLite Database Setup
const db = new sqlite3.Database('./vote_history.db', (err) => {
    if (err) console.error('Database error:', err);
    else db.run(`CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        voterPublicKey TEXT,
        candidate TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Verify Proof
app.post("/verify-proof", async (req, res) => {
    try {
        const { message, signature, publicKey } = req.body;
        const recoveredAddr = ethers.verifyMessage(message, signature);
        res.json({
            success: recoveredAddr.toLowerCase() === publicKey.toLowerCase(),
            message: recoveredAddr ? "Proof verified!" : "Invalid proof!"
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Cast Vote
app.post("/cast-vote", async (req, res) => {
    try {
        const { candidate, publicKey, signature } = req.body;
        const voterAddress = ethers.getAddress(publicKey);

        // Verify signature
        const message = `Voting for: ${candidate}`;
        const recoveredAddr = ethers.verifyMessage(message, signature);
        
        // Check if the recovered address matches the voter's address
        if (recoveredAddr.toLowerCase() !== voterAddress.toLowerCase()) {
            return res.status(401).json({ success: false, message: "Signature mismatch" });
        }

        // Generate identity hash for anonymity
        const identityHash = keccak256(toUtf8Bytes(publicKey));

        // Check if the voter is registered
        const [registeredPublicKey, registeredCertificate] = await contract.getIdentity(voterAddress);
        if (registeredPublicKey.length === 0 || registeredCertificate.length === 0) {
            return res.status(403).json({ success: false, message: "Voter not registered" });
        }

        // Verify the identity certificate on-chain
        const isIdentityVerified = await contract.verifyIdentityCertificate(
            ethers.toUtf8Bytes(registeredCertificate),
            identityHash
        );

        if (!isIdentityVerified) {
            return res.status(401).json({ success: false, message: "Identity verification failed" });
        }

        // Check voting status
        const hasVoted = await contract.hasVoted(voterAddress);
        if (hasVoted) {
            return res.status(400).json({ success: false, message: "Already voted" });
        }

        // Record the vote in the database with the hashed identity
        db.run(
            `INSERT INTO votes (voterPublicKey, candidate, identityHash) VALUES (?, ?, ?)`,
            [voterAddress, candidate, identityHash],
            (err) => {
                if (err) {
                    console.error('DB insert error:', err);
                    return res.status(500).json({ success: false, error: "Database error" });
                }

                // Respond with success and the hashed identity for transparency
                res.json({
                    success: true,
                    message: "Verification complete - proceed with transaction",
                    identityHash: identityHash,
                });
            }
        );

    } catch (err) {
        console.error('Cast vote error:', err);
        res.status(500).json({ 
            success: false, 
            error: err.reason || err.message || "Internal server error"
        });
    }
});

// Get Votes
app.get("/get-votes", async (req, res) => {
    try {
        const candidateCount = await contract.candidates.length();
        const candidates = [];
        
        for (let i = 0; i < candidateCount; i++) {
            candidates.push(await contract.candidates(i));
        }

        const results = await Promise.all(
            candidates.map(async (candidate) => ({
                candidate,
                count: (await contract.getVoteCount(candidate)).toString()
            }))
        );

        res.json({ success: true, results });
    } catch (err) {
        console.error('Get votes error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get History
app.get("/get-vote-history", (req, res) => {
    db.all("SELECT * FROM votes ORDER BY timestamp DESC", (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, voteHistory: rows });
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));