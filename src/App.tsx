import React, { useState } from 'react';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import { TopNav } from './components/TopNav';
import { BottomNav } from './components/BottomNav';
import { HeroBanner } from './components/HeroBanner';
import { MatchCard } from './components/MatchCard';
import { MatchDetailsModal } from './components/MatchDetailsModal';
import { WalletView } from './components/WalletView';
import { MyMatchesView } from './components/MyMatchesView';
import { ProfileModal } from './components/ProfileModal';
import { RulesModal } from './components/RulesModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { GameMode, Match, MatchStatus, MatchType } from './types/tournament';
import { Flame, Swords, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

function TournamentApp() {
  const { matches, currentUser, appSettings } = useTournament();

  const [activeTab, setActiveTab] = useState<'matches' | 'my-matches' | 'wallet' | 'rules' | 'admin'>('matches');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);

  // Filters for Tournaments listing
  const [statusFilter, setStatusFilter] = useState<MatchStatus | 'all'>('all');
  const [gameModeFilter, setGameModeFilter] = useState<GameMode | 'all'>('all');
  const [matchTypeFilter, setMatchTypeFilter] = useState<MatchType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const liveMatchesCount = matches.filter((m) => m.status === 'live').length;

  // Filtered matches logic
  const filteredMatches = matches.filter((m) => {
    // Status
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    // Mode
    if (gameModeFilter !== 'all' && m.gameMode !== gameModeFilter) return false;
    // Type
    if (matchTypeFilter !== 'all' && m.matchType !== matchTypeFilter) return false;
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchInTitle = m.title.toLowerCase().includes(q);
      const matchInMap = m.map.toLowerCase().includes(q);
      const matchInRules = m.customRules.some((r) => r.toLowerCase().includes(q));
      if (!matchInTitle && !matchInMap && !matchInRules) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col pb-20 md:pb-8">
      {/* Top Bar (Follows 3-zone contract) */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenDeposit={() => {
          setActiveTab('wallet');
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Live Admin Announcement Ticker */}
        {appSettings.isNoticeActive && appSettings.globalNotice && (
          <div className="mb-4 p-3 bg-gradient-to-r from-[#ff4655]/15 via-[#f97316]/15 to-transparent border border-[#ff4655]/30 rounded-2xl flex items-center gap-3 text-xs shadow-lg backdrop-blur-md">
            <div className="w-7 h-7 rounded-lg bg-[#ff4655]/20 flex items-center justify-center shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#ff4655] animate-pulse" />
            </div>
            <div className="flex-1 font-medium text-slate-200">
              <span className="font-bold text-[#ff4655] mr-2 uppercase font-mono tracking-wider">
                LIVE NOTICE:
              </span>
              <span>{appSettings.globalNotice}</span>
            </div>
          </div>
        )}
        {/* Quick User Banner Warning if missing IGN/UID */}
        {(!currentUser.ign || !currentUser.uid) && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-orange-950/60 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-amber-200">
                  Setup Your Free Fire In-Game Credentials
                </p>
                <p className="text-amber-300/80 text-[11px]">
                  Set your exact Free Fire IGN and 10-digit UID to join custom rooms and claim prize bounties.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowProfileModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-bold uppercase tracking-wider rounded-xl cursor-pointer text-xs shrink-0"
            >
              Set In-Game Profile
            </button>
          </div>
        )}

        {/* TAB 1: MATCHES EXPLORER */}
        {activeTab === 'matches' && (
          <div>
            <HeroBanner
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              gameModeFilter={gameModeFilter}
              setGameModeFilter={setGameModeFilter}
              matchTypeFilter={matchTypeFilter}
              setMatchTypeFilter={setMatchTypeFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalTournamentsCount={matches.length}
              liveMatchesCount={liveMatchesCount}
            />

            {/* Match Grid */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Swords className="w-5 h-5 text-[#ff4655]" />
                  Tournament Arenas ({filteredMatches.length})
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  Showing {filteredMatches.length} of {matches.length} matches
                </span>
              </div>

              {filteredMatches.length === 0 ? (
                <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-3">
                  <Swords className="w-8 h-8 text-slate-600 mx-auto" />
                  <h3 className="font-display text-base font-bold text-white">
                    No tournaments match your criteria
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try clearing your game mode or status filter to see other available Free Fire matches.
                  </p>
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setGameModeFilter('all');
                      setMatchTypeFilter('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onSelectMatch={(m) => setSelectedMatch(m)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY MATCHES */}
        {activeTab === 'my-matches' && (
          <MyMatchesView
            onSelectMatch={(m) => setSelectedMatch(m)}
            onExploreMatches={() => setActiveTab('matches')}
          />
        )}

        {/* TAB 3: WALLET */}
        {activeTab === 'wallet' && <WalletView />}

        {/* TAB 4: FAIR PLAY RULES */}
        {activeTab === 'rules' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    FireArena Esports Code of Conduct
                  </h2>
                  <p className="text-xs text-slate-400">
                    Official Free Fire tournament rules, emulator restrictions, and payout protocols.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-display font-bold text-sm text-white">
                    1. Custom Room Joining Procedure
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Room ID & Password are systematically released 15 minutes before the match start time on this platform. Ensure you move to your strictly assigned Slot Number. Never swap slots in the lobby.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-display font-bold text-sm text-white">
                    2. Device Policy (No PC / Emulators)
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    All standard tournaments are exclusively for mobile (Android & iOS) devices. PC / Emulator players will be kicked immediately without any entry fee refund.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-display font-bold text-sm text-white">
                    3. Strict Anti-Cheat & Fair Play
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Use of auto-aim, scripts, antenna, headshot hacks, or crosshair configs will result in immediate hardware ban and forfeiture of all tournament prize pools.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-display font-bold text-sm text-white">
                    4. Fast bKash & Nagad Wallet Payouts
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Following match completion, scores are submitted and auto-calculated based on placement prize + per kill rate. Funds credit instantly to your wallet. Minimum withdrawal is 50 BDT.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN PANEL */}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Mobile Bottom Tab Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Match Details & Slot Allocation Modal */}
      {selectedMatch && (
        <MatchDetailsModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onOpenDeposit={() => {
            setSelectedMatch(null);
            setActiveTab('wallet');
          }}
          onOpenProfile={() => {
            setShowProfileModal(true);
          }}
        />
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <TournamentProvider>
      <TournamentApp />
    </TournamentProvider>
  );
}
