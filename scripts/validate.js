const { ethers } = require("hardhat");

async function main() {
  const [owner, user] = await ethers.getSigners();
  const AuthManager = await ethers.getContractFactory("AuthorizationManager");
  const authManager = await AuthManager.deploy();
  const SecureVault = await ethers.getContractFactory("SecureVault");
  const vault = await SecureVault.deploy(await authManager.getAddress());

  console.log("Vault deployed:", await vault.getAddress());

  await vault.connect(user).deposit({ value: ethers.parseEther("1") });
  console.log("Deposit successful");

  const authId = ethers.keccak256(ethers.toUtf8Bytes("test123"));
  await vault.withdraw(authId, user.address, ethers.parseEther("0.5"));
  console.log("Withdrawal successful");

  try {
    await vault.withdraw(authId, user.address, ethers.parseEther("0.5"));
  } catch (err) {
    console.log("Reuse blocked:", err.message);
  }
}

main().catch(console.error);
