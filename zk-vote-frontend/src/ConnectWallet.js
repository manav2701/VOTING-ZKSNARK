import React from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const ConnectWallet = ({ setWallet }) => {
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const wallet = {
          publicKey: await signer.getAddress(),
          signer,
        };
        setWallet(wallet);
        navigate("/wallet-connected");
      } catch (err) {
        console.error("Error connecting wallet:", err);
        alert("Failed to connect wallet.");
      }
    } else {
      alert("MetaMask is not installed. Please install it to continue.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Connect Your Wallet</h1>
      <p className="description">Securely connect your wallet to access the Voting DApp.</p>
      <button className="connect-btn" onClick={connectWallet}>Connect Wallet</button>
    </div>
  );
};

export default ConnectWallet;
