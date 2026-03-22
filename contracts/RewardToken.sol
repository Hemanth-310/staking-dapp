// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 1e18;

    constructor(address initialOwner) ERC20("StakeReward", "SRT") Ownable(initialOwner) {
        _mint(initialOwner, 10_000_000 * 1e18);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
}