import React, { useState, useEffect } from "react";
import axios from "axios";
import { Contract, BrowserProvider } from "ethers";
import { useNavigate } from "react-router-dom";

const Vote = ({ wallet }) => {
    const [selectedCandidate, setSelectedCandidate] = useState("");
    const [votes, setVotes] = useState([]);
    const [voteHistory, setVoteHistory] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const navigate = useNavigate();

    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const abi = require("./abi.json");

// Vote.js (updated useEffect)
useEffect(() => {
    const loadCandidates = async () => {
        try {
            const provider = new BrowserProvider(window.ethereum);
            const contract = new Contract(contractAddress, abi, provider);
            // Correct length access
            const count = Number(await contract.candidates.length());
            
            const loaded = [];
            for (let i = 0; i < count; i++) {
                loaded.push(await contract.candidates(i));
            }
            setCandidates(loaded);
        } catch (error) {
            console.error("Failed to load candidates:", error);
        }
    };
    loadCandidates();
    fetchVotes();
}, [abi, contractAddress]); // Add dependencies
    const castVote = async () => {
        if (!selectedCandidate) return alert("Select a candidate");
        
        try {
            // Verify with backend
            const message = `Voting for: ${selectedCandidate}`;
            const signature = await wallet.signer.signMessage(message);
            
            const verification = await axios.post("http://localhost:4000/cast-vote", {
                candidate: selectedCandidate,
                publicKey: wallet.publicKey,
                signature
            });

            if (!verification.data.success) {
                throw new Error(verification.data.message);
            }

            // Execute contract transaction
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, abi, signer);
            
            const tx = await contract.castVote(selectedCandidate);
            await tx.wait();
            
            alert("Vote recorded!");
            fetchVotes();

        } catch (error) {
            console.error("Voting failed:", error);
            alert(error.reason || error.message || "Voting failed");
        }
    };

    const fetchVotes = async () => {
        try {
            const response = await axios.get("http://localhost:4000/get-votes");
            setVotes(response.data.results);
        } catch (error) {
            console.error("Error fetching votes:", error);
        }
    };

    const fetchVoteHistory = async () => {
        try {
            const response = await axios.get("http://localhost:4000/get-vote-history");
            setVoteHistory(response.data.voteHistory);
        } catch (error) {
            console.error("History fetch error:", error);
        }
    };

    return (
        <div className="voting-interface">
            <h1>Decentralized Voting</h1>
            
            <div className="candidate-selection">
                {candidates.map((candidate, index) => (
                    <label key={index} className="candidate-option">
                        <input
                            type="radio"
                            name="candidate"
                            value={candidate}
                            onChange={(e) => setSelectedCandidate(e.target.value)}
                        />
                        {candidate}
                    </label>
                ))}
            </div>

            <div className="action-buttons">
                <button onClick={castVote} className="vote-button">
                    Submit Vote
                </button>
                <button onClick={fetchVotes} className="refresh-button">
                    Refresh Results
                </button>
            </div>

            {votes.length > 0 && (
                <div className="results-section">
                <h2>Current Results (Secure Hashes)</h2>
                <ul>
                    {votes.map((vote, index) => (
                        <li key={index}>
                            {vote.candidate}: {vote.count} votes
                        </li>
                    ))}
                </ul>
            </div>
            )}

        <div className="history-section">
             <button onClick={fetchVoteHistory} className="history-button">
                 Show Voting History
            </button>
                {voteHistory.map((vote, index) => (
                    <div key={index} className="history-record">
                        <p>Voter: {vote.voterPublicKey}</p>
                        <p>Choice: {vote.candidate}</p>
                        <p>Time: {new Date(vote.timestamp).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Vote;