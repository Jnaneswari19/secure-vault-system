// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Authorization Manager
/// @notice Validates withdrawal permissions and ensures each authorization is used only once
contract AuthorizationManager {
    // Track used authorizations
    mapping(bytes32 => bool) public usedAuthorizations;

    // Event emitted when an authorization is consumed
    event AuthorizationConsumed(bytes32 indexed authId);

    /// @notice Validate an authorization request
    /// @param authId Unique identifier for the authorization
    /// @param vault Address of the vault contract
    /// @param chainId Expected chain ID
    /// @param recipient Address receiving funds
    /// @param amount Amount to withdraw
    /// @return True if validation passes
    function validate(
        bytes32 authId,
        address vault,
        uint256 chainId,
        address recipient,
        uint256 amount
    ) external returns (bool) {
        require(!usedAuthorizations[authId], "Authorization already used");
        require(vault != address(0), "Invalid vault");
        require(chainId == block.chainid, "Wrong network");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Invalid amount");

        usedAuthorizations[authId] = true;
        emit AuthorizationConsumed(authId);
        return true;
    }
}
