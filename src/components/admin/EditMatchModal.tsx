import React, { useState } from 'react';
import { FreeFireMap, GameMode, Match, MatchType, PlacementPrize } from '../../types/tournament';
import { useTournament } from '../../context/TournamentContext';
import { MAP_IMAGES } from '../../data/mockData';
import { X, Check, Plus, Trash2, Edit3, Flame, AlertCircle } from 'lucide-react';

interface EditMatchModalProps {
  match: Match;
  onClose: () => void;
}

export const EditMatchModal: React.FC<EditMatchModalProps> = ({ match, onClose }) => {
  const { editMatch } = useTournament();

  const [title, setTitle] = useState(match.title);
  const [gameMode, setGameMode] = useState<GameMode>(match.gameMode);
  const [matchType, setMatchType] = useState<MatchType>(match.matchType);
  const [map, setMap] = useState<FreeFireMap>(match.map);
  const [totalSlots, setTotalSlots] = useState<number>(match.totalSlots);
  const [entryFee, setEntryFee] = useState<number>(match.entryFee);
  const [perKillReward, setPerKillReward] = useState<number>(match.perKillReward);
  const [startTime, setStartTime] = useState<string>(() => {
    try {
      const d = new Date(match.startTime);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    } catch {
      return new Date().toISOString().slice(0, 16);
    }
  });

  const [placementPrizes, setPlacementPrizes] = useState<PlacementPrize[]>(match.placementPrizes);
  const [customRules, setCustomRules] = useState<string[]>(match.customRules);
  const [ruleInput, setRuleInput] = useState('');

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

    editMatch(match.id, {
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
      bannerImage: MAP_IMAGES[map] || match.bannerImage,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-[#f97316]" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Edit Match Details: {match.title}
              </h3>
              <p className="text-xs text-slate-400">
                Modify match parameters, rewards, map, schedule, and custom rules
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Tournament Title */}
          <div>
            <label className="block text-slate-400 font-mono mb-1">Tournament Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#ff4655]"
              required
            />
          </div>

          {/* Mode & Map */}
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

          {/* Entry Fee, Per Kill, Total Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Entry Fee (BDT)</label>
              <input
                type="number"
                min="0"
                step="5"
                value={entryFee}
                onChange={(e) => setEntryFee(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Total Slots</label>
              <input
                type="number"
                min={match.participants.length}
                max="48"
                value={totalSlots}
                onChange={(e) => setTotalSlots(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                required
              />
              <span className="text-[10px] text-slate-500">
                Min: {match.participants.length} (joined players)
              </span>
            </div>
          </div>

          {/* Match Schedule */}
          <div>
            <label className="block text-slate-400 font-mono mb-1">Match Start Schedule *</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
              required
            />
          </div>

          {/* Placement Prizes */}
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

          {/* Custom Rules */}
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
                placeholder="Add rule..."
                value={ruleInput}
                onChange={(e) => setRuleInput(e.target.value)}
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
              className="px-6 py-2.5 bg-gradient-to-r from-[#ff4655] to-[#f97316] text-white font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-lg shadow-[#ff4655]/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
