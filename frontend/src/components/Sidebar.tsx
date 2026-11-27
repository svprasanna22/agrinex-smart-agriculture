import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  History, 
  FlaskConical, 
  TrendingUp, 
  BrainCircuit, 
  Settings, 
  Sprout, 
  Menu, 
  X, 
  ChevronRight,
  ShieldAlert,
  Layers,
  Sparkles
} from 'lucide-react';
import { UserSession } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserSession;
  backendOnline: boolean;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  backendOnline,
  isOpenMobile,
  setIsOpenMobile
}) => {
  const [showResearchSubmenu, setShowResearchSubmenu] = useState(false);

  const mainNavigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'health-check', label: 'Disease Detection', icon: Scan },
    { id: 'crop-history', label: 'My Crop History', icon: History },
    { id: 'fertilizer-rec', label: 'Fertilizer Recommendation', icon: FlaskConical },
    { id: 'yield-pred', label: 'Crop Yield Prediction', icon: TrendingUp },
    { id: 'xai', label: 'Explainable AI', icon: BrainCircuit },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const researchTabs = [
    { id: 'overview', label: 'System Overview' },
    { id: 'crop-rec', label: 'AgroXAI Recommender' },
    { id: 'federated', label: 'Federated Irrigation' },
    { id: 'fertilizer', label: 'Nutrient Stoichiometry' },
    { id: 'yield', label: 'Edge-Cloud Optimizer' },
    { id: 'research', label: 'Research Library' },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setIsOpenMobile(false);
  };

  const isResearchActive = researchTabs.some(r => r.id === activeTab);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between z-50 transition-transform duration-200 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Top: Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div 
            onClick={() => handleSelectTab('dashboard')} 
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-lg text-white tracking-tight">AgriNex</span>
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">
                  Farmer
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Smart Agriculture Portal</p>
            </div>
          </div>

          <button 
            onClick={() => setIsOpenMobile(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main Menu
          </div>

          {mainNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            );
          })}

          {/* Research & Advanced Edge Hub Section */}
          <div className="pt-4 mt-3 border-t border-slate-800/80">
            <button
              onClick={() => setShowResearchSubmenu(!showResearchSubmenu)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                isResearchActive
                  ? 'bg-purple-950/50 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[11px]">Research & Edge Hub</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showResearchSubmenu || isResearchActive ? 'rotate-90' : ''}`} />
            </button>

            {(showResearchSubmenu || isResearchActive) && (
              <div className="mt-1 pl-4 space-y-1">
                {researchTabs.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectTab(r.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium transition ${
                      activeTab === r.id
                        ? 'bg-purple-600/20 text-purple-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom: User Profile & Backend Status & Logout */}
        <div className="p-3 border-t border-slate-800 space-y-3 bg-slate-950/40">
          {/* Status Indicator */}
          <div className="flex items-center justify-between px-2 text-[11px]">
            <span className="text-slate-400">AI Engine</span>
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className={backendOnline ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                {backendOnline ? 'Ready' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Farmer Profile Strip */}
          <div className="flex items-center space-x-2.5 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
