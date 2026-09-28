import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { User } from '../../types/tournament';
import {
  Users,
  Search,
  Plus,
  Edit2,
  DollarSign,
  Ban,
  CheckCircle,
  Shield,
  Smartphone,
  Trophy,
  Swords,
  X,
  Check,
  AlertCircle,
  UserCheck,
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { users, adjustUserWallet, updateAnyUser, toggleUserBan, addNewUser } = useTournament();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'player' | 'admin'>('all');

  // Modals state
  const [balanceModalUser, setBalanceModalUser] = useState<User | null>(null);
  const [balanceAmount, setBalanceAmount] = useState<number>(50);
  const [balanceIsAdd, setBalanceIsAdd] = useState<boolean>(true);
  const [balanceNote, setBalanceNote] = useState<string>('Bonus / Tournament adjustment');

  const [editUserModal, setEditUserModal] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editIgn, setEditIgn] = useState('');
  const [editUid, setEditUid] = useState('');
  const [editRole, setEditRole] = useState<'player' | 'admin'>('player');

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newIgn, setNewIgn] = useState('');
  const [newUid, setNewUid] = useState('');
  const [newInitialBalance, setNewInitialBalance] = useState(100);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchIgn = (u.ign || '').toLowerCase().includes(q);
      const matchUid = (u.uid || '').includes(q);
      const matchPhone = (u.phone || '').includes(q);
      if (!matchName && !matchIgn && !matchUid && !matchPhone) return false;
    }
    return true;
  });

  const handleOpenBalanceModal = (user: User) => {
    setBalanceModalUser(user);
    setBalanceAmount(50);
    setBalanceIsAdd(true);
    setBalanceNote('Admin balance adjustment');
  };

  const handleSaveBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!balanceModalUser) return;
    if (balanceAmount <= 0) return;

    adjustUserWallet(balanceModalUser.id, balanceAmount, balanceIsAdd, balanceNote);
    setNotification({
      type: 'success',
      text: `${balanceIsAdd ? 'Added' : 'Deducted'} ৳${balanceAmount} BDT to ${balanceModalUser.ign || balanceModalUser.name}'s wallet.`,
    });
    setBalanceModalUser(null);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenEditUser = (user: User) => {
    setEditUserModal(user);
    setEditName(user.name);
    setEditPhone(user.phone);
    setEditIgn(user.ign);
    setEditUid(user.uid);
    setEditRole(user.role);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUserModal) return;

    updateAnyUser(editUserModal.id, {
      name: editName.trim(),
      phone: editPhone.trim(),
      ign: editIgn.trim(),
      uid: editUid.trim(),
      role: editRole,
    });

    setNotification({
      type: 'success',
      text: `Updated profile for ${editIgn || editName} successfully.`,
    });
    setEditUserModal(null);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIgn.trim() || !newUid.trim()) return;

    addNewUser({
      name: newName.trim() || newIgn.trim(),
      phone: newPhone.trim() || '01XXXXXXXXX',
      email: newEmail.trim() || `${newIgn.toLowerCase().replace(/\s+/g, '')}@player.com`,
      ign: newIgn.trim(),
      uid: newUid.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${newIgn}&backgroundColor=0f172a`,
      role: 'player',
      walletBalance: Number(newInitialBalance),
    });

    setNotification({
      type: 'success',
      text: `Created user account for ${newIgn} with ৳${newInitialBalance} BDT balance.`,
    });
    setShowAddUserModal(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewIgn('');
    setNewUid('');
    setNewInitialBalance(100);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Search, Filter, Add User */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by IGN, UID, Phone, Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff4655]"
            />
          </div>

          <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-lg text-xs">
            {(['all', 'player', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded-md capitalize cursor-pointer transition-colors ${
                  roleFilter === r
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'all' ? 'All Users' : `${r}s`}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Player Account
        </button>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/80 border border-rose-500/40 text-rose-200'
          }`}
        >
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{notification.text}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">Player & Free Fire Profile</th>
                <th className="py-3 px-4">Phone / Contact</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Wallet Balance</th>
                <th className="py-3 px-4 text-right">Winnings</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-950/40">
                  {/* Player info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span>{user.ign || user.name}</span>
                          {user.isBanned && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-500/30">
                              BANNED
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <span>UID:</span>
                          <span className="text-slate-300 font-bold">{user.uid || 'Not set'}</span>
                          <span className="text-slate-600">·</span>
                          <span>{user.name}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="py-3 px-4 text-slate-300">
                    <div>{user.phone || 'N/A'}</div>
                    <div className="text-[10px] text-slate-500">{user.email || ''}</div>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        user.role === 'admin'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleUserBan(user.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        user.isBanned
                          ? 'bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/30'
                      }`}
                      title={user.isBanned ? 'Click to unban' : 'Click to ban'}
                    >
                      {user.isBanned ? 'BANNED' : 'ACTIVE'}
                    </button>
                  </td>

                  {/* Wallet Balance */}
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold text-sm text-emerald-400 tabular-nums">
                      ৳{user.walletBalance}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1">BDT</span>
                  </td>

                  {/* Total Won */}
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold text-sm text-[#eab308] tabular-nums">
                      ৳{user.totalWon}
                    </span>
                    <div className="text-[10px] text-slate-500">
                      {user.matchesPlayed} matches · {user.totalKills} kills
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenBalanceModal(user)}
                        className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/20 cursor-pointer transition-colors"
                        title="Adjust Wallet Balance (Add / Deduct)"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditUser(user)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer transition-colors"
                        title="Edit User Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleUserBan(user.id)}
                        className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                          user.isBanned
                            ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                            : 'bg-slate-800 text-slate-400 hover:text-rose-400'
                        }`}
                        title={user.isBanned ? 'Unban User' : 'Ban User from tournaments'}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADJUST BALANCE */}
      {balanceModalUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-display font-bold text-base text-white">
                  Adjust Wallet Balance
                </h4>
                <p className="text-xs text-slate-400">
                  Player: <strong className="text-white">{balanceModalUser.ign || balanceModalUser.name}</strong> (Current: ৳{balanceModalUser.walletBalance} BDT)
                </p>
              </div>
              <button
                onClick={() => setBalanceModalUser(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBalance} className="space-y-4 text-xs">
              {/* Type: Add or Deduct */}
              <div>
                <label className="block text-slate-400 font-mono mb-1.5">Action Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBalanceIsAdd(true)}
                    className={`py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                      balanceIsAdd
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    + Add Money (Credit)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBalanceIsAdd(false)}
                    className={`py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                      !balanceIsAdd
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    - Deduct Money (Debit)
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Amount in BDT *
                </label>
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-base font-bold font-mono text-white focus:outline-none focus:border-emerald-500"
                  required
                />
                <div className="flex gap-1.5 mt-2">
                  {[20, 50, 100, 200, 500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setBalanceAmount(amt)}
                      className="px-2.5 py-1 bg-slate-950 text-slate-300 border border-slate-800 rounded-lg cursor-pointer"
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason / Note */}
              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Reason / Audit Note *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tournament prize correction, manual cash received..."
                  value={balanceNote}
                  onChange={(e) => setBalanceNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              {/* New preview balance */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-400">New Balance after adjustment:</span>
                <span className="font-mono font-bold text-white text-sm">
                  ৳
                  {Math.max(
                    0,
                    balanceIsAdd
                      ? balanceModalUser.walletBalance + balanceAmount
                      : balanceModalUser.walletBalance - balanceAmount
                  )}{' '}
                  BDT
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBalanceModalUser(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-bold uppercase tracking-wider text-white rounded-xl cursor-pointer ${
                    balanceIsAdd ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER */}
      {editUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-display font-bold text-base text-white">
                Edit Player Profile
              </h4>
              <button
                onClick={() => setEditUserModal(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Free Fire In-Game Name (IGN) *
                </label>
                <input
                  type="text"
                  value={editIgn}
                  onChange={(e) => setEditIgn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Free Fire 10-Digit UID *
                </label>
                <input
                  type="text"
                  value={editUid}
                  onChange={(e) => setEditUid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Account Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as 'player' | 'admin')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="player">Player (Normal User)</option>
                  <option value="admin">Admin (Host Operator)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditUserModal(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#ff4655] to-[#f97316] text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEW USER */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-display font-bold text-base text-white">
                Create New Player Account
              </h4>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Free Fire In-Game Name (IGN) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 亗_WARRIOR_亗"
                  value={newIgn}
                  onChange={(e) => setNewIgn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Free Fire UID (User ID) *
                </label>
                <input
                  type="text"
                  placeholder="10-digit number e.g. 2938102948"
                  value={newUid}
                  onChange={(e) => setNewUid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Real Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">bKash Phone</label>
                  <input
                    type="text"
                    placeholder="01XXXXXXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">
                  Initial Starting Wallet Balance (BDT)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={newInitialBalance}
                  onChange={(e) => setNewInitialBalance(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl cursor-pointer"
                >
                  Create Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
