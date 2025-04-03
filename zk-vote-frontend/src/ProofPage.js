import React, { useState } from "react";
import { ethers, keccak256, toUtf8Bytes } from "ethers";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProofPage = ({ wallet }) => {
  const [proof, setProof] = useState(null);
  const navigate = useNavigate();

  const generateProof = async () => {
    try {
      // Create an auth message (can include a nonce if desired).
      const authMessage = `ProofOfIdentity:${wallet.publicKey}`;
      // Sign the message with the wallet's private key.
      const signature = await wallet.signer.signMessage(authMessage);
      setProof(signature);
      
      // Off-chain verification call.
      const response = await axios.post("http://localhost:4000/verify-proof", {
        message: authMessage,
        signature,
        publicKey: wallet.publicKey,
      });

      if (response.data.success) {
        alert("Proof verified off-chain!");
        // Proceed to on-chain authentication.
        navigate("/authenticate");
      } else {
        alert("Proof verification failed.");
      }
    } catch (error) {
      console.error("Error generating proof:", error);
      alert("Failed to generate proof.");
    }
  };

  return (
    <div>
      <h1>Generate Proof of Identity</h1>
      <button onClick={generateProof}>Sign Message & Verify</button>
      {proof && <p><strong>Proof (Signature):</strong> {proof}</p>}
    </div>
  );
};

export default ProofPage;
