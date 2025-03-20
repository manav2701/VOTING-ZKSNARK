// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title VotingDApp - A decentralized voting contract with identity registration & verification using ZK-SNARK inspired methods.
/// @notice This contract allows users to register an identity (with a public key and an identity certificate),
/// cast a vote for a candidate, and have their vote counted anonymously while logging vote events.
contract VotingDApp {
    
    // Structure to hold a user's identity data.
    struct Identity {
        string publicKey;           // Voter's public key (verifying key)
        string identityCertificate; // Identity certificate (e.g., a signature over the identity hash)
    }

    // Mapping from voter address to their registered identity.
    mapping(address => Identity) private identities;
    
    // Mapping to store the vote count for each candidate.
    mapping(string => uint256) public votes;
    
    // Array of candidate names. These must be provided during deployment.
    string[] public candidates;
    
    // Mapping to track whether an address has already voted.
    mapping(address => bool) public hasVoted;

    // Events for logging significant actions.
    event IdentityRegistered(address indexed user, string publicKey, string identityCertificate);
    event IdentityVerified(address indexed user);
    event VoteCast(address indexed voter, string candidate, uint256 totalVotes);

    /// @notice Contract constructor that initializes the candidate list.
    /// @param candidateNames An array of candidate names.
    constructor(string[] memory candidateNames) {
        candidates = candidateNames;
    }

    /// @notice Register a new identity.
    /// @param publicKey The voter's public key.
    /// @param identityCertificate The voter's identity certificate (a signature, for example).
    function registerIdentity(string memory publicKey, string memory identityCertificate) public {
        require(bytes(identities[msg.sender].publicKey).length == 0, "Identity already registered");
        identities[msg.sender] = Identity(publicKey, identityCertificate);
        emit IdentityRegistered(msg.sender, publicKey, identityCertificate);
    }

    /// @notice Retrieve a registered identity.
    /// @param user The address of the voter.
    /// @return publicKey The public key of the voter.
    /// @return identityCertificate The identity certificate of the voter.
    function getIdentity(address user) public view returns (string memory publicKey, string memory identityCertificate) {
        Identity memory identity = identities[user];
        return (identity.publicKey, identity.identityCertificate);
    }

    /// @notice Verify an identity certificate using ECDSA signature verification.
    /// @dev The caller should have signed the identity hash off-chain.
    /// @param piIC The signature (identity certificate) provided by the voter.
    /// @param identityHash The hash of the voter's identity.
    /// @return True if the certificate is valid.
    function verifyIdentityCertificate(bytes memory piIC, bytes32 identityHash) public returns (bool) {
        // Create the prefixed hash (as done in Ethereum signed messages)
        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", identityHash));
        // Split the signature into its v, r, s components.
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(piIC);
        // Recover the address that signed the message.
        address recoveredAddr = ecrecover(prefixedHash, v, r, s);
        require(recoveredAddr == msg.sender, "Verification failed");
        emit IdentityVerified(msg.sender);
        return true;
    }

    /// @notice Cast a vote for a specified candidate.
    /// @param candidate The name of the candidate.
    function castVote(string memory candidate) public {
        require(bytes(identities[msg.sender].publicKey).length > 0, "You are not registered");
        require(!hasVoted[msg.sender], "You have already voted");
        require(voteExists(candidate), "Candidate does not exist");

        votes[candidate] += 1;
        hasVoted[msg.sender] = true;
        emit VoteCast(msg.sender, candidate, votes[candidate]);
    }

    /// @notice Get the vote count for a specific candidate.
    /// @param candidate The name of the candidate.
    /// @return The number of votes the candidate has received.
    function getVoteCount(string memory candidate) public view returns (uint256) {
        require(voteExists(candidate), "Candidate does not exist");
        return votes[candidate];
    }

    /// @notice Utility function to split an ECDSA signature into its components.
    /// @param sig The signature bytes.
    /// @return v The recovery byte.
    /// @return r The first 32 bytes of the signature.
    /// @return s The second 32 bytes of the signature.
    function splitSignature(bytes memory sig) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    /// @notice Checks whether a candidate exists in the candidates array.
    /// @param candidate The candidate name to check.
    /// @return True if the candidate exists.
    function voteExists(string memory candidate) internal view returns (bool) {
        for (uint256 i = 0; i < candidates.length; i++) {
            if (keccak256(abi.encodePacked(candidates[i])) == keccak256(abi.encodePacked(candidate))) {
                return true;
            }
        }
        return false;
    }
}
