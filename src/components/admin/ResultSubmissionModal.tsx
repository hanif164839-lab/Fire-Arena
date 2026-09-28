import React, { useState } from 'react';
import { Match } from '../../types/tournament';
import { useTournament } from '../../context/TournamentContext';
import { X, Trophy, Crosshair, Upload, CheckCircle, AlertCircle, DollarSign, Flame } from 'lucide-react';

interface ResultSubmissionModalProps {
  match: Match;
  onClose: () => void;
}

interface ParticipantRowState {
  userId: string;
  userName: string;
  ign: string;
  slotNumber: number;
  kills: number;
  placementRank: number;
}

export const ResultSubmissionModal: React.FC<ResultSubmissionModalProps> = ({ match, onClose }) => {
  const { submitMatchResultsAndPayout } = useTournament();

  const [screenshotUrl, setScreenshotUrl] = useState(
    match.proofScreenshotUrl ||
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
  );

  // Initialize rows for all participants
  const [rows, setRows] = useState<ParticipantRowState[]>(() => {
    return match.participants.map((p, idx) => {
      // If already has prior results, load them; otherwise sensible defaults
      const existing = match.results?.find((r) => r.userId === p.userId);
      return {
        userId: p.userId,
        userName: p.userName,
        ign: p.ign,
        slotNumber: p.slotNumber,
        kills: existing ? existing.kills : idx === 0 ? 5 : idx === 1 ? 3 : 1,
        placementRank: existing ? existing.placementRank : idx + 1,
      };
    });
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleKillsChange = (userId: string, kills: number) => {
    setRows((prev) =>
      prev.map((r) => (r.userId === userId ? { ...r, kills: Math.max(0, kills) } : r))
    );
  };

  const handleRankChange = (userId: string, rank: number) => {
    setRows((prev) =>
      prev.map((r) => (r.userId === userId ? { ...r, placementRank: rank } : r))
    );
  };

  // Compute live totals
  const computedList = rows.map((r) => {
    const placementObj = match.placementPrizes.find((p) => p.rank === r.placementRank);
    const placementReward = placementObj ? placementObj.prize : 0;
    const killReward = (r.kills || 0) * match.perKillReward;
    const total = placementReward + killReward;
    return {
      ...r,
      placementReward,
      killReward,
      total,
    };
  });

  const totalCalculatedPayout = computedList.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (rows.length === 0) {
      setFeedback({ type: 'error', text: 'No participants registered in this tournament to payout.' });
      return;
    }

    const res = submitMatchResultsAndPayout(
      match.id,
      rows.map((r) => ({
        userId: r.userId,
        ign: r.ign,
        slotNumber: r.slotNumber,
        kills: r.kills,
        placementRank: r.placementRank,
      })),
      screenshotUrl
    );

    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ff4655] mb-1">
              <span>{match.map}</span>
              <span aria-hidden="true">·</span>
              <span>Per Kill: ৳{match.perKillReward}</span>
              <span aria-hidden="true">·</span>
              <span>1st Place: ৳{match.placementPrizes[0]?.prize || 0}</span>
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              Result Submission & Auto-Payout: {match.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Screenshot proof attachment */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-indigo-400" />
                Match Result Proof Screenshot URL
              </label>
              <span className="text-[11px] text-slate-500">Required for fair play audit</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={screenshotUrl}
                onChange={(e) => setScreenshotUrl(e.target.value)}
                placeholder="Screenshot image URL..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
              <button
                type="button"
                onClick={() =>
                  setScreenshotUrl(
                    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
                  )
                }
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
              >
                Sample Proof
              </button>
            </div>
            {screenshotUrl && (
              <div className="mt-2 h-28 rounded-lg overflow-hidden border border-slate-800 bg-black">
                <img
                  src={screenshotUrl}
                  alt="Proof preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Participant Results Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-display font-bold text-sm text-white">
                  Participant Scores & Auto-Payout Calculations
                </h4>
                <p className="text-[11px] text-slate-400">
                  Input kills and placement rank. Payouts = (Kills × ৳{match.perKillReward}) + Placement Prize.
                </p>
              </div>

              <div className="bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-right">
                <span className="text-[10px] text-emerald-400 block font-mono">Total Payout Pool:</span>
                <span className="font-mono text-base font-bold text-emerald-300 tabular-nums">
                  ৳{totalCalculatedPayout} BDT
                </span>
              </div>
            </div>

            {rows.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-500">
                No participants have joined this match yet. Cannot calculate payouts.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Slot #</th>
                      <th className="py-2.5 px-3">Player IGN</th>
                      <th className="py-2.5 px-3 text-center">Placement Rank</th>
                      <th className="py-2.5 px-3 text-center">Kills</th>
                      <th className="py-2.5 px-3 text-right">Kill Bounty</th>
                      <th className="py-2.5 px-3 text-right">Placement Prize</th>
                      <th className="py-2.5 px-3 text-right text-emerald-400 font-bold">Auto Payout (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                    {computedList.map((row) => (
                      <tr key={row.userId} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-3 font-bold text-slate-400">
                          #{row.slotNumber}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-white">
                          <div>{row.ign}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{row.userName}</div>
                        </td>

                        {/* Rank selector */}
                        <td className="py-2.5 px-3 text-center">
                          <select
                            value={row.placementRank}
                            onChange={(e) => handleRankChange(row.userId, Number(e.target.value))}
                            className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-[#ff4655]"
                          >
                            {Array.from({ length: Math.min(20, match.totalSlots) }).map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                Rank #{i + 1}
                              </option>
                            ))}
                            <option value={99}>Unranked / Eliminated</option>
                          </select>
                        </td>

                        {/* Kills input */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="30"
                            value={row.kills}
                            onChange={(e) => handleKillsChange(row.userId, Number(e.target.value))}
                            className="w-16 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-center font-bold text-[#ff4655] focus:outline-none focus:border-[#ff4655]"
                          />
                        </td>

                        {/* Kill Bounty */}
                        <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">
                          ৳{row.killReward}
                        </td>

                        {/* Placement Prize */}
                        <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">
                          ৳{row.placementReward}
                        </td>

                        {/* Total Auto Payout */}
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-400 tabular-nums text-sm">
                          ৳{row.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/80 border border-rose-500/50 text-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              ⚡ Clicking will credit winnings directly into players' in-app wallet balances.
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={rows.length === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/25 cursor-pointer flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4" />
                Execute Auto-Payout (৳{totalCalculatedPayout} BDT)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
