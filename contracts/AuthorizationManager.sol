// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Authorization Manager
/// @notice Validates withdrawal permissions and ensures each authorization is used only once
contract AuthorizationManager {
    // Track used authorizations
    mapping(bytes32 => bool) public usedAuthorizations;

    // Event emitted when an authorization is consumed
    event AuthorizationUsed(bytes32 indexed authId);

    /// @notice Validate an authorization request
    /// @param authId Unique identifier for the authorization
    /// @return True if validation passes
    function validate(bytes32 authId) public returns (bool) {
        require(!usedAuthorizations[authId], "Authorization already used");
        usedAuthorizations[authId] = true;
        emit AuthorizationUsed(authId);
        return true;
    }
}
