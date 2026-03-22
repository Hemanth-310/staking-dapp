// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./RewardToken.sol";

contract StakingContract is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    RewardToken public immutable stakingToken;
    uint256 public rewardRatePerSecond;
    uint256 public totalStaked;

    struct StakeInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastUpdateTime;
    }

    mapping(address => StakeInfo) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);

    constructor(address initialOwner, uint256 _rewardRatePerSecond) Ownable(initialOwner) {
        require(_rewardRatePerSecond > 0, "Rate must be greater than 0");
        stakingToken = new RewardToken(address(this));
        rewardRatePerSecond = _rewardRatePerSecond;
        stakingToken.mint(initialOwner, 5_000_000 * 1e18);
    }

    function pendingReward(address user) public view returns (uint256) {
        StakeInfo storage s = stakes[user];
        if (s.amount == 0) return s.rewardDebt;
        uint256 elapsed = block.timestamp - s.lastUpdateTime;
        uint256 earned = (s.amount * rewardRatePerSecond * elapsed) / 1e18;
        return s.rewardDebt + earned;
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        _updateReward(msg.sender);
        IERC20(address(stakingToken)).safeTransferFrom(msg.sender, address(this), amount);
        stakes[msg.sender].amount += amount;
        totalStaked += amount;
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external nonReentrant {
        StakeInfo storage s = stakes[msg.sender];
        require(amount > 0, "Amount must be greater than 0");
        require(s.amount >= amount, "Not enough staked");
        _updateReward(msg.sender);
        s.amount -= amount;
        totalStaked -= amount;
        IERC20(address(stakingToken)).safeTransfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    function claimReward() external nonReentrant {
        _updateReward(msg.sender);
        uint256 reward = stakes[msg.sender].rewardDebt;
        require(reward > 0, "Nothing to claim");
        stakes[msg.sender].rewardDebt = 0;
        stakingToken.mint(msg.sender, reward);
        emit RewardClaimed(msg.sender, reward);
    }

    function exit() external nonReentrant {
        StakeInfo storage s = stakes[msg.sender];
        uint256 staked = s.amount;
        _updateReward(msg.sender);
        uint256 reward = s.rewardDebt;
        s.rewardDebt = 0;

        if (staked > 0) {
            s.amount = 0;
            totalStaked -= staked;
            IERC20(address(stakingToken)).safeTransfer(msg.sender, staked);
            emit Unstaked(msg.sender, staked);
        }

        if (reward > 0) {
            stakingToken.mint(msg.sender, reward);
            emit RewardClaimed(msg.sender, reward);
        }
    }

    function setRewardRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be greater than 0");
        emit RewardRateUpdated(rewardRatePerSecond, newRate);
        rewardRatePerSecond = newRate;
    }

    function _updateReward(address user) internal {
        StakeInfo storage s = stakes[user];
        if (s.amount > 0) {
            uint256 elapsed = block.timestamp - s.lastUpdateTime;
            uint256 earned = (s.amount * rewardRatePerSecond * elapsed) / 1e18;
            s.rewardDebt += earned;
        }
        s.lastUpdateTime = block.timestamp;
    }
}