import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { FreeFireMap, GameMode, MatchType, PlacementPrize } from '../../types/tournament';
import { MAP_IMAGES } from '../../data/mockData';
import { X, Flame, Plus, Trash2, Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CreateMatchModalProps {
  onClose: () => void;
}

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({ onClose }) => {
  const { createMatch } = useTournament();

  const [title, setTitle] = useState('Bermuda Pro Royale Series');
  const [gameMode, setGameMode] = useState<GameMode>('Battle Royale');
  const [matchType, setMatchType] = useState<MatchType>('Solo');
  const [map, setMap] = useState<FreeFireMap>('Bermuda');
  const [totalSlots, setTotalSlots] = useState<number>(48);
  const [entryFee, setEntryFee] = useState<number>(20);
  const [perKillReward, setPerKillReward] = useState<number>(10);
  const [startTime, setStartTime] = useState<string>(() => {
    const d = new Date(Date.now() + 30 * 60000);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [roomId, setRoomId] = useState('');
  const [roomPassword, setRoomPassword] = useState('');

  const [placementPrizes, setPlacementPrizes] = useState<PlacementPrize[]>([
    { rank: 1, label: '1st Place Booyah', prize: 250 },
    { rank: 2, label: '2nd Place', prize: 150 },
    { rank: 3, label: '3rd Place', prize: 80 },
  ]);

  const [customRules, setCustomRules] = useState<string[]>([
    'Gun Property Off',
    'Limited Ammo YES',
    'Character Skill YES',
    'Mobile Only (No PC)',
  ]);
  const [ruleInput, setRuleInput] = useState('');

  // Business Logic / Economics Calculations
  const totalRevenue = totalSlots * entryFee;
  const placementPool = placementPrizes.reduce((sum, p) => sum + (Number(p.prize) || 0), 0);
  // In BR Solo, 48 players -> maximum 47 kills possible
  const maxKillsCount = Math.max(0, totalSlots - 1);
  const maxKillPool = perKillReward * maxKillsCount;
  const totalMaxPrizePool = placementPool + maxKillPool;
  const hostProfit = totalRevenue - totalMaxPrizePool;
  const hostMarginPercent = totalRevenue > 0 ? Math.round((hostProfit / totalRevenue) * 100) : 0;
  const isProfitable = hostProfit >= 0;

  const handleAddPlacement = () => {
    const nextRank = placementPrizes.length + 1;
    setPlacementPrizes([
      ...placementPrizes,
      { rank: nextRank, label: `${nextRank}th Place`, prize: 30 },
    ]);
  };

  const handleRemovePlacement = (idx: number) => {
    setPlacementPrizes(placementPrizes.filter((_, i) => i !== idx));
  };

  const handleAddRule = () => {
    if (ruleInput.trim() && !customRules.includes(ruleInput.trim())) {
      setCustomRules([...customRules, ruleInput.trim()]);
      setRuleInput('');
    }
  };

  const handleRemoveRule = (rule: string) => {
    setCustomRules(customRules.filter((r) => r !== rule));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createMatch({
      title,
      gameMode,
      matchType,
      map,
      customRules,
      entryFee: Number(entryFee),
      perKillReward: Number(perKillReward),
      placementPrizes,
      startTime: new Date(startTime).toISOString(),
      totalSlots: Number(totalSlots),
      bannerImage: MAP_IMAGES[map] || MAP_IMAGES.Bermuda,
      roomId: roomId.trim() || undefined,
      roomPassword: roomPassword.trim() || undefined,
      roomRevealedAtMinutes: 15,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff4655]/10 border border-[#ff4655]/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#ff4655]" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Create New Free Fire Tournament
              </h3>
              <p className="text-xs text-slate-400">
                Setup rules, entry fees, dynamic kill bounties & custom room credentials
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

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Platform Economics Live Calculator Card */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              isProfitable
                ? 'bg-slate-950 border-emerald-500/40'
                : 'bg-rose-950/20 border-rose-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#eab308]" />
                <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  Host Economics & Profit Calculator
                </h4>
              </div>
              <span
                className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                  isProfitable
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {isProfitable ? `Host Margin: +${hostMarginPercent}%` : 'Deficit / Negative Margin'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Total Pool ({totalSlots}×৳{entryFee})</span>
                <span className="text-sm font-bold text-white tabular-nums">৳{totalRevenue}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Placement Pool</span>
                <span className="text-sm font-bold text-[#eab308] tabular-nums">৳{placementPool}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Max Kill Pool ({maxKillsCount}×৳{perKillReward})</span>
                <span className="text-sm font-bold text-[#ff4655] tabular-nums">৳{maxKillPool}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Host Retained Profit</span>
                <span
                  className={`text-sm font-bold tabular-nums ${
                    isProfitable ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  ৳{hostProfit}
                </span>
              </div>
            </div>

            {!isProfitable && (
              <p className="mt-2 text-rose-300 text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Warning: Total prize pool (৳{totalMaxPrizePool}) exceeds total entry fees (৳{totalRevenue}). Adjust entry fee or prize amounts.
              </p>
            )}
          </div>

          {/* Tournament Title */}
          <div>
            <label className="block text-slate-400 font-mono mb-1">Tournament Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#ff4655]"
              required
            />
          </div>

          {/* Mode & Map Grids */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Game Mode</label>
              <select
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value as GameMode)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff4655]"
              >
                <option value="Battle Royale">Battle Royale</option>
                <option value="Clash Squad">Clash Squad (4v4)</option>
                <option value="Lone Wolf">Lone Wolf (1v1, 2v2)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Match Type</label>
              <select
                value={matchType}
                onChange={(e) => setMatchType(e.target.value as MatchType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff4655]"
              >
                <option value="Solo">Solo</option>
                <option value="Duo">Duo</option>
                <option value="Squad">Squad</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Map</label>
              <select
                value={map}
                onChange={(e) => setMap(e.target.value as FreeFireMap)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff4655]"
              >
                <option value="Bermuda">Bermuda</option>
                <option value="Purgatory">Purgatory</option>
                <option value="Kalahari">Kalahari</option>
                <option value="Alpine">Alpine</option>
                <option value="Nexterra">Nexterra</option>
              </select>
            </div>
          </div>

          {/* Pricing & Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Entry Fee (BDT)</label>
              <input
                type="number"
                min="0"
                step="5"
                value={entryFee}
                onChange={(e) => setEntryFee(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#ff4655]"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Per Kill Bounty (BDT)</label>
              <input
                type="number"
                min="0"
                step="5"
                value={perKillReward}
                onChange={(e) => setPerKillReward(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#ff4655]"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Total Slots</label>
              <input
                type="number"
                min="2"
                max="48"
                value={totalSlots}
                onChange={(e) => setTotalSlots(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#ff4655]"
                required
              />
            </div>
          </div>

          {/* Match Start Time */}
          <div>
            <label className="block text-slate-400 font-mono mb-1">Match Start Schedule *</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#ff4655]"
              required
            />
          </div>

          {/* Placement Prizes Management */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-semibold font-mono">
                Placement Prize Tiers (BDT)
              </label>
              <button
                type="button"
                onClick={handleAddPlacement}
                className="text-xs text-[#f97316] hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Tier
              </button>
            </div>

            <div className="space-y-2">
              {placementPrizes.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-16 font-mono text-slate-400">Rank #{p.rank}:</span>
                  <input
                    type="text"
                    value={p.label}
                    onChange={(e) => {
                      const updated = [...placementPrizes];
                      updated[idx].label = e.target.value;
                      setPlacementPrizes(updated);
                    }}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                  <input
                    type="number"
                    min="0"
                    value={p.prize}
                    onChange={(e) => {
                      const updated = [...placementPrizes];
                      updated[idx].prize = Number(e.target.value);
                      setPlacementPrizes(updated);
                    }}
                    className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-right"
                    placeholder="BDT"
                  />
                  {placementPrizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePlacement(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Initial Room ID & Password (Optional) */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-400 font-mono mb-1">
                Custom Room ID (Optional)
              </label>
              <input
                type="text"
                placeholder="Can set later"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono mb-1">
                Room Password (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 1234"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          {/* Custom Rules Selector */}
          <div>
            <label className="block text-slate-400 font-mono mb-1.5">
              Custom Match Rules & Restrictions
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {customRules.map((rule) => (
                <span
                  key={rule}
                  className="bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <span>{rule}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRule(rule)}
                    className="text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add rule (e.g. Headshot Only, No Gloo Wall Grenade, Gun Property Off)..."
                value={ruleInput}
                onChange={(e) => setRuleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRule();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
              />
              <button
                type="button"
                onClick={handleAddRule}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer"
              >
                Add Rule
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#ff4655] to-[#f97316] text-white font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#ff4655]/20 hover:opacity-95 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Publish Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
