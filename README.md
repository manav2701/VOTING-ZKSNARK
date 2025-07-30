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
   
   ![Screenshot 2025-04-03 064427](https://github.com/user-attachments/assets/fb069504-7479-4ff5-bfaa-d4426b07652c)
   ![Screenshot 2025-04-03 064443](https://github.com/user-attachments/assets/79e474d2-0bbc-4851-a56b-3ddb9ecb9d72)
   
3. **Proof Generation** (Off-Chain)
   - The voter generates a Zero-Knowledge Proof using Circom.
   - This proof asserts eligibility without revealing identity.
   
   ![Screenshot 2025-04-03 064512](https://github.com/user-attachments/assets/d002d0b1-0f3f-4c89-9b6a-0521d6800664)
   
4. **Proof Submission** (On-Chain)
   - The voter submits the proof to the smart contract.
   - The smart contract verifies the proof.
   
   ![Screenshot 2025-04-03 064541](https://github.com/user-attachments/assets/646c538a-682c-49e3-917e-58821713bd8d)

   
5. **Voting Process** (On-Chain)
   - Once verified, the voter casts their vote.
   - The vote is recorded on-chain, ensuring integrity.
   
   **Image Placeholder: Voting Execution**
   
6. **Result Tallying** (On-Chain)
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
pragma solidity ^0.8.0;

contract IdentityProvider {
    function verifyProof(bytes memory proof) public view returns (bool) {
        return true; // Placeholder
    }
}
```

## Credits
This implementation is inspired by the research paper:
Marcellino, Matthew, Arya Wicaksana, and Moeljono Widjaja. "Zero-knowledge Identity Authentication for E-voting System." Journal of Internet Services and Information Security 14.2 (2024): 18-31.

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
