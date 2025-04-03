import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers, Contract, BrowserProvider } from "ethers";
import { useNavigate } from "react-router-dom";

const Vote = ({ wallet }) => {
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [votes, setVotes] = useState([]);
  const [voteHistory, setVoteHistory] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const abi = require("./abi.json");

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(contractAddress, abi, provider);
        const count = Number(await contract.getCandidateCount());
        const loaded = [];
        for (let i = 0; i < count; i++) {
          // Updated function call to getCandidate, not getCandidates
          loaded.push(await contract.getCandidate(i));
        }
        setCandidates(loaded);
      } catch (error) {
        console.error("Failed to load candidates:", error);
      }
    };
    loadCandidates();
    fetchVotes();
  }, [abi, contractAddress]);

  const castVote = async () => {
    if (!selectedCandidate) return alert("Select a candidate");
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, abi, signer);
      const tx = await contract.castVote(selectedCandidate);
      await tx.wait();
      alert("Vote recorded on-chain!");
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
      console.error("Error fetching vote history:", error);
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
        <button onClick={castVote} className="vote-button">Submit Vote</button>
        <button onClick={fetchVotes} className="refresh-button">Refresh Results</button>
      </div>
      {votes.length > 0 && (
        <div className="results-section">
          <h2>Current Results</h2>
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
        <button onClick={fetchVoteHistory} className="history-button">Show Voting History</button>
        {voteHistory.map((vote, index) => (
          <div key={index} className="history-record">
            <p>Voter: {vote.voter}</p>
            <p>Candidate: {vote.candidate}</p>
            <p>Block: {vote.blockNumber}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vote;
