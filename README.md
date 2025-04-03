# ZKSNARK VOTING

## Overview
This project implements a Zero-Knowledge Succinct Non-Interactive Argument of Knowledge (ZK-SNARK) based voting system. It ensures voter privacy while maintaining the integrity and transparency of the election process. The architecture leverages smart contracts deployed on Ethereum, with an off-chain computation model for Zero-Knowledge Proof (ZKP) generation and verification.

## Features
- **Privacy-Preserving Authentication**: Voters prove their eligibility without revealing their identity.
- **On-Chain Verification**: The smart contract verifies the ZK proof without storing sensitive information.
- **Decentralized Voting**: A blockchain-based tally ensures integrity and immutability.
- **Scalability**: The off-chain proof generation reduces computation costs on the blockchain.

## Architecture

### System Components
1. **Voter Identity Provider (Off-Chain)**
   - Registers eligible voters and generates ZK proofs.
   - Uses cryptographic commitments to protect voter identity.
   - Example: Hashing voter ID and using a Merkle tree for verification.

2. **ZK-SNARK Proof Generation (Off-Chain)**
   - Uses Circom or SnarkJS to generate proofs.
   - Ensures that only eligible voters can submit a valid proof.

3. **Smart Contract (On-Chain)**
   - Verifies ZK proofs submitted by voters.
   - Stores public voting data (without linking it to voter identity).
   - Tallying phase ensures accurate vote counting without revealing voter choices.

4. **Voting Interface (Off-Chain & On-Chain Interaction)**
   - A web-based UI where users interact with the system.
   - Metamask integration to submit votes to the blockchain.

---
### Authentication Flow

1. **User Registration** (Off-Chain)
   - The voter registers with an identity provider (e.g., government or DAO).
   - The provider generates a cryptographic proof of eligibility.
   
   **![Screenshot 2025-04-03 064427](https://github.com/user-attachments/assets/fb069504-7479-4ff5-bfaa-d4426b07652c)
**
   
2. **Proof Generation** (Off-Chain)
   - The voter generates a Zero-Knowledge Proof using Circom.
   - This proof asserts eligibility without revealing identity.
   
   **Image Placeholder: Proof Generation**
   
3. **Proof Submission** (On-Chain)
   - The voter submits the proof to the smart contract.
   - The smart contract verifies the proof.
   
   **Image Placeholder: Proof Submission Process**
   
4. **Voting Process** (On-Chain)
   - Once verified, the voter casts their vote.
   - The vote is recorded on-chain, ensuring integrity.
   
   **Image Placeholder: Voting Execution**
   
5. **Result Tallying** (On-Chain)
   - The votes are counted via the smart contract.
   - Results are publicly verifiable while keeping voter identities private.
   
   **Image Placeholder: Result Tallying Process**

---
## Smart Contract (`IdentityProvider.sol`)
The contract includes the following:
- **ZK Proof Verification**
- **Vote Submission Mechanism**
- **Tallying System**

```solidity
// Solidity contract snippet
pragma solidity ^0.8.0;

contract IdentityProvider {
    // Verify zk-SNARK proof (simplified example)
    function verifyProof(bytes memory proof) public view returns (bool) {
        // Verification logic
        return true; // Placeholder
    }
}
```

---
## Technologies Used
- **Solidity** (Smart Contract Development)
- **Circom** (Zero-Knowledge Circuit Compiler)
- **SnarkJS** (ZK Proof Verification)
- **Ethereum** (Blockchain Deployment)
- **IPFS** (Decentralized Storage for Proofs)
- **React + Metamask** (Frontend Integration)

---
## Credits
This implementation is inspired by the research paper:
**"Zero-Knowledge Identity Authentication Framework"** (provided in the uploaded document).

---
## Future Enhancements
- Support for multi-party computation (MPC) for decentralized voter authentication.
- Enhancing scalability with Layer-2 solutions like ZK-Rollups.
- Improved UI for a seamless voter experience.

---
## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/zk-voting.git
   cd zk-voting
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile smart contracts:
   ```bash
   npx hardhat compile
   ```
4. Deploy to a testnet:
   ```bash
   npx hardhat run scripts/deploy.js --network goerli
   ```
5. Start the frontend:
   ```bash
   npm run start
   ```

---
## License
MIT License.
