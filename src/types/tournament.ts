export type MatchType = 'Solo' | 'Duo' | 'Squad';

export type GameMode = 'Battle Royale' | 'Clash Squad' | 'Lone Wolf';

export type FreeFireMap = 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'Nexterra';

export type MatchStatus = 'upcoming' | 'live' | 'completed';

export interface PlacementPrize {
  rank: number;
  label: string;
  prize: number;
}

export interface MatchParticipant {
  userId: string;
  userName: string;
  userPhone: string;
  ign: string;
  uid: string;
  slotNumber: number;
  teamName?: string;
  teammates?: { ign: string; uid: string }[];
  joinedAt: string;
}

export interface MatchResult {
  userId: string;
  ign: string;
  slotNumber: number;
  kills: number;
  placementRank: number;
  killReward: number;
  placementReward: number;
  totalReward: number;
  paid: boolean;
}

export interface Match {
  id: string;
  title: string;
  gameMode: GameMode;
  matchType: MatchType;
  map: FreeFireMap;
  customRules: string[];
  entryFee: number;
  perKillReward: number;
  placementPrizes: PlacementPrize[];
  startTime: string; // ISO string
  status: MatchStatus;
  totalSlots: number;
  bannerImage: string;
  roomId?: string;
  roomPassword?: string;
  roomRevealedAtMinutes: number; // default 15
  proofScreenshotUrl?: string;
  participants: MatchParticipant[];
  results?: MatchResult[];
  payoutExecuted?: boolean;
  createdAt: string;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'entry_fee' | 'match_prize' | 'refund';
export type PaymentMethod = 'bKash' | 'Nagad' | 'In-App Wallet';
export type TransactionStatus = 'pending' | 'approved' | 'rejected';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  type: TransactionType;
  amount: number;
  paymentMethod: PaymentMethod;
  accountNumber?: string;
  trxId?: string;
  screenshotUrl?: string;
  status: TransactionStatus;
  createdAt: string;
  note?: string;
  matchId?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  ign: string; // Free Fire In-game Name
  uid: string; // Free Fire UID
  avatar: string;
  role: 'player' | 'admin';
  walletBalance: number;
  totalWon: number;
  matchesPlayed: number;
  totalKills: number;
  isBanned?: boolean;
}

export interface AppSettings {
  bkashNumber: string;
  nagadNumber: string;
  minWithdrawal: number;
  minDeposit: number;
  globalNotice: string;
  isNoticeActive: boolean;
  supportPhone: string;
}
