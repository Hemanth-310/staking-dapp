const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingContract", function () {
  let staking: any, token: any;
  let owner: any, alice: any, bob: any;

  const RATE = ethers.utils.parseUnits("1", 14);
  const STAKE_AMOUNT = ethers.utils.parseEther("1000");

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();

    const Staking = await ethers.getContractFactory("StakingContract");
    staking = await Staking.deploy(owner.address, RATE);
    await staking.deployed();

    const tokenAddress = await staking.stakingToken();
    token = await ethers.getContractAt("RewardToken", tokenAddress);

    await token.connect(owner).transfer(alice.address, ethers.utils.parseEther("10000"));
    await token.connect(owner).transfer(bob.address, ethers.utils.parseEther("10000"));
  });

  it("should let a user stake tokens and update their balance", async function () {
    await token.connect(alice).approve(staking.address, STAKE_AMOUNT);
    await staking.connect(alice).stake(STAKE_AMOUNT);

    const info = await staking.stakes(alice.address);
    expect(info.amount).to.equal(STAKE_AMOUNT);
    expect(await staking.totalStaked()).to.equal(STAKE_AMOUNT);
  });

  it("should accrue rewards over time and let user claim them", async function () {
    await token.connect(alice).approve(staking.address, STAKE_AMOUNT);
    await staking.connect(alice).stake(STAKE_AMOUNT);

    // Fast forward 1 hour
    await ethers.provider.send("evm_increaseTime", [3600]);
    await ethers.provider.send("evm_mine", []);

    const balBefore = await token.balanceOf(alice.address);
    await staking.connect(alice).claimReward();
    const balAfter = await token.balanceOf(alice.address);

    expect(balAfter).to.be.gt(balBefore);
    expect((await staking.stakes(alice.address)).rewardDebt).to.equal(0);
  });

  it("should track rewards separately for multiple stakers", async function () {
    await token.connect(alice).approve(staking.address, STAKE_AMOUNT);
    await staking.connect(alice).stake(STAKE_AMOUNT);

    await token.connect(bob).approve(staking.address, STAKE_AMOUNT.mul(2));
    await staking.connect(bob).stake(STAKE_AMOUNT.mul(2));

    await ethers.provider.send("evm_increaseTime", [3600]);
    await ethers.provider.send("evm_mine", []);

    const alicePending = await staking.pendingReward(alice.address);
    const bobPending = await staking.pendingReward(bob.address);

    expect(bobPending).to.be.gt(alicePending);
  });

  it("should let admin update the reward rate", async function () {
    const newRate = RATE.mul(2);
    await staking.connect(owner).setRewardRate(newRate);
    expect(await staking.rewardRatePerSecond()).to.equal(newRate);
  });

  it("should revert if a non-owner tries to update rate", async function () {
    await expect(
      staking.connect(alice).setRewardRate(RATE.mul(2))
    ).to.be.reverted;
  });
});