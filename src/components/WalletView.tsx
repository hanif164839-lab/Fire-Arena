import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { PaymentMethod, TransactionType } from '../types/tournament';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  AlertCircle,
  Upload,
  Trophy,
  Swords,
  Filter,
  Flame,
} from 'lucide-react';

interface WalletViewProps {
  initialTab?: 'overview' | 'deposit' | 'withdraw' | 'history';
}

export const WalletView: React.FC<WalletViewProps> = ({ initialTab = 'overview' }) => {
  const { currentUser, transactions, requestDeposit, requestWithdrawal, appSettings } = useTournament();

  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'history'>(initialTab);

  // Deposit Form State
  const [depositMethod, setDepositMethod] = useState<PaymentMethod>('bKash');
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [depositSenderNumber, setDepositSenderNumber] = useState<string>(currentUser.phone || '');
  const [depositTrxId, setDepositTrxId] = useState<string>('');
  const [depositScreenshot, setDepositScreenshot] = useState<string>('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Withdraw Form State
  const [withdrawMethod, setWithdrawMethod] = useState<PaymentMethod>('bKash');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100);
  const [withdrawNumber, setWithdrawNumber] = useState<string>(currentUser.phone || '');

  // Filter for history
  const [historyFilter, setHistoryFilter] = useState<string>('all');

  // Feedback Messages
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const officialNumbers = {
    bKash: appSettings.bkashNumber,
    Nagad: appSettings.nagadNumber,
  };

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!depositSenderNumber.trim()) {
      setFeedback({ type: 'error', text: 'Please enter your sender mobile number.' });
      return;
    }
    if (!depositTrxId.trim()) {
      setFeedback({ type: 'error', text: 'Please provide the Transaction ID (TrxID) from your bKash/Nagad SMS.' });
      return;
    }
    if (depositAmount < appSettings.minDeposit) {
      setFeedback({ type: 'error', text: `Minimum deposit amount is ${appSettings.minDeposit} BDT.` });
      return;
    }

    const res = requestDeposit({
      method: depositMethod,
      amount: Number(depositAmount),
      accountNumber: depositSenderNumber,
      trxId: depositTrxId,
      screenshotUrl: depositScreenshot || undefined,
    });

    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setDepositTrxId('');
      setDepositScreenshot('');
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const res = requestWithdrawal({
      method: withdrawMethod,
      amount: Number(withdrawAmount),
      accountNumber: withdrawNumber,
    });

    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setWithdrawAmount(50);
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  // Filter transactions for this user
  const userTransactions = transactions.filter((t) => t.userId === currentUser.id);
  const filteredTransactions = userTransactions.filter((t) => {
    if (historyFilter === 'all') return true;
    return t.type === historyFilter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Main Wallet Balance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>Available Balance</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-3xl font-bold text-white tabular-nums">
            ৳{currentUser.walletBalance}
            <span className="text-xs font-normal text-slate-400 ml-1.5">BDT</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('deposit');
                setFeedback(null);
              }}
              className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Add Money
            </button>
            <button
              onClick={() => {
                setActiveTab('withdraw');
                setFeedback(null);
              }}
              className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-[#f97316]" />
              Withdraw
            </button>
          </div>
        </div>

        {/* Total Won */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>Total Earnings Won</span>
            <Trophy className="w-4 h-4 text-[#eab308]" />
          </div>
          <div className="font-mono text-3xl font-bold text-[#eab308] tabular-nums">
            ৳{currentUser.totalWon}
            <span className="text-xs font-normal text-slate-400 ml-1.5">BDT</span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            From tournament placement & kill bounties
          </p>
        </div>

        {/* Matches Played */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>Matches Joined</span>
            <Swords className="w-4 h-4 text-[#ff4655]" />
          </div>
          <div className="font-mono text-3xl font-bold text-white tabular-nums">
            {currentUser.matchesPlayed}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Custom room tournaments entered
          </p>
        </div>

        {/* Total Kills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>Eliminations</span>
            <Flame className="w-4 h-4 text-[#f97316]" />
          </div>
          <div className="font-mono text-3xl font-bold text-[#ff4655] tabular-nums">
            {currentUser.totalKills}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Verified tournament frags
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('overview');
            setFeedback(null);
          }}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Payment Methods
        </button>
        <button
          onClick={() => {
            setActiveTab('deposit');
            setFeedback(null);
          }}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'deposit' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowDownLeft className="w-3.5 h-3.5" />
          Add Money (Deposit)
        </button>
        <button
          onClick={() => {
            setActiveTab('withdraw');
            setFeedback(null);
          }}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'withdraw' ? 'bg-[#f97316] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          Withdrawal Request
        </button>
        <button
          onClick={() => {
            setActiveTab('history');
            setFeedback(null);
          }}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'history' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Transaction History ({userTransactions.length})
        </button>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/80 border border-rose-500/50 text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tab: Overview / Payment Methods Info */}
      {activeTab === 'overview' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-1">
              Official Tournament Payment Channels
            </h3>
            <p className="text-xs text-slate-400">
              Instant manual deposits via bKash and Nagad. Send Money directly to official numbers and enter your TrxID.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* bKash Card */}
            <div className="bg-slate-950 border border-pink-500/30 rounded-xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-pink-400 font-display text-base">bKash Personal</span>
                <span className="text-[10px] font-mono bg-pink-500/10 text-pink-300 px-2 py-0.5 rounded border border-pink-500/20">
                  Send Money Only
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Send Money to this personal number:</p>
              <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="font-mono text-lg font-bold text-white tracking-wider">
                  {officialNumbers.bKash}
                </span>
                <button
                  onClick={() => handleCopyNumber(officialNumbers.bKash)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <button
                onClick={() => {
                  setDepositMethod('bKash');
                  setActiveTab('deposit');
                }}
                className="mt-4 w-full py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Deposit via bKash
              </button>
            </div>

            {/* Nagad Card */}
            <div className="bg-slate-950 border border-orange-500/30 rounded-xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-orange-400 font-display text-base">Nagad Personal</span>
                <span className="text-[10px] font-mono bg-orange-500/10 text-orange-300 px-2 py-0.5 rounded border border-orange-500/20">
                  Send Money Only
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Send Money to this personal number:</p>
              <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="font-mono text-lg font-bold text-white tracking-wider">
                  {officialNumbers.Nagad}
                </span>
                <button
                  onClick={() => handleCopyNumber(officialNumbers.Nagad)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <button
                onClick={() => {
                  setDepositMethod('Nagad');
                  setActiveTab('deposit');
                }}
                className="mt-4 w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Deposit via Nagad
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Deposit & Withdrawal Guidelines:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-400 leading-relaxed">
              <li>Open your bKash or Nagad mobile app &gt; Choose <strong>"Send Money"</strong>.</li>
              <li>Input the official number above and enter your desired BDT amount.</li>
              <li>After successful transaction, copy the 10-character <strong>TrxID</strong> from SMS.</li>
              <li>Submit the form in the "Add Money" tab. Admin verifies and credits balance within 5–15 minutes.</li>
              <li>Minimum withdrawal limit is <strong>50 BDT</strong>. No withdrawal fee applied!</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab: Deposit Form */}
      {activeTab === 'deposit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="max-w-xl mx-auto space-y-5">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Add Money to Wallet (Deposit)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Send Money to our official number, then submit your transaction details below.
              </p>
            </div>

            {/* Method Picker */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDepositMethod('bKash')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    depositMethod === 'bKash'
                      ? 'bg-pink-950/40 border-pink-500 text-pink-300 ring-1 ring-pink-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>bKash Personal</span>
                  <span className="font-mono text-[10px] text-pink-400">{officialNumbers.bKash}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDepositMethod('Nagad')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    depositMethod === 'Nagad'
                      ? 'bg-orange-950/40 border-orange-500 text-orange-300 ring-1 ring-orange-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Nagad Personal</span>
                  <span className="font-mono text-[10px] text-orange-400">{officialNumbers.Nagad}</span>
                </button>
              </div>
            </div>

            {/* Target number reminder */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Send Money To ({depositMethod}):</span>
                <span className="font-mono font-bold text-white text-sm">
                  {officialNumbers[depositMethod as 'bKash' | 'Nagad']}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyNumber(officialNumbers[depositMethod as 'bKash' | 'Nagad'])}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1 cursor-pointer"
              >
                {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Number
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              {/* Amount input & Quick Chips */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Deposit Amount (BDT) *
                </label>
                <input
                  type="number"
                  min="10"
                  step="5"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                  required
                />
                <div className="flex items-center gap-2 mt-2">
                  {[20, 50, 100, 200, 500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                        depositAmount === amt
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sender Phone Number */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Your {depositMethod} Number (From which you sent money) *
                </label>
                <input
                  type="text"
                  placeholder="01XXXXXXXXX"
                  value={depositSenderNumber}
                  onChange={(e) => setDepositSenderNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Transaction ID (TrxID) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9JA7BD912"
                  value={depositTrxId}
                  onChange={(e) => setDepositTrxId(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono uppercase text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Screenshot Proof */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Payment Proof Screenshot (Optional URL or Simulation)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Image URL or simulated upload..."
                    value={depositScreenshot}
                    onChange={(e) => setDepositScreenshot(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDepositScreenshot('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80')
                    }
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Attach Proof
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Submit Deposit Request (৳{depositAmount} BDT)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Withdraw Form */}
      {activeTab === 'withdraw' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="max-w-xl mx-auto space-y-5">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Withdraw Money to bKash / Nagad
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Current available balance: <strong className="text-emerald-400">৳{currentUser.walletBalance} BDT</strong>
              </p>
            </div>

            {/* Method */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Select Withdrawal Channel
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('bKash')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    withdrawMethod === 'bKash'
                      ? 'bg-pink-950/40 border-pink-500 text-pink-300 ring-1 ring-pink-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>bKash Personal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWithdrawMethod('Nagad')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    withdrawMethod === 'Nagad'
                      ? 'bg-orange-950/40 border-orange-500 text-orange-300 ring-1 ring-orange-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Nagad Personal</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              {/* Account Number */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Recipient {withdrawMethod} Mobile Number *
                </label>
                <input
                  type="text"
                  placeholder="01XXXXXXXXX"
                  value={withdrawNumber}
                  onChange={(e) => setWithdrawNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#f97316]"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label className="font-mono text-slate-400">Withdraw Amount (BDT) *</label>
                  <span className="text-[11px] text-slate-500">Min. limit: {appSettings.minWithdrawal} BDT</span>
                </div>
                <input
                  type="number"
                  min={appSettings.minWithdrawal}
                  max={currentUser.walletBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#f97316]"
                  required
                />
                <div className="flex items-center gap-2 mt-2">
                  {[50, 100, 200].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      disabled={currentUser.walletBalance < amt}
                      onClick={() => setWithdrawAmount(amt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                        withdrawAmount === amt
                          ? 'bg-[#f97316] text-white font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 disabled:opacity-30'
                      }`}
                    >
                      ৳{amt}
                    </button>
                  ))}
                  {currentUser.walletBalance >= appSettings.minWithdrawal && (
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(currentUser.walletBalance)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 text-slate-200 hover:text-white border border-slate-700 cursor-pointer"
                    >
                      Max (৳{currentUser.walletBalance})
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                <p>⚡ Withdrawals are sent via {withdrawMethod} Send Money within 15–30 minutes.</p>
                <p>🚫 Make sure your number is active and capable of receiving Send Money.</p>
              </div>

              <button
                type="submit"
                disabled={currentUser.walletBalance < appSettings.minWithdrawal || withdrawAmount > currentUser.walletBalance}
                className="w-full py-3 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#f97316]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4" />
                Request Withdrawal (৳{withdrawAmount} BDT)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Transaction History */}
      {activeTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Transaction History
              </h3>
              <p className="text-xs text-slate-400">
                All deposits, tournament fees, and prize earnings for your account
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              {[
                { id: 'all', label: 'All' },
                { id: 'deposit', label: 'Deposits' },
                { id: 'withdrawal', label: 'Withdrawals' },
                { id: 'match_prize', label: 'Winnings' },
                { id: 'entry_fee', label: 'Entry Fees' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setHistoryFilter(f.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    historyFilter === f.id
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No transactions recorded for this filter.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {filteredTransactions.map((tx) => {
                const isPositive = tx.type === 'deposit' || tx.type === 'match_prize' || tx.type === 'refund';
                return (
                  <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          tx.type === 'match_prize'
                            ? 'bg-amber-500/10 text-[#eab308]'
                            : tx.type === 'deposit'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : tx.type === 'withdrawal'
                            ? 'bg-orange-500/10 text-[#f97316]'
                            : 'bg-rose-500/10 text-[#ff4655]'
                        }`}
                      >
                        {tx.type === 'match_prize' ? (
                          <Trophy className="w-4 h-4" />
                        ) : tx.type === 'deposit' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : tx.type === 'withdrawal' ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <Swords className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">
                            {tx.type === 'match_prize'
                              ? 'Tournament Prize Payout'
                              : tx.type === 'deposit'
                              ? `Deposit via ${tx.paymentMethod}`
                              : tx.type === 'withdrawal'
                              ? `Withdrawal to ${tx.paymentMethod}`
                              : 'Tournament Entry Fee'}
                          </span>
                          {/* Status */}
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-medium ${
                              tx.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : tx.status === 'pending'
                                ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {tx.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                          <span aria-hidden="true">·</span>
                          <span>{new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                          {tx.trxId && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono text-slate-300">TrxID: {tx.trxId}</span>
                            </>
                          )}
                        </div>
                        {tx.note && <p className="text-[10px] text-slate-500 mt-0.5">{tx.note}</p>}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`font-mono text-sm font-bold tabular-nums ${
                          isPositive ? 'text-emerald-400' : 'text-slate-200'
                        }`}
                      >
                        {isPositive ? '+' : '-'}৳{tx.amount} BDT
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
