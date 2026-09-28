import React from 'react';
import { GameMode, MatchStatus, MatchType } from '../types/tournament';
import { Trophy, Users, Flame, Search, Filter } from 'lucide-react';
import { MAP_IMAGES } from '../data/mockData';

interface HeroBannerProps {
  statusFilter: MatchStatus | 'all';
  setStatusFilter: (status: MatchStatus | 'all') => void;
  gameModeFilter: GameMode | 'all';
  setGameModeFilter: (mode: GameMode | 'all') => void;
  matchTypeFilter: MatchType | 'all';
  setMatchTypeFilter: (type: MatchType | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  totalTournamentsCount: number;
  liveMatchesCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  statusFilter,
  setStatusFilter,
  gameModeFilter,
  setGameModeFilter,
  matchTypeFilter,
  setMatchTypeFilter,
  searchQuery,
  setSearchQuery,
  totalTournamentsCount,
  liveMatchesCount,
}) => {
  return (
    <div className="relative mb-8">
      {/* Hero Showcase with generated art */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-2xl">
        <div className="absolute inset-0">
          <img
            src={MAP_IMAGES.Hero}
            alt="Free Fire Esports Tournament"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090d16] via-[#090d16]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 px-6 py-8 md:py-12 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff4655] mb-2 uppercase tracking-widest font-semibold">
            <Flame className="w-4 h-4 text-[#ff4655] animate-pulse" />
            <span>Official Custom Room Tournaments</span>
            <span aria-hidden="true">·</span>
            <span>Instant bKash & Nagad Payouts</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance leading-tight">
            COMPETE. WIN BOOYAH. <br />
            <span className="bg-gradient-to-r from-[#ff4655] via-[#f97316] to-[#eab308] bg-clip-text text-transparent">
              GET PAID INSTANTLY.
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Join daily Battle Royale, Clash Squad 4v4, and Lone Wolf matches. Dynamic per-kill rewards & guaranteed placement prize pools with automatic slot allocation.
          </p>

          {/* Metrics summary */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#eab308]" />
              <span className="text-white font-bold text-sm tabular-nums">৳50,000+</span>
              <span>Prize Pool Won</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-bold text-sm tabular-nums">1,240+</span>
              <span>Gamers Joined</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-rose-400 font-bold tabular-nums">{liveMatchesCount} Live Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 space-y-4">
        {/* Status Tabs Segmented Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-full overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Matches ({totalTournamentsCount})
            </button>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'upcoming'
                  ? 'bg-[#ff4655] text-white shadow-sm shadow-[#ff4655]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming Registration
            </button>
            <button
              onClick={() => setStatusFilter('live')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'live'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Live Battle
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed & Results
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search map, match #, rule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff4655] transition-colors"
            />
          </div>
        </div>

        {/* Sub-Filters: Mode & Type */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-mono flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            Filter:
          </span>

          {/* Game Modes */}
          <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 p-0.5 rounded-lg">
            {(['all', 'Battle Royale', 'Clash Squad', 'Lone Wolf'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setGameModeFilter(mode)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  gameModeFilter === mode
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode === 'all' ? 'All Modes' : mode}
              </button>
            ))}
          </div>

          {/* Match Types */}
          <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 p-0.5 rounded-lg ml-auto sm:ml-0">
            {(['all', 'Solo', 'Duo', 'Squad'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMatchTypeFilter(type)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  matchTypeFilter === type
                    ? 'bg-[#f97316] text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
