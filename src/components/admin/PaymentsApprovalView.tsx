import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Transaction } from '../../types/tournament';
import {
  Check,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Clock,
  Filter,
} from 'lucide-react';

export const PaymentsApprovalView: React.FC = () => {
  const { transactions, approveTransaction, rejectTransaction } = useTournament();

  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals' | 'all'>('deposits');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectingTxId, setRejectingTxId] = useState<string | null>(null);

  const pendingDeposits = transactions.filter((t) => t.type === 'deposit' && t.status === 'pending');
  const pendingWithdrawals = transactions.filter(
    (t) => t.type === 'withdrawal' && t.status === 'pending'
  );

  const handleApprove = (id: string) => {
    approveTransaction(id);
  };

  const handleConfirmReject = (id: string) => {
    rejectTransaction(id, rejectReason || 'Transaction ID not verified or invalid screenshot');
    setRejectingTxId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('deposits')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'deposits' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Pending Deposits ({pendingDeposits.length})
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'withdrawals' ? 'bg-[#f97316] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Pending Withdrawals ({pendingWithdrawals.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Payment Requests
          </button>
        </div>
      </div>

      {/* Reject Reason Modal/Overlay */}
      {rejectingTxId && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/50 rounded-xl space-y-3 text-xs">
          <p className="font-semibold text-rose-300">
            Specify reason for rejecting transaction #{rejectingTxId}:
          </p>
          <input
            type="text"
            placeholder="e.g. Invalid TrxID, sender number mismatch, payment not received..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setRejectingTxId(null);
                setRejectReason('');
              }}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleConfirmReject(rejectingTxId)}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded cursor-pointer"
            >
              Confirm Rejection & Refund
            </button>
          </div>
        </div>
      )}

      {/* Pending Deposits Section */}
      {activeTab === 'deposits' && (
        <div className="space-y-3">
          {pendingDeposits.length === 0 ? (
            <div className="p-10 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
              No pending deposits right now. All submissions are processed!
            </div>
          ) : (
            pendingDeposits.map((tx) => (
              <div
                key={tx.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-white">
                      {tx.userName}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      {tx.paymentMethod}
                    </span>
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="text-xs text-slate-400">{tx.accountNumber}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="text-white font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      TrxID: {tx.trxId}
                    </span>
                    <span>
                      {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>

                  {tx.screenshotUrl && (
                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">Screenshot Attached:</span>
                      <a
                        href={tx.screenshotUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1"
                      >
                        View Proof <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      Amount To Credit
                    </span>
                    <span className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
                      +৳{tx.amount} BDT
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRejectingTxId(tx.id)}
                      className="px-3 py-2 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(tx.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve & Credit ৳{tx.amount}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pending Withdrawals Section */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-3">
          {pendingWithdrawals.length === 0 ? (
            <div className="p-10 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
              No pending withdrawal requests. All payouts are up to date!
            </div>
          ) : (
            pendingWithdrawals.map((tx) => (
              <div
                key={tx.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-white">
                      {tx.userName}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {tx.paymentMethod}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 font-mono">
                    Send Money To:{' '}
                    <strong className="text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {tx.accountNumber}
                    </strong>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Requested on{' '}
                    {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      Payout Amount
                    </span>
                    <span className="font-mono text-lg font-bold text-[#f97316] tabular-nums">
                      ৳{tx.amount} BDT
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRejectingTxId(tx.id)}
                      className="px-3 py-2 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject & Refund
                    </button>
                    <button
                      onClick={() => handleApprove(tx.id)}
                      className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#f97316]/25 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve & Mark Sent
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* All Transactions Log */}
      {activeTab === 'all' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Method / Details</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-950/40">
                  <td className="py-2 px-3 text-slate-400 whitespace-nowrap">
                    {new Date(tx.createdAt).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}{' '}
                    {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2 px-3 text-white font-medium whitespace-nowrap">
                    {tx.userName}
                  </td>
                  <td className="py-2 px-3 capitalize text-slate-300">
                    {tx.type.replace('_', ' ')}
                  </td>
                  <td className="py-2 px-3 text-slate-400">
                    {tx.paymentMethod} {tx.trxId ? `· TrxID: ${tx.trxId}` : ''}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        tx.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : tx.status === 'pending'
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold tabular-nums text-white">
                    ৳{tx.amount}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {tx.status === 'pending' && (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(tx.id)}
                          className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectingTxId(tx.id)}
                          className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
