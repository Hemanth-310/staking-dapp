# YieldX Staking dApp

This project is a decentralized staking platform built with Solidity, Hardhat, React, ethers.js, and Tailwind CSS. Users can stake SRT (Staking Rewards Token), earn yield over time, and claim their rewards seamlessly via the web interface.

## Project Structure

- `contracts/`: Contains the Solidity smart contracts.
  - `TestToken.sol`: The ERC20 token used for staking and rewards (SRT).
  - `defi_stakingapp.sol`: The core staking contract logic (`DeFiStakingApp`).
- `test/DeFiStakingApp.test.ts`: Comprehensive tests covering all core mechanics.
- `scripts/deployStaking.ts`: Deployment script that pushes contracts and saves ABIs for the frontend.
- `frontend/`: The React + Vite frontend application.
  - `src/hooks/useStaking.js`: Hook managing blockchain interactions via `ethers.js`.
  - `src/App.jsx`: Main UI dashboard for interacting with the staking contract.

## Local Setup & Testing Instructions

Follow these steps to deploy the contracts on a local Hardhat network and run the web application.

### 1. Start Local Blockchain
Open a new terminal at the root of the project (`/Users/hemanth/Desktop/Blockchain`) and run:
```bash
npx hardhat node
```
*This starts a local Ethereum node at `http://127.0.0.1:8545`.*

### 2. Deploy Contracts
In a second terminal, execute the deployment script to deploy the contracts to your local node:
```bash
npx hardhat run scripts/deployStaking.ts --network localhost
```
*This will automatically generate the required `addresses.json` and ABIs in the `frontend/src/contracts` folder.*

### 3. Run the Frontend
Navigate to the frontend folder and run the development server:
```bash
cd frontend
npm run dev
```

### 4. Connect MetaMask
1. Open MetaMask in your browser.
2. Add a Custom Network:
   - **Network Name**: Hardhat Local
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: 31337 (or 1337 depending on Hardhat config)
   - **Currency Symbol**: ETH
3. Import an Account using one of the private keys provided by the `npx hardhat node` terminal output.
4. Click **Connect Wallet** on the frontend dashboard!

## Usage Guide
1. **Mint Tokens**: Click "Mint 1,000 SRT" to receive test tokens.
2. **Stake**: Enter an amount and click "Stake Now" to deposit SRT into the staking pool.
3. **Earn**: Watch your "Pending Rewards" accrue in real-time.
4. **Claim**: Click "Claim Rewards" to transfer accumulated SRT yield to your wallet.
5. **Unstake**: Withdraw your originally staked SRT back to your wallet.
