import React from 'react';
import { X, Shield, AlertTriangle, Crosshair, Smartphone, CheckCircle, Clock } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                FireArena Fair Play & Tournament Rules
              </h3>
              <p className="text-xs text-slate-400">
                Official Free Fire Bangladesh Competitive Guidelines
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Rule 1: Room Joining */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#f97316]" />
              1. Room Access & Slot Number Discipline
            </h4>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-slate-400">
              <p>
                • Custom Room ID and Password will appear on the tournament page exactly <strong>15 minutes before</strong> the scheduled start time.
              </p>
              <p>
                • You MUST sit in your exact assigned <strong>Slot Number</strong>. Sitting in another player's slot is strictly prohibited and the host will kick you without refund.
              </p>
              <p>
                • The match will start promptly at the scheduled time. Latecomers cannot claim an entry fee refund.
              </p>
            </div>
          </div>

          {/* Rule 2: Device & Emulators */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#ff4655]" />
              2. Device & Emulator Policy
            </h4>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-slate-400">
              <p>
                • Mobile & Tablet players only. PC / Emulator (BlueStacks, LDPlayer, Gameloop, etc.) are <strong>strictly banned</strong> unless the tournament title explicitly says "PC Allowed".
              </p>
              <p>
                • Players detected on emulator will be kicked immediately and blacklisted from FireArena.
              </p>
            </div>
          </div>

          {/* Rule 3: Hacks & Fair Play */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              3. Zero Tolerance for Cheats & Exploits
            </h4>
            <div className="p-3 bg-rose-950/20 rounded-xl border border-rose-500/30 space-y-1.5 text-rose-200">
              <p>
                • Use of auto-aim, headshot scripts, location antenna, wall hacks, speed hacks, or modified game APKs results in an immediate permanent ban, account forfeiture, and prize confiscation.
              </p>
              <p>
                • Teaming up with opponents in Solo or Duo matches is strictly forbidden.
              </p>
            </div>
          </div>

          {/* Rule 4: Prize Pool & Proof */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              4. Proof Screenshots & Wallet Payouts
            </h4>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-slate-400">
              <p>
                • Always take a clear screenshot of your end-game match stats (showing placement rank & kill count) as proof in case of match disputes.
              </p>
              <p>
                • Winnings (Placement Prize + Kills * Rate) are automatically credited to your FireArena in-app wallet within 10–20 minutes of match completion.
              </p>
              <p>
                • Withdrawals can be made at any time to your bKash or Nagad account (minimum 50 BDT).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            I Understand the Rules
          </button>
        </div>
      </div>
    </div>
  );
};
