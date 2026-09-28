import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  Settings,
  Smartphone,
  Bell,
  DollarSign,
  PhoneCall,
  Check,
  ShieldCheck,
  AlertCircle,
  Eye,
  RotateCcw,
} from 'lucide-react';

export const AppSettingsView: React.FC = () => {
  const { appSettings, updateAppSettings, resetAllData } = useTournament();

  const [bkashNumber, setBkashNumber] = useState(appSettings.bkashNumber);
  const [nagadNumber, setNagadNumber] = useState(appSettings.nagadNumber);
  const [supportPhone, setSupportPhone] = useState(appSettings.supportPhone);
  const [minDeposit, setMinDeposit] = useState(appSettings.minDeposit);
  const [minWithdrawal, setMinWithdrawal] = useState(appSettings.minWithdrawal);
  const [globalNotice, setGlobalNotice] = useState(appSettings.globalNotice);
  const [isNoticeActive, setIsNoticeActive] = useState(appSettings.isNoticeActive);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppSettings({
      bkashNumber: bkashNumber.trim(),
      nagadNumber: nagadNumber.trim(),
      supportPhone: supportPhone.trim(),
      minDeposit: Number(minDeposit),
      minWithdrawal: Number(minWithdrawal),
      globalNotice: globalNotice.trim(),
      isNoticeActive,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Payment Gateways Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Official Payment Gateway Numbers (বিকাশ ও নগদ)
              </h3>
              <p className="text-xs text-slate-400">
                Players will see these numbers when depositing funds via bKash or Nagad.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-pink-400 mb-1 font-semibold">
                Official bKash Personal Number *
              </label>
              <input
                type="text"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-pink-500"
                placeholder="01XXXXXXXXX"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Shown on player deposit screen with 1-click copy button
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-orange-400 mb-1 font-semibold">
                Official Nagad Personal Number *
              </label>
              <input
                type="text"
                value={nagadNumber}
                onChange={(e) => setNagadNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-orange-500"
                placeholder="01XXXXXXXXX"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Shown on player deposit screen with 1-click copy button
              </span>
            </div>
          </div>
        </div>

        {/* Financial Limits & Support */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <DollarSign className="w-5 h-5 text-[#eab308]" />
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Wallet Limits & Host Support
              </h3>
              <p className="text-xs text-slate-400">
                Configure minimum deposit and cashout thresholds for players
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Minimum Deposit Limit (BDT) *
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={minDeposit}
                onChange={(e) => setMinDeposit(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Minimum Withdrawal Limit (BDT) *
              </label>
              <input
                type="number"
                min="20"
                step="10"
                value={minWithdrawal}
                onChange={(e) => setMinWithdrawal(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Support Helpline / WhatsApp
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono"
                placeholder="01XXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Global Live Announcement Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-[#f97316]" />
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  Global Announcement Ticker (লাইভ নোটিশ)
                </h3>
                <p className="text-xs text-slate-400">
                  Broadcast urgent alerts, match reminders, or cashout guidelines directly to all player homepages.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNoticeActive}
                onChange={(e) => setIsNoticeActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff4655]"></div>
              <span className="text-xs font-mono font-bold text-white">
                {isNoticeActive ? 'VISIBLE' : 'HIDDEN'}
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Notice Message (Supports Bengali & English)
            </label>
            <textarea
              rows={2}
              value={globalNotice}
              onChange={(e) => setGlobalNotice(e.target.value)}
              placeholder="e.g. আজ রাত ৯:০০ টায় গ্র্যান্ড টুর্নামেন্ট! সময়মতো রুমে প্রবেশ করুন..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff4655]"
            />
          </div>

          {/* Live Preview */}
          {isNoticeActive && globalNotice && (
            <div className="p-3 bg-gradient-to-r from-[#ff4655]/15 to-[#f97316]/15 border border-[#ff4655]/30 rounded-xl flex items-center gap-2.5 text-xs text-[#f97316]">
              <Bell className="w-4 h-4 shrink-0 animate-bounce" />
              <div className="flex-1 font-medium text-slate-200">
                <span className="font-bold text-[#ff4655] mr-2">NOTICE:</span>
                {globalNotice}
              </div>
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Settings saved and updated across all player views!
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              Changes take effect instantly for all visitors.
            </div>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-[#ff4655] to-[#f97316] text-white font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#ff4655]/25 cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save & Publish Settings
          </button>
        </div>
      </form>
    </div>
  );
};
