const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SecureVault System", function () {
  let owner, user, authManager, vault;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const AuthManager = await ethers.getContractFactory("AuthorizationManager");
    authManager = await AuthManager.deploy();
    const SecureVault = await ethers.getContractFactory("SecureVault");
    vault = await SecureVault.deploy(authManager.address);
  });

  it("should accept deposits", async function () {
    await vault.connect(user).deposit({ value: ethers.utils.parseEther("1") });
    expect(await ethers.provider.getBalance(vault.address))
      .to.deep.equal(ethers.utils.parseEther("1"));
  });

  it("should allow withdrawal with valid authorization", async function () {
    await vault.connect(user).deposit({ value: ethers.utils.parseEther("1") });
    const authId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("auth1"));
    await vault.withdraw(authId, user.address, ethers.utils.parseEther("0.5"));
    expect(await ethers.provider.getBalance(vault.address))
      .to.deep.equal(ethers.utils.parseEther("0.5"));
  });

  it("should block reuse of authorization", async function () {
    await vault.connect(user).deposit({ value: ethers.utils.parseEther("1") });
    const authId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("auth2"));
    await vault.withdraw(authId, user.address, ethers.utils.parseEther("0.5"));
    await expect(
      vault.withdraw(authId, user.address, ethers.utils.parseEther("0.5"))
    ).to.be.revertedWith("Authorization already used");
  });

  // ✅ Phase 6 Event Tests
  it("should emit DepositMade event on deposit", async function () {
    await expect(
      vault.connect(user).deposit({ value: ethers.utils.parseEther("1") })
    ).to.emit(vault, "DepositMade").withArgs(user.address, ethers.utils.parseEther("1"));
  });

  it("should emit WithdrawalMade event on withdrawal", async function () {
    await vault.connect(user).deposit({ value: ethers.utils.parseEther("1") });
    const authId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("auth3"));
    await expect(
      vault.withdraw(authId, user.address, ethers.utils.parseEther("0.5"))
    ).to.emit(vault, "WithdrawalMade").withArgs(user.address, ethers.utils.parseEther("0.5"));
  });

  it("should emit AuthorizationUsed event on validation", async function () {
    await vault.connect(user).deposit({ value: ethers.utils.parseEther("1") });
    const authId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("auth4"));
    await expect(
      vault.withdraw(authId, user.address, ethers.utils.parseEther("0.5"))
    ).to.emit(authManager, "AuthorizationUsed").withArgs(authId);
  });
});
