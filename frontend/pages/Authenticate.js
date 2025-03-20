import React from "react";
import { BrowserProvider, Contract, keccak256, toUtf8Bytes } from "ethers";

const Authenticate = ({ wallet }) => {
    const authenticate = async () => {
        try {
            // Generate the identity hash
            const identityHash = keccak256(toUtf8Bytes(wallet.publicKey));

            // Contract configuration
            const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
            const abi = [
                {
                    "anonymous": false,
                    "inputs": [
                        { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
                        { "indexed": false, "internalType": "string", "name": "publicKey", "type": "string" },
                        { "indexed": false, "internalType": "string", "name": "identityCertificate", "type": "string" }
                    ],
                    "name": "IdentityRegistered",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        { "indexed": true, "internalType": "address", "name": "user", "type": "address" }
                    ],
                    "name": "IdentityVerified",
                    "type": "event"
                },
                {
                    "inputs": [
                        { "internalType": "string", "name": "publicKey", "type": "string" },
                        { "internalType": "string", "name": "identityCertificate", "type": "string" }
                    ],
                    "name": "registerIdentity",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        { "internalType": "bytes", "name": "piIC", "type": "bytes" },
                        { "internalType": "bytes32", "name": "identityHash", "type": "bytes32" }
                    ],
                    "name": "verifyIdentityCertificate",
                    "outputs": [
                        { "internalType": "bool", "name": "", "type": "bool" }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        { "internalType": "address", "name": "user", "type": "address" }
                    ],
                    "name": "getIdentity",
                    "outputs": [
                        { "internalType": "string", "name": "publicKey", "type": "string" },
                        { "internalType": "string", "name": "identityCertificate", "type": "string" }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ];

            // Initialize provider, signer, and contract
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, abi, signer);

            // Generate the signature using the wallet's private key
            const signature = await wallet.signer.signMessage(identityHash);

            // Call the verifyIdentityCertificate function
            const tx = await contract.verifyIdentityCertificate(signature, identityHash);
            await tx.wait();

            alert("Authentication successful!");
        } catch (err) {
            console.error("Error during authentication:", err);
            alert("Authentication failed.");
        }
    };

    return (
        <div>
            <h1>On-Chain Authentication</h1>
            <p>Click the button below to authenticate using your identity certificate.</p>
            <button onClick={authenticate}>Authenticate</button>
        </div>
    );
};

export default Authenticate;
