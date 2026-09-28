import React from 'react';
import { Swords, Trophy, Wallet, Shield, Settings } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';

interface BottomNavProps {
  activeTab: 'matches' | 'my-matches' | 'wallet' | 'rules' | 'admin';
  setActiveTab: (tab: 'matches' | 'my-matches' | 'wallet' | 'rules' | 'admin') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { transactions } = useTournament();
  const pendingApprovalsCount = transactions.filter((t) => t.status === 'pending').length;

  const navItems = [
    { id: 'matches' as const, label: 'Matches', icon: Swords },
    { id: 'my-matches' as const, label: 'My Matches', icon: Trophy },
    { id: 'wallet' as const, label: 'Wallet', icon: Wallet },
    { id: 'rules' as const, label: 'Rules', icon: Shield },
    { id: 'admin' as const, label: 'Admin', icon: Settings, badge: pendingApprovalsCount },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-lg border-t border-slate-800">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center relative transition-colors cursor-pointer ${
                isActive ? 'text-[#ff4655]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium mt-1 truncate ${isActive ? 'text-white font-semibold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-[#ff4655] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
