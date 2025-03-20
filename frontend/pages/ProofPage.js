import React, { useState } from "react";
import { keccak256, toUtf8Bytes } from "ethers";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ProofPage = ({ wallet }) => {
    const [identityCertificate, setIdentityCertificate] = useState(null);
    const [proofOfIdentity, setProofOfIdentity] = useState(null);
    const navigate = useNavigate();

    const generateIdentityCertificate = async () => {
        try {
            const identityHash = keccak256(toUtf8Bytes(wallet.publicKey));
            const signature = await wallet.signer.signMessage(identityHash);
            setIdentityCertificate(signature);
        } catch (error) {
            console.error("Error generating identity certificate:", error);
            alert("Failed to generate identity certificate.");
        }
    };

    const generateProofOfIdentity = async () => {
        try {
            const nonce = Math.random().toString(36).substring(2, 15);
            const authMessage = `AuthMessage:${wallet.publicKey}`;
            const message = authMessage + nonce;

            const signature = await wallet.signer.signMessage(message);
            setProofOfIdentity(signature);

            const response = await axios.post("http://localhost:4000/verify-proof", {
                message,
                signature,
                publicKey: wallet.publicKey,
            });

            alert(response.data.message);
            navigate("/vote"); // Navigate to the voting page upon successful proof generation
        } catch (error) {
            console.error("Error generating proof of identity:", error);
            alert("Failed to generate proof of identity.");
        }
    };

    return (
        <div>
            <h1>Generate Proof of Identity</h1>
            <button onClick={generateIdentityCertificate}>Generate Identity Certificate</button>
            {identityCertificate && <p><strong>Identity Certificate:</strong> {identityCertificate}</p>}

            <button onClick={generateProofOfIdentity}>Generate Proof of Identity</button>
            {proofOfIdentity && <p><strong>Proof of Identity:</strong> {proofOfIdentity}</p>}
        </div>
    );
};

export default ProofPage;
