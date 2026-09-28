import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Match, MatchStatus } from '../../types/tournament';
import { CreateMatchModal } from './CreateMatchModal';
import { EditMatchModal } from './EditMatchModal';
import { MatchSlotsModal } from './MatchSlotsModal';
import { ResultSubmissionModal } from './ResultSubmissionModal';
import { PaymentsApprovalView } from './PaymentsApprovalView';
import { UserManagementView } from './UserManagementView';
import { AppSettingsView } from './AppSettingsView';
import {
  Plus,
  Key,
  Trophy,
  DollarSign,
  Users,
  Clock,
  Swords,
  Shield,
  Edit2,
  Check,
  RefreshCw,
  Flame,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  Settings,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    matches,
    users,
    transactions,
    updateMatchRoomCredentials,
    updateMatchStatus,
    deleteMatch,
    forceUnlockCredentials,
    setForceUnlockCredentials,
    resetAllData,
  } = useTournament();

  const [activeTab, setActiveTab] = useState<'matches' | 'users' | 'payments' | 'settings' | 'demo'>('matches');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMatchForPayout, setSelectedMatchForPayout] = useState<Match | null>(null);
  const [selectedMatchForEdit, setSelectedMatchForEdit] = useState<Match | null>(null);
  const [selectedMatchForSlots, setSelectedMatchForSlots] = useState<Match | null>(null);

  // Edit Room ID / Password modal
  const [editingRoomMatch, setEditingRoomMatch] = useState<Match | null>(null);
  const [editRoomId, setEditRoomId] = useState('');
  const [editRoomPass, setEditRoomPass] = useState('');
  const [roomSavedMsg, setRoomSavedMsg] = useState(false);

  // Delete confirm modal
  const [deleteConfirmMatch, setDeleteConfirmMatch] = useState<Match | null>(null);
  const [refundOnDelete, setRefundOnDelete] = useState(true);
  const [bannerAlert, setBannerAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const pendingPaymentsCount = transactions.filter((t) => t.status === 'pending').length;
  const liveMatches = matches.filter((m) => m.status === 'live');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');
  const completedMatches = matches.filter((m) => m.status === 'completed');

  const totalPrizeDistributed = transactions
    .filter((t) => t.type === 'match_prize' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleOpenRoomModal = (match: Match) => {
    setEditingRoomMatch(match);
    setEditRoomId(match.roomId || '');
    setEditRoomPass(match.roomPassword || '');
    setRoomSavedMsg(false);
  };

  const handleSaveRoomCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoomMatch) return;

    updateMatchRoomCredentials(editingRoomMatch.id, editRoomId.trim(), editRoomPass.trim());
    setRoomSavedMsg(true);
    setTimeout(() => {
      setRoomSavedMsg(false);
      setEditingRoomMatch(null);
    }, 1000);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmMatch) return;
    const res = deleteMatch(deleteConfirmMatch.id, refundOnDelete);
    setBannerAlert({
      type: 'success',
      text: `Tournament "${deleteConfirmMatch.title}" deleted. ${
        res.refundedCount > 0
          ? `Refunded ৳${res.totalRefunded} BDT to ${res.refundedCount} joined players.`
          : 'No entry fees needed to be refunded.'
      }`,
    });
    setDeleteConfirmMatch(null);
    setTimeout(() => setBannerAlert(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner & Quick Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-semibold mb-1">
              <Shield className="w-4 h-4 text-rose-500" />
              <span>Full Esports Operations & Control Center</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white">
              FireArena Master Admin Panel
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              ম্যাচ তৈরি, রুম আইডি/পাসওয়ার্ড পুশ, খেলোয়াড়দের স্লট নিয়ন্ত্রণ, ওয়ালেট ব্যালেন্স যোগ/বিয়োগ, এবং বিকাশ ও নগদ পেমেন্ট কন্ট্রোল।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="py-2.5 px-4 bg-gradient-to-r from-[#ff4655] to-[#f97316] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#ff4655]/20 hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Create Tournament
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 font-mono">
          <div>
            <span className="text-[11px] text-slate-400 block uppercase">Tournaments</span>
            <span className="text-2xl font-bold text-white tabular-nums">{matches.length}</span>
            <span className="text-[10px] text-slate-500 block">
              {upcomingMatches.length} Upcoming · {liveMatches.length} Live
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block uppercase">Registered Gamers</span>
            <span className="text-2xl font-bold text-emerald-400 tabular-nums">{users.length}</span>
            <span className="text-[10px] text-slate-500 block">
              {users.filter((u) => u.role === 'player').length} Active Players
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block uppercase">Pending Payouts / Requests</span>
            <span
              className={`text-2xl font-bold tabular-nums ${
                pendingPaymentsCount > 0 ? 'text-[#f97316]' : 'text-emerald-400'
              }`}
            >
              {pendingPaymentsCount}
            </span>
            <span className="text-[10px] text-slate-500 block">bKash/Nagad Verifications</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block uppercase">Prize Pool Paid</span>
            <span className="text-2xl font-bold text-[#eab308] tabular-nums">
              ৳{totalPrizeDistributed}
            </span>
            <span className="text-[10px] text-slate-500 block">Direct wallet credits</span>
          </div>
        </div>
      </div>

      {bannerAlert && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            bannerAlert.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/80 border border-rose-500/50 text-rose-200'
          }`}
        >
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{bannerAlert.text}</span>
        </div>
      )}

      {/* Main Tabs Segmented Control */}
      <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'matches' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Swords className="w-3.5 h-3.5 text-[#ff4655]" />
          Match Operations ({matches.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'users' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          User & Wallet Control ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'payments' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          Payment Approvals
          {pendingPaymentsCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-[10px] font-bold text-white">
              {pendingPaymentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-[#f97316]" />
          Gateway & Live Notice Settings
        </button>

        <button
          onClick={() => setActiveTab('demo')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'demo' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          Demo Utilities
        </button>
      </div>

      {/* TAB 1: MATCH OPERATIONS */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          {matches.map((match) => {
            const slotsCount = match.participants.length;
            const isCompleted = match.status === 'completed';

            return (
              <div
                key={match.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Match Details */}
                <div className="flex items-start gap-4">
                  <img
                    src={match.bannerImage}
                    alt={match.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#f97316]">
                      <span>{match.map}</span>
                      <span aria-hidden="true">·</span>
                      <span>{match.gameMode}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-white font-bold">{match.matchType}</span>
                    </div>

                    <h3 className="font-display text-base font-bold text-white">
                      {match.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>Fee: ৳{match.entryFee}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#ff4655]">Per Kill: ৳{match.perKillReward}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-300">
                        Slots: <strong>{slotsCount}</strong> / {match.totalSlots}
                      </span>
                    </div>

                    {/* Room credentials badge */}
                    <div className="flex items-center gap-2 text-xs font-mono pt-1">
                      <span className="text-slate-500">Room:</span>
                      {match.roomId ? (
                        <span className="text-indigo-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          ID: {match.roomId} · Pass: {match.roomPassword || 'None'}
                        </span>
                      ) : (
                        <span className="text-amber-400">Not configured</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Selector & Actions */}
                <div className="flex flex-wrap items-center gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800">
                  {/* Status Dropdown */}
                  <select
                    value={match.status}
                    onChange={(e) => updateMatchStatus(match.id, e.target.value as MatchStatus)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff4655]"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live Battle</option>
                    <option value="completed">Completed</option>
                  </select>

                  {/* Push Room Credentials */}
                  <button
                    onClick={() => handleOpenRoomModal(match)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Broadcast Room ID & Password to participants"
                  >
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    Push Room
                  </button>

                  {/* Slot & Players Management */}
                  <button
                    onClick={() => setSelectedMatchForSlots(match)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="View & manage slot allocation and kick/assign players"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    Slots ({slotsCount})
                  </button>

                  {/* Edit Match */}
                  <button
                    onClick={() => setSelectedMatchForEdit(match)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Edit tournament parameters"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-300" />
                    Edit
                  </button>

                  {/* Result & Auto Payout Trigger */}
                  <button
                    onClick={() => setSelectedMatchForPayout(match)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-slate-800 text-[#eab308] hover:bg-slate-700'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 hover:opacity-95'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    {isCompleted ? 'Results' : 'Payout'}
                  </button>

                  {/* Delete Match Button */}
                  <button
                    onClick={() => {
                      setDeleteConfirmMatch(match);
                      setRefundOnDelete(true);
                    }}
                    className="p-2 bg-slate-950 hover:bg-rose-950 text-slate-500 hover:text-rose-400 border border-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Delete or cancel tournament (with refund)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: USER & WALLET CONTROL */}
      {activeTab === 'users' && <UserManagementView />}

      {/* TAB 3: PAYMENT APPROVALS */}
      {activeTab === 'payments' && <PaymentsApprovalView />}

      {/* TAB 4: SETTINGS & GATEWAYS */}
      {activeTab === 'settings' && <AppSettingsView />}

      {/* TAB 5: DEMO UTILITIES */}
      {activeTab === 'demo' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Demonstration & Testing Utilities
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tools to rapidly inspect end-to-end player and admin flows without waiting for match timers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Room unlock toggle */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-mono">
                  Room Credentials Lock Bypass
                </span>
                <button
                  onClick={() => setForceUnlockCredentials(!forceUnlockCredentials)}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    forceUnlockCredentials
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {forceUnlockCredentials ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
              <p className="text-slate-400 leading-normal">
                By default, players only see Room ID & Password 15 minutes before the match start time. Enabling this bypass makes room credentials visible immediately for all test matches.
              </p>
            </div>

            {/* Reset data */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-400 font-mono">
                  Reset Demo State to Fresh
                </span>
                <button
                  onClick={() => {
                    if (confirm('Reset all match registrations, wallets, and test transactions?')) {
                      resetAllData();
                    }
                  }}
                  className="px-3 py-1 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 font-bold transition-colors cursor-pointer"
                >
                  Reset All Data
                </button>
              </div>
              <p className="text-slate-400 leading-normal">
                Restores original seeded matches (Bermuda #101, Purgatory Squad #102, Lone Wolf #104), seeded wallets, and clean test state.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Match Modal */}
      {showCreateModal && <CreateMatchModal onClose={() => setShowCreateModal(false)} />}

      {/* Edit Match Modal */}
      {selectedMatchForEdit && (
        <EditMatchModal
          match={selectedMatchForEdit}
          onClose={() => setSelectedMatchForEdit(null)}
        />
      )}

      {/* Match Slots Manager Modal */}
      {selectedMatchForSlots && (
        <MatchSlotsModal
          match={selectedMatchForSlots}
          onClose={() => setSelectedMatchForSlots(null)}
        />
      )}

      {/* Results Submission & Auto Payout Modal */}
      {selectedMatchForPayout && (
        <ResultSubmissionModal
          match={selectedMatchForPayout}
          onClose={() => setSelectedMatchForPayout(null)}
        />
      )}

      {/* Push Room Credentials Modal */}
      {editingRoomMatch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-base font-bold text-white">
                  Push Room ID & Password
                </h4>
                <p className="text-xs text-slate-400">{editingRoomMatch.title}</p>
              </div>
              <button
                onClick={() => setEditingRoomMatch(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveRoomCredentials} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Custom Room ID (from Free Fire) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 7482910"
                  value={editRoomId}
                  onChange={(e) => setEditRoomId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Room Password *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1234 or booyah"
                  value={editRoomPass}
                  onChange={(e) => setEditRoomPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <p className="text-[11px] text-indigo-300">
                ⚡ Only players who joined this match will be able to see these credentials when unlocked.
              </p>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRoomMatch(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-[#ff4655] to-[#f97316] text-white font-bold rounded-lg cursor-pointer flex items-center gap-1"
                >
                  {roomSavedMsg ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Saved!
                    </>
                  ) : (
                    'Save & Broadcast'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Cancel Match Modal */}
      {deleteConfirmMatch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/50 rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-base text-white">
                  Cancel & Delete Tournament?
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  "{deleteConfirmMatch.title}" ({deleteConfirmMatch.participants.length} players enrolled)
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={refundOnDelete}
                  onChange={(e) => setRefundOnDelete(e.target.checked)}
                  className="rounded text-[#ff4655]"
                />
                <span>
                  Refund ৳{deleteConfirmMatch.entryFee} BDT entry fee to all {deleteConfirmMatch.participants.length} enrolled players
                </span>
              </label>
              <p className="text-[11px] text-slate-500">
                Total refund pool: ৳{deleteConfirmMatch.entryFee * deleteConfirmMatch.participants.length} BDT
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setDeleteConfirmMatch(null)}
                className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Confirm Delete & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
