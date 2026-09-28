import React, { useState } from 'react';
import { Match, MatchParticipant } from '../types/tournament';
import { useTournament } from '../context/TournamentContext';
import {
  X,
  Trophy,
  Crosshair,
  Clock,
  Key,
  Copy,
  Check,
  Users,
  ShieldAlert,
  AlertCircle,
  Flame,
  CheckCircle,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';

interface MatchDetailsModalProps {
  match: Match | null;
  onClose: () => void;
  onOpenDeposit: () => void;
  onOpenProfile: () => void;
}

export const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({
  match,
  onClose,
  onOpenDeposit,
  onOpenProfile,
}) => {
  const {
    currentUser,
    joinMatch,
    forceUnlockCredentials,
    setForceUnlockCredentials,
  } = useTournament();

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [teamName, setTeamName] = useState<string>('');
  const [teammate1Ign, setTeammate1Ign] = useState<string>('');
  const [teammate1Uid, setTeammate1Uid] = useState<string>('');
  const [teammate2Ign, setTeammate2Ign] = useState<string>('');
  const [teammate2Uid, setTeammate2Uid] = useState<string>('');
  const [teammate3Ign, setTeammate3Ign] = useState<string>('');
  const [teammate3Uid, setTeammate3Uid] = useState<string>('');

  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!match) return null;

  const isUserJoined = match.participants.some((p) => p.userId === currentUser.id);
  const userParticipant = match.participants.find((p) => p.userId === currentUser.id);

  // Time calculations
  const matchDate = new Date(match.startTime);
  const now = new Date();
  const diffMinutes = Math.round((matchDate.getTime() - now.getTime()) / 60000);
  const isRoomCredentialsUnlocked =
    diffMinutes <= match.roomRevealedAtMinutes ||
    match.status === 'live' ||
    match.status === 'completed' ||
    forceUnlockCredentials ||
    currentUser.role === 'admin';

  // Find next open slot
  const occupiedSlots = new Set(match.participants.map((p) => p.slotNumber));
  const availableSlots: number[] = [];
  for (let i = 1; i <= match.totalSlots; i++) {
    if (!occupiedSlots.has(i)) {
      availableSlots.push(i);
    }
  }

  // Pre-select first open slot if not selected
  const activeSlot = selectedSlot || (availableSlots.length > 0 ? availableSlots[0] : 1);

  const handleCopy = (text: string, isId: boolean) => {
    navigator.clipboard.writeText(text);
    if (isId) {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const handleJoin = () => {
    setFeedbackMsg(null);

    // Profile check
    if (!currentUser.ign || !currentUser.uid) {
      setFeedbackMsg({
        type: 'error',
        text: 'You must set your Free Fire IGN and UID before joining.',
      });
      return;
    }

    // Squad check
    let teammates = undefined;
    if (match.matchType === 'Squad') {
      if (!teamName.trim()) {
        setFeedbackMsg({ type: 'error', text: 'Please enter your Squad / Team Name.' });
        return;
      }
      teammates = [
        { ign: teammate1Ign || 'Teammate 1', uid: teammate1Uid || 'UID 1' },
        { ign: teammate2Ign || 'Teammate 2', uid: teammate2Uid || 'UID 2' },
        { ign: teammate3Ign || 'Teammate 3', uid: teammate3Uid || 'UID 3' },
      ];
    } else if (match.matchType === 'Duo') {
      teammates = [{ ign: teammate1Ign || 'Teammate 1', uid: teammate1Uid || 'UID 1' }];
    }

    const res = joinMatch({
      matchId: match.id,
      slotNumber: activeSlot,
      teamName: teamName || undefined,
      teammates,
    });

    if (res.success) {
      setFeedbackMsg({ type: 'success', text: res.message });
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  const formatMatchTime = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })}`;
  };

  const totalPrizePool =
    match.placementPrizes.reduce((sum, p) => sum + p.prize, 0) +
    (match.perKillReward > 0 ? (match.totalSlots - 1) * match.perKillReward : 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Image */}
        <div className="relative h-44 sm:h-52 bg-slate-950 shrink-0">
          <img
            src={match.bannerImage}
            alt={match.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Info */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#f97316] mb-1">
              <span>{match.map}</span>
              <span aria-hidden="true">·</span>
              <span>{match.gameMode}</span>
              <span aria-hidden="true">·</span>
              <span className="text-white font-bold">{match.matchType}</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
              {match.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Status & Timing Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ff4655]" />
              <span className="text-slate-400">Match Schedule:</span>
              <span className="font-semibold text-white">{formatMatchTime(match.startTime)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Status:</span>
              <span
                className={`font-bold uppercase tracking-wider ${
                  match.status === 'live'
                    ? 'text-rose-500 animate-pulse'
                    : match.status === 'completed'
                    ? 'text-slate-400'
                    : 'text-emerald-400'
                }`}
              >
                {match.status}
              </span>
            </div>
          </div>

          {/* Room ID and Password Reveal Card */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  Custom Room Credentials
                </h4>
              </div>

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setForceUnlockCredentials(!forceUnlockCredentials)}
                  className="text-[10px] font-mono text-indigo-400 hover:text-white underline cursor-pointer"
                >
                  {forceUnlockCredentials ? 'Reset Unlock Demo' : 'Host Unlock Demo'}
                </button>
              )}
            </div>

            {isUserJoined || currentUser.role === 'admin' ? (
              isRoomCredentialsUnlocked ? (
                <div className="space-y-3 mt-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Room ID */}
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block">
                          Room ID
                        </span>
                        <span className="font-mono text-base font-bold text-white select-all">
                          {match.roomId || 'Pending Host Setup'}
                        </span>
                      </div>
                      {match.roomId && (
                        <button
                          onClick={() => handleCopy(match.roomId!, true)}
                          className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy Room ID"
                        >
                          {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>

                    {/* Room Password */}
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block">
                          Password
                        </span>
                        <span className="font-mono text-base font-bold text-white select-all">
                          {match.roomPassword || 'Pending Host Setup'}
                        </span>
                      </div>
                      {match.roomPassword && (
                        <button
                          onClick={() => handleCopy(match.roomPassword!, false)}
                          className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy Room Password"
                        >
                          {copiedPass ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-indigo-300/80 leading-normal">
                    📌 Instructions: Open Free Fire &gt; Custom &gt; Search Room ID &gt; Enter Password &gt; Move to your assigned Slot <strong>#{userParticipant?.slotNumber}</strong>. Do not change slots.
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-400 space-y-1 mt-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Credentials Locked</span>
                  </div>
                  <p>
                    Room ID and Password will be revealed automatically <strong>15 minutes before the match start time</strong> ({diffMinutes} minutes remaining).
                  </p>
                </div>
              )
            ) : (
              <div className="text-xs text-slate-400 mt-2">
                <p>
                  Room ID & Password are only visible to confirmed registered players. Join this match below to receive room access.
                </p>
              </div>
            )}
          </div>

          {/* Prize Pool & Rates */}
          <div>
            <h4 className="font-display font-bold text-sm text-white mb-2.5 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#eab308]" />
              Prize Pool Breakdown (Total: ৳{totalPrizePool})
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Entry Fee</span>
                <span className="font-mono text-base font-bold text-white tabular-nums">৳{match.entryFee}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Per Kill Rate</span>
                <span className="font-mono text-base font-bold text-[#ff4655] tabular-nums">
                  {match.perKillReward > 0 ? `৳${match.perKillReward}` : 'N/A'}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">1st Booyah</span>
                <span className="font-mono text-base font-bold text-[#eab308] tabular-nums">
                  ৳{match.placementPrizes[0]?.prize || 0}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">2nd Place</span>
                <span className="font-mono text-base font-bold text-slate-300 tabular-nums">
                  ৳{match.placementPrizes[1]?.prize || 0}
                </span>
              </div>
            </div>

            {/* Placement Prize Table */}
            <div className="overflow-hidden border border-slate-800 rounded-xl bg-slate-950 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Rank / Position</th>
                    <th className="py-2 px-3">Reward Title</th>
                    <th className="py-2 px-3 text-right">Prize (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {match.placementPrizes.map((p) => (
                    <tr key={p.rank} className="hover:bg-slate-900/40">
                      <td className="py-2 px-3 font-bold text-white">#{p.rank}</td>
                      <td className="py-2 px-3 text-slate-300">{p.label}</td>
                      <td className="py-2 px-3 text-right font-bold text-[#eab308] tabular-nums">
                        ৳{p.prize}
                      </td>
                    </tr>
                  ))}
                  {match.perKillReward > 0 && (
                    <tr className="hover:bg-slate-900/40 bg-[#ff4655]/5">
                      <td className="py-2 px-3 font-bold text-[#ff4655]">Kills Pool</td>
                      <td className="py-2 px-3 text-slate-300">Dynamic Kill Rewards (Per elimination)</td>
                      <td className="py-2 px-3 text-right font-bold text-[#ff4655] tabular-nums">
                        ৳{match.perKillReward} / kill
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Custom Rules */}
          {match.customRules.length > 0 && (
            <div>
              <h4 className="font-display font-bold text-sm text-white mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#f97316]" />
                Tournament Match Rules
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {match.customRules.map((rule) => (
                  <div
                    key={rule}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] shrink-0" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Slot Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                Slot Allocation ({match.participants.length} / {match.totalSlots})
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {isUserJoined
                  ? `Your Slot: #${userParticipant?.slotNumber}`
                  : `Selected: Slot #${activeSlot}`}
              </span>
            </div>

            {!isUserJoined && (
              <p className="text-xs text-slate-400 mb-3">
                Click any available slot number to reserve your position in the custom room:
              </p>
            )}

            {/* Slots Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
              {Array.from({ length: match.totalSlots }).map((_, i) => {
                const slotNum = i + 1;
                const participant = match.participants.find((p) => p.slotNumber === slotNum);
                const isOccupied = !!participant;
                const isMine = isUserJoined && userParticipant?.slotNumber === slotNum;
                const isSelected = !isUserJoined && activeSlot === slotNum;

                return (
                  <button
                    key={slotNum}
                    type="button"
                    disabled={isOccupied || isUserJoined}
                    onClick={() => setSelectedSlot(slotNum)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 text-xs font-mono transition-all cursor-pointer ${
                      isMine
                        ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-400 shadow-md'
                        : isOccupied
                        ? 'bg-slate-900/60 text-slate-600 border border-slate-800 cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#ff4655] text-white font-bold ring-2 ring-[#ff4655]/50 scale-105'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                    title={
                      isOccupied
                        ? `Slot ${slotNum}: ${participant?.ign}`
                        : `Slot ${slotNum}: Available`
                    }
                  >
                    <span className="text-[11px] font-bold">{slotNum}</span>
                    <span className="text-[8px] truncate max-w-full">
                      {isMine ? 'YOU' : isOccupied ? 'BUSY' : 'OPEN'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Squad / Duo Teammates Form if applicable */}
          {!isUserJoined && (match.matchType === 'Squad' || match.matchType === 'Duo') && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h5 className="text-xs font-display font-bold text-white uppercase tracking-wider">
                {match.matchType} Team Registration Details
              </h5>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bangladesh Esports Clan"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff4655]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Teammate 2 IGN
                  </label>
                  <input
                    type="text"
                    placeholder="IGN"
                    value={teammate1Ign}
                    onChange={(e) => setTeammate1Ign(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Teammate 2 UID
                  </label>
                  <input
                    type="text"
                    placeholder="10-digit UID"
                    value={teammate1Uid}
                    onChange={(e) => setTeammate1Uid(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {match.matchType === 'Squad' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">
                        Teammate 3 IGN
                      </label>
                      <input
                        type="text"
                        placeholder="IGN"
                        value={teammate2Ign}
                        onChange={(e) => setTeammate2Ign(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">
                        Teammate 3 UID
                      </label>
                      <input
                        type="text"
                        placeholder="10-digit UID"
                        value={teammate2Uid}
                        onChange={(e) => setTeammate2Uid(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">
                        Teammate 4 IGN
                      </label>
                      <input
                        type="text"
                        placeholder="IGN"
                        value={teammate3Ign}
                        onChange={(e) => setTeammate3Ign(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">
                        Teammate 4 UID
                      </label>
                      <input
                        type="text"
                        placeholder="10-digit UID"
                        value={teammate3Uid}
                        onChange={(e) => setTeammate3Uid(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* User IGN / UID Warning if empty */}
          {(!currentUser.ign || !currentUser.uid) && (
            <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>You need to set your Free Fire IGN and UID before registering.</span>
              </div>
              <button
                onClick={onOpenProfile}
                className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold transition-colors cursor-pointer shrink-0"
              >
                Set IGN / UID
              </button>
            </div>
          )}

          {/* Feedback messages */}
          {feedbackMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
              }`}
            >
              {feedbackMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="text-xs">
            <span className="text-slate-400 block">Your Wallet Balance:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
              ৳{currentUser.walletBalance} BDT
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.walletBalance < match.entryFee && !isUserJoined && (
              <button
                onClick={onOpenDeposit}
                className="px-3 py-2 text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Add Money
              </button>
            )}

            {isUserJoined ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>Confirmed in Slot #{userParticipant?.slotNumber}</span>
              </div>
            ) : match.status === 'completed' ? (
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Close Results
              </button>
            ) : (
              <button
                onClick={handleJoin}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4655] to-[#f97316] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#ff4655]/25 transition-all cursor-pointer flex items-center gap-2"
              >
                <Flame className="w-4 h-4" />
                Confirm Slot #{activeSlot} (৳{match.entryFee})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
