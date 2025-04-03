import React, { useState } from "react";
import { ethers, keccak256, toUtf8Bytes } from "ethers";
import { useNavigate } from "react-router-dom";

const Authenticate = ({ wallet }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const authenticate = async () => {
    setLoading(true); // Start loading state

    try {
      if (!wallet || !wallet.publicKey) {
        throw new Error("Wallet not connected or public key missing.");
      }

      // Compute the identity hash using voter's public key.
      const identityHash = keccak256(toUtf8Bytes(wallet.publicKey));

      // Load contract details
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
      const abi = require("./abi.json");

      // Initialize Ethereum provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Generate a signature over the identity hash as identity proof.
      const signature = await wallet.signer.signMessage(identityHash);

      // Call smart contract function to verify identity
      const tx = await contract.verifyIdentityCertificate(signature, identityHash);
      await tx.wait(); // Wait for transaction confirmation

      alert("✅ On-chain authentication successful!");
      
      // Redirect to voting page after authentication
      navigate("/vote");
    } catch (err) {
      console.error("❌ Error during on-chain authentication:", err);
      alert(`Authentication failed: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div>
      <h1>🔐 On-Chain Authentication</h1>
      <p>Click the button below to verify your identity on-chain.</p>

      <button onClick={authenticate} disabled={loading}>
        {loading ? "Authenticating..." : "Authenticate"}
      </button>
    </div>
  );
};

export default Authenticate;
