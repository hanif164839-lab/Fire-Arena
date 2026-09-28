import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, Match, MatchParticipant, MatchResult, MatchStatus, PaymentMethod, Transaction, User } from '../types/tournament';
import { INITIAL_MATCHES, INITIAL_TRANSACTIONS, INITIAL_USERS } from '../data/mockData';

export const DEFAULT_APP_SETTINGS: AppSettings = {
  bkashNumber: '01934407239',
  nagadNumber: '01305894384',
  minWithdrawal: 50,
  minDeposit: 10,
  globalNotice: '🔥 আজ রাত ৯:০০ টায় গ্র্যান্ড টুর্নামেন্ট! সময়মতো রুমে প্রবেশ করুন। বিকাশ ও নগদ ডিপোজিট ৫ মিনিটে ভেরিফাইড!',
  isNoticeActive: true,
  supportPhone: '01934407239',
};

interface JoinMatchParams {
  matchId: string;
  slotNumber: number;
  teamName?: string;
  teammates?: { ign: string; uid: string }[];
}

interface TournamentContextType {
  currentUser: User;
  users: User[];
  matches: Match[];
  transactions: Transaction[];
  appSettings: AppSettings;
  forceUnlockCredentials: boolean;
  setForceUnlockCredentials: (unlock: boolean) => void;
  setCurrentUserById: (userId: string) => void;
  updateUserProfile: (data: Partial<User>) => void;
  updateAppSettings: (newSettings: Partial<AppSettings>) => void;
  // Match Controls
  createMatch: (matchData: Omit<Match, 'id' | 'createdAt' | 'participants' | 'status'>) => void;
  editMatch: (matchId: string, updatedData: Partial<Match>) => void;
  deleteMatch: (matchId: string, refundParticipants?: boolean) => { refundedCount: number; totalRefunded: number };
  kickParticipantFromMatch: (matchId: string, userId: string, refundFee?: boolean) => void;
  assignSlotToUser: (matchId: string, slotNumber: number, targetUserId: string) => { success: boolean; message: string };
  updateMatchRoomCredentials: (matchId: string, roomId: string, roomPassword: string) => void;
  updateMatchStatus: (matchId: string, status: MatchStatus) => void;
  joinMatch: (params: JoinMatchParams) => { success: boolean; message: string };
  submitMatchResultsAndPayout: (
    matchId: string,
    results: Array<{
      userId: string;
      ign: string;
      slotNumber: number;
      kills: number;
      placementRank: number;
    }>,
    proofScreenshotUrl?: string
  ) => { success: boolean; message: string };
  // User & Wallet Controls
  adjustUserWallet: (userId: string, amount: number, isAddition: boolean, note: string) => void;
  updateAnyUser: (userId: string, data: Partial<User>) => void;
  toggleUserBan: (userId: string) => void;
  addNewUser: (user: Omit<User, 'id' | 'totalWon' | 'matchesPlayed' | 'totalKills'>) => void;
  // Financial
  requestDeposit: (params: {
    method: PaymentMethod;
    amount: number;
    accountNumber: string;
    trxId: string;
    screenshotUrl?: string;
  }) => { success: boolean; message: string };
  requestWithdrawal: (params: {
    method: PaymentMethod;
    amount: number;
    accountNumber: string;
  }) => { success: boolean; message: string };
  approveTransaction: (transactionId: string) => void;
  rejectTransaction: (transactionId: string, reason?: string) => void;
  resetAllData: () => void;
}

const STORAGE_KEY_USERS = 'firearena_users_v1';
const STORAGE_KEY_MATCHES = 'firearena_matches_v1';
const STORAGE_KEY_TRANSACTIONS = 'firearena_transactions_v1';
const STORAGE_KEY_CURRENT_USER = 'firearena_cur_user_v1';
const STORAGE_KEY_SETTINGS = 'firearena_settings_v1';

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      return saved || 'user_player_1';
    } catch {
      return 'user_player_1';
    }
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MATCHES);
      return saved ? JSON.parse(saved) : INITIAL_MATCHES;
    } catch {
      return INITIAL_MATCHES;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If still old placeholder numbers, override with requested numbers
        if (parsed.bkashNumber === '01812345678') parsed.bkashNumber = '01934407239';
        if (parsed.nagadNumber === '01798765432') parsed.nagadNumber = '01305894384';
        if (parsed.supportPhone === '01812345678') parsed.supportPhone = '01934407239';
        return { ...DEFAULT_APP_SETTINGS, ...parsed };
      }
      return DEFAULT_APP_SETTINGS;
    } catch {
      return DEFAULT_APP_SETTINGS;
    }
  });

  const [forceUnlockCredentials, setForceUnlockCredentials] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, currentUserId);
    } catch (e) {
      console.error(e);
    }
  }, [currentUserId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(matches));
    } catch (e) {
      console.error(e);
    }
  }, [matches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(appSettings));
    } catch (e) {
      console.error(e);
    }
  }, [appSettings]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const setCurrentUserById = (userId: string) => {
    setCurrentUserId(userId);
  };

  const updateUserProfile = (data: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...data } : u))
    );
  };

  const updateAppSettings = (newSettings: Partial<AppSettings>) => {
    setAppSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Match Controls
  const createMatch = (matchData: Omit<Match, 'id' | 'createdAt' | 'participants' | 'status'>) => {
    const newMatch: Match = {
      ...matchData,
      id: `match_${Date.now()}`,
      status: 'upcoming',
      participants: [],
      createdAt: new Date().toISOString(),
    };
    setMatches((prev) => [newMatch, ...prev]);
  };

  const editMatch = (matchId: string, updatedData: Partial<Match>) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, ...updatedData } : m))
    );
  };

  const deleteMatch = (matchId: string, refundParticipants: boolean = true) => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return { refundedCount: 0, totalRefunded: 0 };

    let refundedCount = 0;
    let totalRefunded = 0;

    if (refundParticipants && targetMatch.participants.length > 0) {
      const refundTxs: Transaction[] = [];

      setUsers((prevUsers) => {
        const updated = [...prevUsers];
        targetMatch.participants.forEach((p) => {
          const userIdx = updated.findIndex((u) => u.id === p.userId);
          if (userIdx !== -1) {
            updated[userIdx] = {
              ...updated[userIdx],
              walletBalance: updated[userIdx].walletBalance + targetMatch.entryFee,
              matchesPlayed: Math.max(0, updated[userIdx].matchesPlayed - 1),
            };

            refundedCount++;
            totalRefunded += targetMatch.entryFee;

            refundTxs.push({
              id: `trx_ref_${Date.now()}_${p.userId}`,
              userId: p.userId,
              userName: p.userName,
              userPhone: p.userPhone,
              type: 'refund',
              amount: targetMatch.entryFee,
              paymentMethod: 'In-App Wallet',
              status: 'approved',
              matchId,
              createdAt: new Date().toISOString(),
              note: `Refund: Tournament "${targetMatch.title}" was cancelled by Admin.`,
            });
          }
        });
        return updated;
      });

      if (refundTxs.length > 0) {
        setTransactions((prev) => [...refundTxs, ...prev]);
      }
    }

    setMatches((prev) => prev.filter((m) => m.id !== matchId));
    return { refundedCount, totalRefunded };
  };

  const kickParticipantFromMatch = (matchId: string, userId: string, refundFee: boolean = true) => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;

    const participant = targetMatch.participants.find((p) => p.userId === userId);
    if (!participant) return;

    if (refundFee) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                walletBalance: u.walletBalance + targetMatch.entryFee,
                matchesPlayed: Math.max(0, u.matchesPlayed - 1),
              }
            : u
        )
      );

      const refundTx: Transaction = {
        id: `trx_kick_${Date.now()}_${userId}`,
        userId,
        userName: participant.userName,
        userPhone: participant.userPhone,
        type: 'refund',
        amount: targetMatch.entryFee,
        paymentMethod: 'In-App Wallet',
        status: 'approved',
        matchId,
        createdAt: new Date().toISOString(),
        note: `Refund: Removed from slot #${participant.slotNumber} in "${targetMatch.title}" by Admin.`,
      };
      setTransactions((prev) => [refundTx, ...prev]);
    }

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, participants: m.participants.filter((p) => p.userId !== userId) }
          : m
      )
    );
  };

  const assignSlotToUser = (matchId: string, slotNumber: number, targetUserId: string) => {
    const match = matches.find((m) => m.id === matchId);
    const targetUser = users.find((u) => u.id === targetUserId);
    if (!match || !targetUser) return { success: false, message: 'Match or User not found' };

    // Check if slot occupied
    const occupied = match.participants.find((p) => p.slotNumber === slotNumber);
    if (occupied) {
      return { success: false, message: `Slot #${slotNumber} is already occupied by ${occupied.ign}` };
    }

    const newParticipant: MatchParticipant = {
      userId: targetUser.id,
      userName: targetUser.name,
      userPhone: targetUser.phone,
      ign: targetUser.ign || targetUser.name,
      uid: targetUser.uid || '1000000000',
      slotNumber,
      joinedAt: new Date().toISOString(),
    };

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              participants: [
                ...m.participants.filter((p) => p.userId !== targetUserId),
                newParticipant,
              ],
            }
          : m
      )
    );

    return { success: true, message: `Assigned ${targetUser.name} to Slot #${slotNumber}` };
  };

  // User & Wallet Controls
  const adjustUserWallet = (userId: string, amount: number, isAddition: boolean, note: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const delta = isAddition ? amount : -amount;
    const newBalance = Math.max(0, user.walletBalance + delta);

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, walletBalance: newBalance } : u))
    );

    const auditTx: Transaction = {
      id: `trx_adj_${Date.now()}_${userId}`,
      userId,
      userName: user.name,
      userPhone: user.phone,
      type: isAddition ? 'deposit' : 'withdrawal',
      amount,
      paymentMethod: 'In-App Wallet',
      status: 'approved',
      createdAt: new Date().toISOString(),
      note: `Admin Manual Adjustment: ${note} (${isAddition ? '+৳' : '-৳'}${amount} BDT)`,
    };

    setTransactions((prev) => [auditTx, ...prev]);
  };

  const updateAnyUser = (userId: string, data: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...data } : u))
    );
  };

  const toggleUserBan = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: !u.isBanned } : u))
    );
  };

  const addNewUser = (userData: Omit<User, 'id' | 'totalWon' | 'matchesPlayed' | 'totalKills'>) => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      totalWon: 0,
      matchesPlayed: 0,
      totalKills: 0,
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateMatchRoomCredentials = (matchId: string, roomId: string, roomPassword: string) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, roomId, roomPassword }
          : m
      )
    );
  };

  const updateMatchStatus = (matchId: string, status: MatchStatus) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, status }
          : m
      )
    );
  };

  const joinMatch = ({ matchId, slotNumber, teamName, teammates }: JoinMatchParams): { success: boolean; message: string } => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return { success: false, message: 'Match not found' };

    if (currentUser.isBanned) {
      return { success: false, message: 'Your account has been suspended by Admin. Please contact support.' };
    }

    if (!currentUser.ign || !currentUser.uid) {
      return { success: false, message: 'Please set your Free Fire IGN and UID before joining matches.' };
    }

    // Check if match is full
    if (match.participants.length >= match.totalSlots) {
      return { success: false, message: 'This tournament is already full!' };
    }

    // Check if already joined
    const alreadyJoined = match.participants.some((p) => p.userId === currentUser.id);
    if (alreadyJoined) {
      return { success: false, message: 'You have already registered for this match!' };
    }

    // Check if slot taken
    const slotTaken = match.participants.some((p) => p.slotNumber === slotNumber);
    if (slotTaken) {
      return { success: false, message: `Slot #${slotNumber} is already occupied. Please pick another slot.` };
    }

    // Check wallet balance
    if (currentUser.walletBalance < match.entryFee) {
      return {
        success: false,
        message: `Insufficient wallet balance (${currentUser.walletBalance} BDT). Entry fee is ${match.entryFee} BDT. Please add money via bKash/Nagad.`,
      };
    }

    // Deduct entry fee
    const updatedBalance = currentUser.walletBalance - match.entryFee;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, walletBalance: updatedBalance, matchesPlayed: u.matchesPlayed + 1 }
          : u
      )
    );

    // Create participant entry
    const newParticipant: MatchParticipant = {
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      ign: currentUser.ign,
      uid: currentUser.uid,
      slotNumber,
      teamName,
      teammates,
      joinedAt: new Date().toISOString(),
    };

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, participants: [...m.participants, newParticipant] }
          : m
      )
    );

    // Record transaction
    const newTx: Transaction = {
      id: `trx_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      type: 'entry_fee',
      amount: match.entryFee,
      paymentMethod: 'In-App Wallet',
      status: 'approved',
      matchId: match.id,
      createdAt: new Date().toISOString(),
      note: `Entry Fee for ${match.title} (Slot #${slotNumber})`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    return { success: true, message: `Successfully registered for ${match.title}! Slot #${slotNumber} confirmed.` };
  };

  const submitMatchResultsAndPayout = (
    matchId: string,
    resultsInput: Array<{
      userId: string;
      ign: string;
      slotNumber: number;
      kills: number;
      placementRank: number;
    }>,
    proofScreenshotUrl?: string
  ): { success: boolean; message: string } => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return { success: false, message: 'Match not found' };

    const computedResults: MatchResult[] = resultsInput.map((r) => {
      const placementPrizeObj = match.placementPrizes.find((p) => p.rank === r.placementRank);
      const placementReward = placementPrizeObj ? placementPrizeObj.prize : 0;
      const killReward = (r.kills || 0) * match.perKillReward;
      const totalReward = placementReward + killReward;

      return {
        userId: r.userId,
        ign: r.ign,
        slotNumber: r.slotNumber,
        kills: r.kills,
        placementRank: r.placementRank,
        killReward,
        placementReward,
        totalReward,
        paid: true,
      };
    });

    // Credit wallets and create prize transactions
    const newTransactions: Transaction[] = [];

    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      computedResults.forEach((res) => {
        if (res.totalReward > 0) {
          const userIdx = updatedUsers.findIndex((u) => u.id === res.userId);
          if (userIdx !== -1) {
            updatedUsers[userIdx] = {
              ...updatedUsers[userIdx],
              walletBalance: updatedUsers[userIdx].walletBalance + res.totalReward,
              totalWon: updatedUsers[userIdx].totalWon + res.totalReward,
              totalKills: updatedUsers[userIdx].totalKills + res.kills,
            };

            newTransactions.push({
              id: `trx_win_${Date.now()}_${res.userId}`,
              userId: res.userId,
              userName: updatedUsers[userIdx].name,
              userPhone: updatedUsers[userIdx].phone,
              type: 'match_prize',
              amount: res.totalReward,
              paymentMethod: 'In-App Wallet',
              status: 'approved',
              matchId,
              createdAt: new Date().toISOString(),
              note: `Match Prize: ${res.kills} Kills (${res.killReward} BDT) + Rank #${res.placementRank} (${res.placementReward} BDT) in ${match.title}`,
            });
          }
        }
      });
      return updatedUsers;
    });

    if (newTransactions.length > 0) {
      setTransactions((prev) => [...newTransactions, ...prev]);
    }

    // Update match to completed with results
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              status: 'completed',
              payoutExecuted: true,
              results: computedResults,
              proofScreenshotUrl: proofScreenshotUrl || m.proofScreenshotUrl,
            }
          : m
      )
    );

    return {
      success: true,
      message: `Match results published and payouts successfully credited to ${computedResults.filter((r) => r.totalReward > 0).length} players!`,
    };
  };

  const requestDeposit = ({
    method,
    amount,
    accountNumber,
    trxId,
    screenshotUrl,
  }: {
    method: PaymentMethod;
    amount: number;
    accountNumber: string;
    trxId: string;
    screenshotUrl?: string;
  }) => {
    if (amount <= 0) return { success: false, message: 'Amount must be greater than 0' };
    if (!trxId.trim()) return { success: false, message: 'Transaction ID is required' };

    const newTx: Transaction = {
      id: `trx_dep_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      type: 'deposit',
      amount,
      paymentMethod: method,
      accountNumber,
      trxId: trxId.trim().toUpperCase(),
      screenshotUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
      note: `Deposit via ${method} (${accountNumber})`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    return {
      success: true,
      message: `Deposit request of ${amount} BDT submitted! Admin will verify TrxID (${trxId}) shortly.`,
    };
  };

  const requestWithdrawal = ({
    method,
    amount,
    accountNumber,
  }: {
    method: PaymentMethod;
    amount: number;
    accountNumber: string;
  }) => {
    if (amount < 50) {
      return { success: false, message: 'Minimum withdrawal limit is 50 BDT.' };
    }
    if (currentUser.walletBalance < amount) {
      return {
        success: false,
        message: `Insufficient balance! Your current balance is ${currentUser.walletBalance} BDT.`,
      };
    }
    if (!accountNumber.trim()) {
      return { success: false, message: 'Please provide your bKash/Nagad number.' };
    }

    // Deduct immediately to prevent double spending
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, walletBalance: u.walletBalance - amount }
          : u
      )
    );

    const newTx: Transaction = {
      id: `trx_wdr_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      type: 'withdrawal',
      amount,
      paymentMethod: method,
      accountNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
      note: `Withdrawal request to ${method} (${accountNumber})`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    return {
      success: true,
      message: `Withdrawal request of ${amount} BDT submitted! Admin will send payment within 15-30 minutes.`,
    };
  };

  const approveTransaction = (transactionId: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx || tx.status !== 'pending') return;

    if (tx.type === 'deposit') {
      // Add balance to user
      setUsers((prev) =>
        prev.map((u) =>
          u.id === tx.userId
            ? { ...u, walletBalance: u.walletBalance + tx.amount }
            : u
        )
      );
    }
    // If withdrawal approved, balance was already deducted on request

    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'approved' } : t))
    );
  };

  const rejectTransaction = (transactionId: string, reason?: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx || tx.status !== 'pending') return;

    if (tx.type === 'withdrawal') {
      // Refund balance to user
      setUsers((prev) =>
        prev.map((u) =>
          u.id === tx.userId
            ? { ...u, walletBalance: u.walletBalance + tx.amount }
            : u
        )
      );
    }

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? { ...t, status: 'rejected', note: reason ? `${t.note || ''} (Rejected: ${reason})` : `${t.note || ''} (Rejected by Admin)` }
          : t
      )
    );
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY_USERS);
    localStorage.removeItem(STORAGE_KEY_MATCHES);
    localStorage.removeItem(STORAGE_KEY_TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    setUsers(INITIAL_USERS);
    setCurrentUserId('user_player_1');
    setMatches(INITIAL_MATCHES);
    setTransactions(INITIAL_TRANSACTIONS);
  };

  return (
    <TournamentContext.Provider
      value={{
        currentUser,
        users,
        matches,
        transactions,
        appSettings,
        forceUnlockCredentials,
        setForceUnlockCredentials,
        setCurrentUserById,
        updateUserProfile,
        updateAppSettings,
        createMatch,
        editMatch,
        deleteMatch,
        kickParticipantFromMatch,
        assignSlotToUser,
        updateMatchRoomCredentials,
        updateMatchStatus,
        joinMatch,
        submitMatchResultsAndPayout,
        adjustUserWallet,
        updateAnyUser,
        toggleUserBan,
        addNewUser,
        requestDeposit,
        requestWithdrawal,
        approveTransaction,
        rejectTransaction,
        resetAllData,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
