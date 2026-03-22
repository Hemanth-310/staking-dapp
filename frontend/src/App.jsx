import React, { useState } from 'react';
import { useStaking } from './hooks/useStaking';
import { Wallet, Coins, Activity, ArrowDownCircle, ArrowUpCircle, Gift, Loader2, Clock, TrendingUp } from 'lucide-react';

function App() {
  const { account, loading, balances, txHistory, connectWallet, stakeTokens, unstakeTokens, claimRewards, mintTestTokens } = useStaking();
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Background */}
      <div className="absolute top-[-10rem] left-[-10rem] w-[40rem] h-[40rem] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[-10rem] right-[-10rem] w-[40rem] h-[40rem] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10rem] left-20 w-[40rem] h-[40rem] bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <header className="w-full max-w-5xl flex justify-between items-center z-10 mb-12">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl">
            <Activity className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">YieldX <span className="text-indigo-400">Staking</span></h1>
        </div>

        {!account ? (
          <button
            onClick={connectWallet}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/30 font-semibold"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={mintTestTokens}
              className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
            >
              Mint 1,000 SRT
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700/50 rounded-xl">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-mono text-slate-300">
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </span>
            </div>
          </div>
        )}
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6 z-10">
        {/* Left Column - Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-slate-800 rounded-2xl">
                <Wallet className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Wallet Balance</p>
                <h3 className="text-2xl font-bold text-white">{parseFloat(balances.wallet).toFixed(2)} SRT</h3>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-slate-800 rounded-2xl">
                <Coins className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Staked</p>
                <h3 className="text-2xl font-bold text-white">{parseFloat(balances.staked).toFixed(2)} SRT</h3>
              </div>
            </div>
          </div>

          {/* ROI Card */}
          <div className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-slate-800 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Claimed</p>
                <h3 className="text-2xl font-bold text-emerald-400">{parseFloat(balances.totalClaimed).toFixed(4)} SRT</h3>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              ROI: {parseFloat(balances.staked) > 0
                ? ((parseFloat(balances.totalClaimed) / parseFloat(balances.staked)) * 100).toFixed(4)
                : '0.0000'}%
            </div>
          </div>

          <div className="glass p-6 rounded-3xl relative overflow-hidden group bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-indigo-500/30 border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-2xl">
                  <Gift className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Pending Rewards</p>
                  <h3 className="text-2xl font-bold text-indigo-400">{parseFloat(balances.pendingRewards).toFixed(6)} SRT</h3>
                </div>
              </div>
            </div>
            <button
              onClick={claimRewards}
              disabled={loading || parseFloat(balances.pendingRewards) <= 0}
              className="w-full py-3 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 text-indigo-300 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Claim Rewards'}
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Actions */}
          <div className="glass rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Manage Stake</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Stake */}
              <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-slate-200">Stake Tokens</h3>
                  <ArrowDownCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">SRT</div>
                  </div>
                  <button
                    onClick={() => stakeTokens(stakeAmount)}
                    disabled={loading || !stakeAmount || parseFloat(stakeAmount) <= 0}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Stake Now'}
                  </button>
                </div>
              </div>

              {/* Unstake */}
              <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-slate-200">Unstake Tokens</h3>
                  <ArrowUpCircle className="w-6 h-6 text-rose-400" />
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="number"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-mono"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button
                        onClick={() => setUnstakeAmount(balances.staked)}
                        className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 bg-rose-500/10 rounded-lg"
                      >
                        MAX
                      </button>
                      <span className="text-slate-400 font-medium">SRT</span>
                    </div>
                  </div>
                  <button
                    onClick={() => unstakeTokens(unstakeAmount)}
                    disabled={loading || !unstakeAmount || parseFloat(unstakeAmount) <= 0}
                    className="w-full py-4 bg-rose-500 hover:bg-rose-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Unstake'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="glass rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-slate-400" />
              <h2 className="text-2xl font-bold text-white">Transaction History</h2>
            </div>

            {!txHistory || txHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No transactions yet. Start staking to see your history.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {txHistory.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-800/40 rounded-2xl px-5 py-4 border border-slate-700/50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${
                        tx.type === 'Stake' ? 'bg-emerald-500/10' :
                        tx.type === 'Unstake' ? 'bg-rose-500/10' :
                        'bg-indigo-500/10'
                      }`}>
                        {tx.type === 'Stake' && <ArrowDownCircle className="w-5 h-5 text-emerald-400" />}
                        {tx.type === 'Unstake' && <ArrowUpCircle className="w-5 h-5 text-rose-400" />}
                        {tx.type === 'Claim' && <Gift className="w-5 h-5 text-indigo-400" />}
                      </div>
                      <div>
                        <p className="text-white font-medium">{tx.type}</p>
                        <p className="text-slate-500 text-xs font-mono">{tx.hash.slice(0, 18)}...</p>
                        <p className="text-slate-600 text-xs">{tx.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        tx.type === 'Stake' ? 'text-emerald-400' :
                        tx.type === 'Unstake' ? 'text-rose-400' :
                        'text-indigo-400'
                      }`}>
                        {tx.type === 'Unstake' ? '-' : '+'}{parseFloat(tx.amount).toFixed(2)} SRT
                      </p>
                      <p className="text-slate-500 text-xs">Gas: {tx.gas} ETH</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;