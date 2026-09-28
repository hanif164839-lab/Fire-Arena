import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Flame, Wallet, User as UserIcon, Shield, Trophy, Swords, ArrowRightLeft, Check, Plus, ExternalLink } from 'lucide-react';

interface TopNavProps {
  activeTab: 'matches' | 'my-matches' | 'wallet' | 'rules' | 'admin';
  setActiveTab: (tab: 'matches' | 'my-matches' | 'wallet' | 'rules' | 'admin') => void;
  onOpenProfile: () => void;
  onOpenDeposit: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenDeposit,
}) => {
  const { currentUser, users, setCurrentUserById } = useTournament();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('matches')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ff4655] to-[#f97316] p-0.5 flex items-center justify-center shadow-lg shadow-[#ff4655]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090d16] rounded-[7px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-[#ff4655] group-hover:text-[#f97316] transition-colors" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-wider text-white">
                FIRE<span className="text-[#ff4655]">ARENA</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono tracking-widest text-slate-400">
                Esports BD
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'matches'
                ? 'bg-slate-800/90 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Swords className="w-4 h-4 text-[#ff4655]" />
            Tournaments
          </button>

          <button
            onClick={() => setActiveTab('my-matches')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'my-matches'
                ? 'bg-slate-800/90 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Trophy className="w-4 h-4 text-[#f97316]" />
            My Matches
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'wallet'
                ? 'bg-slate-800/90 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            Wallet & History
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-slate-800/90 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Shield className="w-4 h-4 text-indigo-400" />
            Fair Play Rules
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-rose-950/70 text-rose-200 border border-rose-500/60 font-bold shadow-lg shadow-rose-950/50 ring-1 ring-rose-500/30'
                : 'text-rose-400 hover:text-white hover:bg-rose-950/40 border border-rose-500/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Admin Control Room</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-rose-500/20 text-rose-300">
              কন্ট্রোল
            </span>
          </button>
        </nav>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Wallet Balance Widget */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 pr-1.5">
            <button
              onClick={() => setActiveTab('wallet')}
              className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="Open Wallet"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-mono font-bold tabular-nums text-emerald-400 text-sm">
                ৳{currentUser.walletBalance}
              </span>
            </button>
            <button
              onClick={onOpenDeposit}
              className="px-2 py-1 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded flex items-center gap-1 transition-colors cursor-pointer"
              title="Add Money via bKash/Nagad"
            >
              <Plus className="w-3 h-3" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>

          {/* Quick User Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors text-left cursor-pointer"
              title="Switch Demo User / Role"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="hidden lg:block text-xs leading-tight">
                <div className="font-medium text-white truncate max-w-[100px]">
                  {currentUser.ign || currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono uppercase">
                  {currentUser.role}
                </div>
              </div>
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Switch Active Account
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Test both player joins & admin host approvals
                    </p>
                  </div>

                  <div className="space-y-1">
                    {users.map((u) => {
                      const isActive = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            setCurrentUserById(u.id);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[#ff4655]/10 text-white font-medium border border-[#ff4655]/20'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-6 h-6 rounded-full bg-slate-800 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="text-left truncate">
                              <p className="truncate font-semibold text-white">
                                {u.ign || u.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                {u.role === 'admin' ? '🛡️ HOST ADMIN' : `৳${u.walletBalance} BDT`}
                              </p>
                            </div>
                          </div>
                          {isActive && <Check className="w-4 h-4 text-[#ff4655] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-800/80 mt-2 pt-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenProfile();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      Edit Free Fire IGN / UID
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
