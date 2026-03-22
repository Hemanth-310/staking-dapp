const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const REWARD_RATE = ethers.utils.parseUnits("1", 14);

  const StakingContract = await ethers.getContractFactory("StakingContract");
  const staking = await StakingContract.deploy(deployer.address, REWARD_RATE);
  await staking.deployed();

  const stakingAddress = staking.address;
  const tokenAddress = await staking.stakingToken();

  console.log("StakingContract deployed to:", stakingAddress);
  console.log("RewardToken deployed to:    ", tokenAddress);

  // Save ABIs for frontend
  const out = path.join(__dirname, "../frontend/src/abis");
  fs.mkdirSync(out, { recursive: true });

  const stakingArtifact = require("../artifacts/contracts/StakingContract.sol/StakingContract.json");
  const tokenArtifact = require("../artifacts/contracts/RewardToken.sol/RewardToken.json");

  fs.writeFileSync(
    path.join(out, "StakingContract.json"),
    JSON.stringify({ address: stakingAddress, abi: stakingArtifact.abi }, null, 2)
  );

  fs.writeFileSync(
    path.join(out, "RewardToken.json"),
    JSON.stringify({ address: tokenAddress, abi: tokenArtifact.abi }, null, 2)
  );

  console.log("ABI files saved to frontend/src/abis/");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});