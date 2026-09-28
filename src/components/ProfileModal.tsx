import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { X, Check, User as UserIcon, Shield, Smartphone, Info } from 'lucide-react';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { currentUser, updateUserProfile } = useTournament();

  const [ign, setIgn] = useState(currentUser.ign || '');
  const [uid, setUid] = useState(currentUser.uid || '');
  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [avatarSeed, setAvatarSeed] = useState(currentUser.ign || currentUser.name || 'player');

  const [saved, setSaved] = useState(false);

  const avatars = [
    'ShadowSniper',
    'VIPER',
    'FireHost',
    'AimbotBD',
    'HeadshotKing',
    'CyberNinja',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateUserProfile({
      ign: ign.trim(),
      uid: uid.trim(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}&backgroundColor=0f172a`,
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Free Fire Gamer Profile
            </h3>
            <p className="text-xs text-slate-400">
              Your in-game credentials are required for tournament room matching
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">
              Select Profile Avatar
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {avatars.map((seed) => {
                const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=0f172a`;
                const isSelected = avatarSeed === seed;
                return (
                  <button
                    key={seed}
                    type="button"
                    onClick={() => setAvatarSeed(seed)}
                    className={`w-11 h-11 rounded-xl p-0.5 border-2 transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'border-[#ff4655] scale-110 shadow-lg shadow-[#ff4655]/20'
                        : 'border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={url}
                      alt={seed}
                      className="w-full h-full rounded-lg bg-slate-950 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Free Fire IGN */}
          <div>
            <div className="flex items-center justify-between mb-1 text-xs">
              <label className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff4655]" />
                Free Fire In-Game Name (IGN) *
              </label>
              <span className="text-[11px] text-slate-500">Case-sensitive</span>
            </div>
            <input
              type="text"
              placeholder="e.g. ⚡ShadowSniper⚡"
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff4655]"
              required
            />
          </div>

          {/* Free Fire UID */}
          <div>
            <div className="flex items-center justify-between mb-1 text-xs">
              <label className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#f97316]" />
                Free Fire UID (User ID) *
              </label>
              <span className="text-[11px] text-slate-500">10-digit number</span>
            </div>
            <input
              type="text"
              placeholder="e.g. 1948201948"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#f97316]"
              required
            />
            <div className="mt-1 flex items-start gap-1.5 text-[11px] text-slate-500">
              <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
              <span>
                To find your UID: Open Free Fire &gt; Click your avatar on top-left &gt; Copy the 10-digit UID.
              </span>
            </div>
          </div>

          {/* Real Name & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                bKash/Nagad Phone
              </label>
              <input
                type="text"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="gamer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#ff4655] to-[#f97316] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#ff4655]/20 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Saved Successfully!
                </>
              ) : (
                'Save Profile Credentials'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
