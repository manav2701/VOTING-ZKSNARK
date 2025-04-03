import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ConnectWallet from "../pages/ConnectWallet";
import WalletConnected from "../pages/WalletConnected";
import ProofPage from "../pages/ProofPage";
import Authenticate from "../pages/Authenticate";
import Vote from "../pages/Vote";


const App = () => {
    const [wallet, setWallet] = useState(null);

    const disconnectWallet = () => {
        setWallet(null);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<ConnectWallet setWallet={setWallet} />} />
                <Route path="/wallet-connected" element={<WalletConnected wallet={wallet} disconnectWallet={disconnectWallet} />} />
                <Route path="/generate-proof" element={<ProofPage wallet={wallet} />} />
                <Route path="/authenticate" element={<Authenticate wallet={wallet} />} />
                <Route path="/vote" element={<Vote wallet={wallet} />} />
            </Routes>
        </Router>
    );
};

export default App;
