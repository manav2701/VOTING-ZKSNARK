import React from "react";
import { BrowserProvider } from "ethers";
import { useNavigate } from "react-router-dom";

const ConnectWallet = ({ setWallet }) => {
    const navigate = useNavigate();

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                console.log("Connected accounts:", accounts);

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
        <div>
            <h1>Voting DApp</h1>
            <button onClick={connectWallet}>Connect Wallet</button>
        </div>
    );
};

export default ConnectWallet;
