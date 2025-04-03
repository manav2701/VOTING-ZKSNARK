const express = require("express");
const { ethers } = require("ethers");
const { JsonRpcProvider } = require("ethers");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

// Set up Ethereum provider and contract.
const provider = new JsonRpcProvider(process.env.RPC_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const abi = require("./abi.json");
const contract = new ethers.Contract(contractAddress, abi, provider);

/**
 * Off-chain endpoint to verify the proof of identity.
 * The voter sends: { message, signature, publicKey }
 * The backend uses ethers.utils.verifyMessage() to ensure that the signature was produced by the provided publicKey.
 */
app.post("/verify-proof", async (req, res) => {
    try {
        console.log("Incoming /verify-proof request:", req.body);
        const { message, signature, publicKey } = req.body;
        if (!message || !signature || !publicKey) {
            throw new Error("Missing required parameters");
        }
        // Use ethers.verifyMessage for ethers v6.
        const recoveredAddr = ethers.verifyMessage(message, signature);
        console.log("Recovered address:", recoveredAddr);
        const success = recoveredAddr.toLowerCase() === publicKey.toLowerCase();
        res.json({
            success,
            message: success ? "Proof verified!" : "Invalid proof!"
        });
    } catch (err) {
        console.error("Verification error in /verify-proof:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});


/**
 * Endpoint to get vote counts.
 * This queries the contract’s candidates and retrieves each candidate’s vote count.
 */
app.get("/get-votes", async (req, res) => {
    try {
        const candidateCount = await contract.getCandidateCount();
        const count = Number(candidateCount);
        const candidates = [];

        for (let i = 0; i < count; i++) {
            candidates.push(await contract.getCandidate(i)); // Use getCandidate()
        }

        const results = await Promise.all(
            candidates.map(async (candidate) => ({
                candidate,
                count: (await contract.getVoteCount(candidate)).toString()
            }))
        );
        res.json({ success: true, results });
    } catch (err) {
        console.error("Error fetching votes:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});


/**
 * Endpoint to get vote history.
 * This reads past VoteCast events from the blockchain.
 */
app.get("/get-vote-history", async (req, res) => {
    try {
        const filter = contract.filters.VoteCast();
        const events = await contract.queryFilter(filter, 0, "latest");
        // Format the events data.
        const voteHistory = events.map(event => ({
            voter: event.args.voter,
            candidate: event.args.candidate,
            totalVotes: event.args.totalVotes.toString(),
            blockNumber: event.blockNumber
        }));
        res.json({ success: true, voteHistory });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
