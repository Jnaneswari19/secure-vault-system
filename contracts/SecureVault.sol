// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AuthorizationManager.sol";

/// @title Secure Vault
/// @notice Holds funds and executes withdrawals only after authorization
contract SecureVault {
    AuthorizationManager public authManager;
    mapping(address => uint256) public balances;

    event Deposit(address indexed sender, uint256 amount);
    event Withdrawal(address indexed recipient, uint256 amount);

    constructor(address _authManager) {
        require(_authManager != address(0), "Invalid manager");
        authManager = AuthorizationManager(_authManager);
    }

    /// @notice Accept deposits into the vault
    receive() external payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    /// @notice Withdraw funds with authorization
    /// @param authId Unique authorization ID
    /// @param recipient Address receiving funds
    /// @param amount Amount to withdraw
    function withdraw(
        bytes32 authId,
        address recipient,
        uint256 amount
    ) external {
        require(
            authManager.validate(authId, address(this), block.chainid, recipient, amount),
            "Authorization failed"
        );
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        payable(recipient).transfer(amount);

        emit Withdrawal(recipient, amount);
    }
}
