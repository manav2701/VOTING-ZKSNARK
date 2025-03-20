import React from "react";
import { useNavigate } from "react-router-dom";

const WalletConnected = ({ wallet, disconnectWallet }) => {
    const navigate = useNavigate();

    if (!wallet) {
        return <p>Loading wallet details...</p>;
    }

    return (
        <div>
            <h1>Wallet Connected</h1>
            <p><strong>Public Key:</strong> {wallet.publicKey}</p>
            <p>Using Zero-Knowledge Proofs for secure authentication.</p>
            <button onClick={() => navigate("/generate-proof")}>Next</button>
            <button onClick={disconnectWallet} style={{ marginLeft: "10px" }}>
                Disconnect Wallet
            </button>
        </div>
    );
};

export default WalletConnected;
