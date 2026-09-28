import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Match } from '../types/tournament';
import { Trophy, Clock, Key, CheckCircle, Crosshair, ExternalLink, Flame, Copy, Check } from 'lucide-react';

interface MyMatchesViewProps {
  onSelectMatch: (match: Match) => void;
  onExploreMatches: () => void;
}

export const MyMatchesView: React.FC<MyMatchesViewProps> = ({ onSelectMatch, onExploreMatches }) => {
  const { currentUser, matches, forceUnlockCredentials } = useTournament();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Get matches where current user is in participants
  const userMatches = matches.filter((m) =>
    m.participants.some((p) => p.userId === currentUser.id)
  );

  const filteredMatches = userMatches.filter((m) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return m.status === 'upcoming' || m.status === 'live';
    if (filter === 'completed') return m.status === 'completed';
    return true;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatMatchTime = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            My Registered Tournaments
          </h2>
          <p className="text-xs text-slate-400">
            Keep track of your match schedules, assigned slot numbers, and room credentials
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({userMatches.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'upcoming' ? 'bg-[#ff4655] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active & Upcoming
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'completed' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Finished Matches
          </button>
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-white">
              No tournaments found in this section
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You haven't joined any matches under this category yet. Browse upcoming matches to claim your slot!
            </p>
          </div>
          <button
            onClick={onExploreMatches}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4655] to-[#f97316] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#ff4655]/20 cursor-pointer"
          >
            Browse Tournaments
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match) => {
            const participant = match.participants.find((p) => p.userId === currentUser.id);
            const userResult = match.results?.find((r) => r.userId === currentUser.id);

            const matchDate = new Date(match.startTime);
            const now = new Date();
            const diffMinutes = Math.round((matchDate.getTime() - now.getTime()) / 60000);
            const isRoomUnlocked =
              diffMinutes <= match.roomRevealedAtMinutes ||
              match.status === 'live' ||
              match.status === 'completed' ||
              forceUnlockCredentials ||
              currentUser.role === 'admin';

            return (
              <div
                key={match.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Match Info & Banner */}
                <div className="flex items-start gap-4">
                  <img
                    src={match.bannerImage}
                    alt={match.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-slate-800"
                    referrerPolicy="no-referrer"
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#f97316]">
                      <span>{match.map}</span>
                      <span aria-hidden="true">·</span>
                      <span>{match.matchType}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-white font-bold">Slot #{participant?.slotNumber}</span>
                    </div>

                    <h3 className="font-display text-base font-bold text-white hover:text-[#ff4655] transition-colors">
                      {match.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatMatchTime(match.startTime)}</span>
                    </div>

                    {/* Status Pill */}
                    <div className="pt-1">
                      {match.status === 'live' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600/90 text-white">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          LIVE NOW
                        </span>
                      ) : match.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          COMPLETED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle className="w-3 h-3" />
                          Registered (Slot #{participant?.slotNumber})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Zone: Credentials or Results */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-5">
                  {match.status === 'completed' && userResult ? (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right min-w-[160px]">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">
                        Your Performance
                      </span>
                      <div className="flex items-center justify-end gap-3 mt-1 text-xs">
                        <span className="font-mono text-slate-300">
                          Rank: <strong className="text-white">#{userResult.placementRank}</strong>
                        </span>
                        <span className="font-mono text-slate-300">
                          Kills: <strong className="text-[#ff4655]">{userResult.kills}</strong>
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-mono font-bold text-[#eab308] tabular-nums">
                        Won: ৳{userResult.totalReward} BDT
                      </div>
                    </div>
                  ) : isRoomUnlocked && match.roomId ? (
                    <div className="bg-indigo-950/40 border border-indigo-500/30 p-3 rounded-xl min-w-[190px]">
                      <div className="flex items-center justify-between text-xs text-indigo-300 mb-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Key className="w-3.5 h-3.5 text-indigo-400" />
                          Custom Room
                        </span>
                      </div>
                      <div className="font-mono text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[10px]">ID:</span>
                          <span className="font-bold text-white select-all">{match.roomId}</span>
                          <button
                            onClick={() => handleCopy(match.roomId!, `id_${match.id}`)}
                            className="p-1 hover:bg-indigo-900/50 rounded text-slate-300 hover:text-white"
                          >
                            {copiedId === `id_${match.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[10px]">Pass:</span>
                          <span className="font-bold text-white select-all">{match.roomPassword || 'None'}</span>
                          <button
                            onClick={() => handleCopy(match.roomPassword || '', `pass_${match.id}`)}
                            className="p-1 hover:bg-indigo-900/50 rounded text-slate-300 hover:text-white"
                          >
                            {copiedId === `pass_${match.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 min-w-[160px]">
                      <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Room ID Locked</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Unlocks 15 mins before match start time
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => onSelectMatch(match)}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>View Match</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
