import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import TokenABI from '../abis/RewardToken.json';
import StakingABI from '../abis/StakingContract.json';

export function useStaking() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [txHistory, setTxHistory] = useState([]);

  const [balances, setBalances] = useState({
    wallet: '0',
    staked: '0',
    pendingRewards: '0',
    totalClaimed: '0'
  });
  const [loading, setLoading] = useState(false);

  const addTx = (type, amount, hash, gas) => {
    const entry = {
      type,
      amount,
      hash,
      gas: parseFloat(ethers.utils.formatEther(gas)).toFixed(6),
      time: new Date().toLocaleString()
    };
    setTxHistory(prev => [entry, ...prev]);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const _account = accounts[0];

      const _provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      const _signer = _provider.getSigner();

      const token = new ethers.Contract(TokenABI.address, TokenABI.abi, _signer);
      const staking = new ethers.Contract(StakingABI.address, StakingABI.abi, _signer);

      setProvider(_provider);
      setSigner(_signer);
      setAccount(_account);
      setTokenContract(token);
      setStakingContract(staking);

      window.ethereum.on('accountsChanged', () => window.location.reload());
      window.ethereum.on('chainChanged', () => window.location.reload());
    } catch (err) {
      console.error(err);
      alert("Connection failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const loadData = useCallback(async () => {
    if (!account || !tokenContract || !stakingContract) return;
    try {
      const [walletBalance, stakeInfo, pending] = await Promise.all([
        tokenContract.balanceOf(account),
        stakingContract.stakes(account),
        stakingContract.pendingReward(account),
      ]);

      setBalances(prev => ({
        wallet: ethers.utils.formatEther(walletBalance),
        staked: ethers.utils.formatEther(stakeInfo.amount),
        pendingRewards: ethers.utils.formatEther(pending),
        totalClaimed: prev.totalClaimed
      }));
    } catch (err) {
      console.error("Failed to load data", err);
    }
  }, [account, tokenContract, stakingContract]);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(), 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  const stakeTokens = async (amount) => {
    if (!stakingContract) return;
    setLoading(true);
    try {
      const parsedAmount = ethers.utils.parseEther(amount.toString());

      const tx1 = await tokenContract.approve(StakingABI.address, parsedAmount);
      await tx1.wait();

      const tx2 = await stakingContract.stake(parsedAmount);
      const receipt = await tx2.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      addTx('Stake', amount, tx2.hash, gasUsed);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Stake failed: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  const unstakeTokens = async (amount) => {
    if (!stakingContract) return;
    setLoading(true);
    try {
      const parsedAmount = ethers.utils.parseEther(amount.toString());
      const tx = await stakingContract.unstake(parsedAmount);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      addTx('Unstake', amount, tx.hash, gasUsed);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Unstake failed: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  const claimRewards = async () => {
    if (!stakingContract) {
      alert("Not connected");
      return;
    }
    if (parseFloat(balances.pendingRewards) <= 0) {
      alert("No rewards to claim yet");
      return;
    }
    setLoading(true);
    try {
      const rewardAmount = balances.pendingRewards;
      const tx = await stakingContract.claimReward();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      addTx('Claim', rewardAmount, tx.hash, gasUsed);
      setBalances(prev => ({
        ...prev,
        totalClaimed: (parseFloat(prev.totalClaimed) + parseFloat(rewardAmount)).toString()
      }));
      await loadData();
    } catch (err) {
      console.error("Claim error:", err);
      alert("Claim failed: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  const mintTestTokens = async () => {
    alert("Use the deployer Account #0 in MetaMask — it already has 5 million SRT tokens to stake.");
  };

  return {
    account,
    loading,
    balances,
    txHistory,
    connectWallet,
    stakeTokens,
    unstakeTokens,
    claimRewards,
    mintTestTokens
  };
}