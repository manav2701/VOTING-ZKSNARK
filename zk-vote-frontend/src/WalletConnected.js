import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const WalletConnected = ({ wallet }) => {
  const navigate = useNavigate();

  if (!wallet) {
    return <p className="loading-text">Loading wallet details...</p>;
  }

  return (
    <div className="container">
      <h1 className="title">Wallet Connected</h1>
      <p className="description">Your wallet is now connected.</p>

      {/* Public Key - Click to Copy */}
      <p
        className="wallet-info"
        title="Click to copy"
        onClick={() => navigator.clipboard.writeText(wallet.publicKey)}
      >
        <strong>Public Key:</strong> {wallet.publicKey}
      </p>

      <button className="next-btn" onClick={() => navigate("/generate-proof")}>Next</button>
    </div>
  );
};

export default WalletConnected;
