import React from 'react';
import { Match } from '../types/tournament';
import { useTournament } from '../context/TournamentContext';
import { Users, Clock, Flame, Crosshair, Trophy, Key, CheckCircle, ShieldCheck } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onSelectMatch: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onSelectMatch }) => {
  const { currentUser, forceUnlockCredentials } = useTournament();

  const isUserJoined = match.participants.some((p) => p.userId === currentUser.id);
  const userParticipant = match.participants.find((p) => p.userId === currentUser.id);
  const slotsOccupied = match.participants.length;
  const slotsRemaining = match.totalSlots - slotsOccupied;
  const progressPercent = Math.min(100, Math.round((slotsOccupied / match.totalSlots) * 100));
  const isFull = slotsRemaining <= 0;

  // Time calculations
  const matchDate = new Date(match.startTime);
  const now = new Date();
  const diffMinutes = Math.round((matchDate.getTime() - now.getTime()) / 60000);
  const isWithin15Min = diffMinutes <= match.roomRevealedAtMinutes || forceUnlockCredentials;

  // Format time (e.g., "Today at 08:30 PM" or "Tomorrow at 04:00 PM")
  const formatMatchTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const totalPrizePool =
    match.placementPrizes.reduce((sum, p) => sum + p.prize, 0) +
    (match.perKillReward > 0 ? (match.totalSlots - 1) * match.perKillReward : 0);

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-all duration-200 flex flex-col justify-between">
      {/* Top Banner Image with Overlay */}
      <div className="relative h-40 overflow-hidden bg-slate-950">
        <img
          src={match.bannerImage}
          alt={`${match.map} map`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Status Badge */}
          <div>
            {match.status === 'live' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-600/90 text-white backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE BATTLE
              </span>
            ) : match.status === 'completed' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800/90 text-slate-300 backdrop-blur-md">
                <Trophy className="w-3 h-3 text-[#eab308]" />
                COMPLETED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/85 text-slate-200 backdrop-blur-md border border-slate-700/60">
                <Clock className="w-3 h-3 text-[#f97316]" />
                {diffMinutes > 0 ? `Starts in ${diffMinutes}m` : 'Starting Soon'}
              </span>
            )}
          </div>

          {/* Mode & Type Tag */}
          <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-white bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800">
            <span>{match.map}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="text-[#f97316] font-semibold">{match.matchType}</span>
          </div>
        </div>

        {/* Floating User Status (if joined) */}
        {isUserJoined && (
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 text-xs font-semibold backdrop-blur-md">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>You Joined: Slot #{userParticipant?.slotNumber}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Game Mode */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-[#ff4655] transition-colors line-clamp-1">
                {match.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{match.gameMode}</span>
                <span aria-hidden="true">·</span>
                <span>Time: {formatMatchTime(match.startTime)}</span>
              </div>
            </div>
          </div>

          {/* Custom Rules preview (Zero Pill unboxed text) */}
          {match.customRules.length > 0 && (
            <div className="text-[11px] text-slate-400 font-mono flex items-center flex-wrap gap-x-2 gap-y-1 mb-3">
              {match.customRules.slice(0, 3).map((rule, idx) => (
                <span key={rule} className="flex items-center gap-1.5">
                  <span className="text-slate-600">•</span>
                  <span>{rule}</span>
                </span>
              ))}
              {match.customRules.length > 3 && (
                <span className="text-slate-500">+{match.customRules.length - 3} more</span>
              )}
            </div>
          )}

          {/* Prize and Fee Economics Grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-4">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                Entry Fee
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-white tabular-nums">
                ৳{match.entryFee}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block flex items-center gap-1">
                <Crosshair className="w-2.5 h-2.5 text-[#ff4655]" />
                Per Kill
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-[#ff4655] tabular-nums">
                {match.perKillReward > 0 ? `৳${match.perKillReward}` : '0 BDT'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block flex items-center gap-1">
                <Trophy className="w-2.5 h-2.5 text-[#eab308]" />
                Pool
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-[#eab308] tabular-nums">
                ৳{totalPrizePool}
              </span>
            </div>
          </div>

          {/* Slot Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                Slots Filled
              </span>
              <span className="font-mono font-medium text-slate-300 tabular-nums">
                <strong className="text-white">{slotsOccupied}</strong> / {match.totalSlots}
                <span className="text-slate-500 ml-1.5">
                  ({slotsRemaining > 0 ? `${slotsRemaining} open` : 'Full'})
                </span>
              </span>
            </div>

            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-300 ${
                  progressPercent >= 90
                    ? 'bg-rose-500'
                    : progressPercent >= 60
                    ? 'bg-[#f97316]'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button & Room Credential Alert */}
        <div>
          {isUserJoined && isWithin15Min && match.roomId && (
            <div className="mb-2 px-2.5 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                Room ID Available
              </span>
              <span className="font-mono font-bold text-white">ID: {match.roomId}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectMatch(match)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                isUserJoined
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                  : isFull
                  ? 'bg-slate-800 text-slate-400 hover:text-white cursor-pointer'
                  : 'bg-gradient-to-r from-[#ff4655] to-[#f97316] hover:opacity-95 text-white shadow-lg shadow-[#ff4655]/25 active:scale-[0.99]'
              }`}
            >
              {isUserJoined ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  View Room & Slot #{userParticipant?.slotNumber}
                </>
              ) : match.status === 'completed' ? (
                <>
                  <Trophy className="w-4 h-4 text-[#eab308]" />
                  View Match Results
                </>
              ) : isFull ? (
                'Match Full · View Details'
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  Join Match (৳{match.entryFee})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
