// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AuthorizationManager.sol";

contract SecureVault {
    AuthorizationManager public authManager;

    event DepositMade(address indexed sender, uint256 amount);
    event WithdrawalMade(address indexed recipient, uint256 amount);

    constructor(address _authManager) {
        authManager = AuthorizationManager(_authManager);
    }

    function deposit() public payable {
        require(msg.value > 0, "Must send ETH");
        emit DepositMade(msg.sender, msg.value);
    }

    function withdraw(bytes32 authId, address recipient, uint256 amount) public {
        require(authManager.validate(authId), "Invalid authorization");
        require(address(this).balance >= amount, "Insufficient balance");
        payable(recipient).transfer(amount);
        emit WithdrawalMade(recipient, amount);
    }
}
