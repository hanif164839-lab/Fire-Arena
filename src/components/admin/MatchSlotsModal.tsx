import React, { useState } from 'react';
import { Match, MatchParticipant, User } from '../../types/tournament';
import { useTournament } from '../../context/TournamentContext';
import {
  X,
  Users,
  UserX,
  UserPlus,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface MatchSlotsModalProps {
  match: Match;
  onClose: () => void;
}

export const MatchSlotsModal: React.FC<MatchSlotsModalProps> = ({ match, onClose }) => {
  const { users, kickParticipantFromMatch, assignSlotToUser } = useTournament();

  const [selectedSlotForAssign, setSelectedSlotForAssign] = useState<number | null>(null);
  const [selectedUserIdToAssign, setSelectedUserIdToAssign] = useState<string>('');
  const [refundOnKick, setRefundOnKick] = useState<boolean>(true);
  const [confirmKickUser, setConfirmKickUser] = useState<MatchParticipant | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Available users not already in this match
  const joinedUserIds = new Set(match.participants.map((p) => p.userId));
  const candidateUsers = users.filter((u) => !joinedUserIds.has(u.id));

  const handleKick = (participant: MatchParticipant) => {
    kickParticipantFromMatch(match.id, participant.userId, refundOnKick);
    setActionMessage(
      `Removed ${participant.ign} from Slot #${participant.slotNumber} ${
        refundOnKick ? `and refunded ৳${match.entryFee} BDT.` : 'without refund.'
      }`
    );
    setConfirmKickUser(null);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlotForAssign === null || !selectedUserIdToAssign) return;

    const res = assignSlotToUser(match.id, selectedSlotForAssign, selectedUserIdToAssign);
    if (res.success) {
      setActionMessage(res.message);
      setSelectedSlotForAssign(null);
      setSelectedUserIdToAssign('');
      setTimeout(() => setActionMessage(null), 3000);
    } else {
      setActionMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#f97316] mb-1">
              <span>{match.map}</span>
              <span aria-hidden="true">·</span>
              <span>Entry: ৳{match.entryFee}</span>
              <span aria-hidden="true">·</span>
              <span>Slots: {match.participants.length} / {match.totalSlots}</span>
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              Slot & Participant Control: {match.title}
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {actionMessage && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{actionMessage}</span>
            </div>
          )}

          {/* Confirm Kick Dialog */}
          {confirmKickUser && (
            <div className="p-4 bg-rose-950/40 border border-rose-500/50 rounded-xl space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">
                    Remove {confirmKickUser.ign} (Slot #{confirmKickUser.slotNumber})?
                  </h4>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Player will be removed from this custom room roster.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="refundCheck"
                  checked={refundOnKick}
                  onChange={(e) => setRefundOnKick(e.target.checked)}
                  className="rounded text-[#ff4655]"
                />
                <label htmlFor="refundCheck" className="text-slate-300 font-mono">
                  Automatically refund entry fee (<strong>৳{match.entryFee} BDT</strong>) to player's wallet
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmKickUser(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleKick(confirmKickUser)}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Confirm Kick / Remove
                </button>
              </div>
            </div>
          )}

          {/* Manual Slot Assignment Card */}
          {selectedSlotForAssign !== null && (
            <form onSubmit={handleAssign} className="p-4 bg-indigo-950/30 border border-indigo-500/40 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-indigo-400" />
                  Assign User into Slot #{selectedSlotForAssign}
                </h4>
                <button
                  type="button"
                  onClick={() => setSelectedSlotForAssign(null)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedUserIdToAssign}
                  onChange={(e) => setSelectedUserIdToAssign(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  required
                >
                  <option value="">-- Choose User to Assign --</option>
                  {candidateUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.ign || u.name} (UID: {u.uid || 'No UID'} · Balance: ৳{u.walletBalance})
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={!selectedUserIdToAssign}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer"
                >
                  Assign to Slot
                </button>
              </div>
            </form>
          )}

          {/* Slots Table Grid */}
          <div>
            <h4 className="font-display font-bold text-sm text-white mb-2">
              All Match Slots (1 – {match.totalSlots})
            </h4>

            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
              <table className="w-full text-left">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Slot #</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Player IGN & UID</th>
                    <th className="py-2.5 px-3">Player Name & Phone</th>
                    <th className="py-2.5 px-3">Team / Squad Details</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {Array.from({ length: match.totalSlots }).map((_, i) => {
                    const slotNum = i + 1;
                    const participant = match.participants.find((p) => p.slotNumber === slotNum);
                    const isOccupied = !!participant;

                    return (
                      <tr key={slotNum} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-3 font-bold text-white">
                          #{slotNum}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isOccupied
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-900 text-slate-500 border border-slate-800'
                            }`}
                          >
                            {isOccupied ? 'OCCUPIED' : 'OPEN'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {participant ? (
                            <div>
                              <span className="font-bold text-white">{participant.ign}</span>
                              <div className="text-[10px] text-slate-400">UID: {participant.uid}</div>
                            </div>
                          ) : (
                            <span className="text-slate-600 italic">No player</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          {participant ? (
                            <div>
                              <span>{participant.userName}</span>
                              <div className="text-[10px] text-slate-500">{participant.userPhone}</div>
                            </div>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">
                          {participant?.teamName ? (
                            <div>
                              <span className="text-white font-medium">{participant.teamName}</span>
                              {participant.teammates && (
                                <div className="text-[10px] text-slate-500">
                                  {participant.teammates.length} teammates recorded
                                </div>
                              )}
                            </div>
                          ) : (
                            'Solo'
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {isOccupied ? (
                            <button
                              type="button"
                              onClick={() => {
                                setRefundOnKick(true);
                                setConfirmKickUser(participant);
                              }}
                              className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 rounded-lg text-xs cursor-pointer flex items-center gap-1 ml-auto"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              Kick Player
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedSlotForAssign(slotNum)}
                              className="px-2.5 py-1 bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs cursor-pointer flex items-center gap-1 ml-auto"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              Assign Player
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close Slot Manager
          </button>
        </div>
      </div>
    </div>
  );
};
