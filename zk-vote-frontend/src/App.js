import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ConnectWallet from "./ConnectWallet";
import WalletConnected from "./WalletConnected";
import ProofPage from "./ProofPage";
import Vote from "./Vote";
import Authenticate from "./Authenticate";

function App() {
    const [wallet, setWallet] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<ConnectWallet setWallet={setWallet} />} />
                <Route path="/wallet-connected" element={<WalletConnected wallet={wallet} />} />
                <Route path="/generate-proof" element={<ProofPage wallet={wallet} />} />
                <Route path="/vote" element={<Vote wallet={wallet} />} />
                <Route path="/authenticate" element={<Authenticate wallet={wallet} />} />
            </Routes>
        </Router>
    );
}

export default App;
