import hre from "hardhat";

async function main() {
  // Deploy AuthorizationManager
  const AuthManager = await hre.ethers.getContractFactory("AuthorizationManager");
  const authManager = await AuthManager.deploy();
  await authManager.waitForDeployment();
  console.log("AuthorizationManager deployed to:", await authManager.getAddress());

  // Deploy SecureVault with AuthorizationManager address
  const SecureVault = await hre.ethers.getContractFactory("SecureVault");
  const vault = await SecureVault.deploy(await authManager.getAddress());
  await vault.waitForDeployment();
  console.log("SecureVault deployed to:", await vault.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
