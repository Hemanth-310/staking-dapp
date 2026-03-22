# ⬡ YieldX — DeFi Staking dApp

![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat&logo=solidity)
![Hardhat](https://img.shields.io/badge/Hardhat-2.x-yellow?style=flat)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![ethers.js](https://img.shields.io/badge/ethers.js-v5-purple?style=flat)

A fully functional decentralized staking platform where users can stake SRT tokens, earn yield in real time, and claim rewards — all through a clean React interface connected to MetaMask.

---

## 📜 Introduction and Problem Statement

Traditional finance locks people out of yield-generating opportunities with high minimums, long lock periods, and centralized gatekeepers. DeFi staking removes all of that. The core idea is simple:

- 🏦 **Deposit tokens** into a smart contract
- ⏱️ **Earn rewards** every second based on how much you staked
- 💸 **Claim or exit** anytime with no minimum and no penalty

This project implements a production-quality staking platform with a live frontend, real reward accrual, and full transaction history — built entirely on-chain.

---

## 🎯 Key Features

- 🔒 **Stake SRT tokens** — deposit into the staking contract with one click
- 📈 **Real-time rewards** — pending rewards update every 5 seconds
- 💰 **Claim anytime** — no lock period or minimum claim amount
- 🔓 **Unstake freely** — withdraw your tokens whenever you want
- 🚪 **Exit in one tx** — unstake everything and claim rewards in a single transaction
- 👑 **Admin controls** — owner can update the reward rate live
- 📊 **Transaction history** — every stake, unstake, and claim logged with gas fees, timestamp, and ROI

---

## 🔬 How Rewards Work

Rewards are calculated per second based on how many tokens you have staked:
```
reward = stakedAmount × rewardRatePerSecond × elapsedSeconds / 1e18
```

The default rate is `1e14`, which means:

| Staked | Duration | Earned |
|--------|----------|--------|
| 1,000 SRT | 1 hour | 360 SRT |
| 10,000 SRT | 1 day | 86,400 SRT |
| 1,000,000 SRT | 1 day | 8,640,000 SRT |

---

## 🏗️ Smart Contracts

| Contract | Description |
|---|---|
| `RewardToken.sol` | ERC20 token (SRT) — used for both staking and rewards |
| `StakingContract.sol` | Core staking logic — stake, unstake, claim, exit, admin rate control |

### Security

- ✅ `ReentrancyGuard` on all state-changing functions
- ✅ `SafeERC20` for all token transfers
- ✅ `Ownable` access control on admin functions
- ✅ Only the staking contract can mint reward tokens
- ✅ CEI (Checks-Effects-Interactions) pattern followed throughout

---

## 📁 Project Structure
```
├── contracts/
│   ├── RewardToken.sol          # ERC20 token for staking and rewards
│   └── StakingContract.sol      # Main staking logic
├── scripts/
│   └── deployStaking.js         # Deployment script — saves ABIs to frontend automatically
├── test/
│   └── StakingContract.test.ts  # 5 test cases covering all core functions
├── frontend/
│   └── src/
│       ├── App.jsx              # Main dashboard UI
│       ├── hooks/
│       │   └── useStaking.js    # All contract interaction logic via ethers.js
│       └── abis/
│           ├── StakingContract.json
│           └── RewardToken.json
├── hardhat.config.ts
└── README.md
```

---

## 💻 Local Setup

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- Git

### Step 1 — Clone the repository
```bash
git clone https://github.com/Hemanth-310/staking-dapp.git
cd staking-dapp
```

### Step 2 — Install contract dependencies
```bash
npm install
```

### Step 3 — Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 4 — Create a .env file
```bash
cp .env.example .env
```

Fill in your values:
```
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=your_alchemy_or_infura_rpc_url
ETHERSCAN_API_KEY=your_etherscan_api_key
```

---

## 🚀 Running Locally

### Terminal 1 — Start the local blockchain
```bash
npx hardhat node
```

This starts a local Ethereum node at `http://127.0.0.1:8545` and prints 20 test accounts with private keys.

### Terminal 2 — Deploy contracts
```bash
npx hardhat run scripts/deployStaking.js --network localhost
```

This deploys both contracts and automatically saves the ABIs and addresses to `frontend/src/abis/`.

### Terminal 3 — Start the frontend
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🦊 MetaMask Setup

1. Open MetaMask → Add a custom network:

| Field | Value |
|---|---|
| Network Name | Hardhat Local |
| RPC URL | http://127.0.0.1:8545 |
| Chain ID | 1337 |
| Currency Symbol | ETH |

2. Import Account #0 using this private key (public test key — never use on mainnet):
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

3. Import the SRT token using the RewardToken contract address printed after deploy.

4. Click **Connect Wallet** on the frontend — you'll see 5,000,000 SRT ready to stake.

---

## 🧪 Tests
```bash
npx hardhat test test/StakingContract.test.ts
```

Expected output:
```
StakingContract
  ✔ should let a user stake tokens and update their balance
  ✔ should accrue rewards over time and let user claim them
  ✔ should track rewards separately for multiple stakers
  ✔ should let admin update the reward rate
  ✔ should revert if a non-owner tries to update rate

5 passing
```

---

## 🌐 Deploying to Sepolia Testnet

Get free Sepolia ETH from https://sepoliafaucet.com, then:
```bash
npx hardhat run scripts/deployStaking.js --network sepolia
```

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Smart Contracts | Solidity 0.8.20 |
| Contract Framework | Hardhat |
| Contract Libraries | OpenZeppelin v5 |
| Frontend | React 19 + Vite |
| Blockchain Interaction | ethers.js v5 |
| Styling | Tailwind CSS |
| Wallet | MetaMask |

---

## 📊 Frontend Features

- 🔗 MetaMask wallet connection
- 💰 Live wallet balance, staked amount, and pending rewards
- 📈 ROI tracker based on total claimed vs total staked
- 📋 Transaction history with type, hash, amount, gas cost, and timestamp
- ⚡ Auto-refresh every 5 seconds

---

## 👥 Author

**Hemanth E B**

---

## 📄 License

This project is licensed under the MIT License.
