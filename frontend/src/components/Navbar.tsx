import React from 'react';
import { 
  Sprout, 
  Activity, 
  Share2, 
  FlaskConical, 
  TrendingUp, 
  BookOpen, 
  Layers,
  Sparkles,
  Sliders
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  backendOnline: boolean;
  showResearchMenu: boolean;
  setShowResearchMenu: (show: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  backendOnline,
  showResearchMenu,
  setShowResearchMenu
}) => {
  const researchTabs = [
    { id: 'overview', label: 'Architecture Overview', icon: Layers },
    { id: 'crop-rec', label: 'AgroXAI Crop Recommender', icon: Sprout },
    { id: 'xai', label: 'Explainable AI (SHAP/LIME)', icon: Activity },
    { id: 'federated', label: 'Federated Irrigation (FL)', icon: Share2 },
    { id: 'fertilizer', label: 'Nutrient & Fertilizer', icon: FlaskConical },
    { id: 'yield', label: 'Yield & Edge Optimizer', icon: TrendingUp },
    { id: 'research', label: 'Research Papers & Specs', icon: BookOpen },
  ];

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div 
            onClick={() => { setActiveTab('health-check'); setShowResearchMenu(false); }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-white tracking-tight">AgriNex</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full uppercase tracking-wider">
                  Plant Doctor
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Instant Farmer Crop Disease Diagnostics
              </p>
            </div>
          </div>

          {/* Right Navigation & Status */}
          <div className="flex items-center space-x-3">
            {/* Primary Action Button */}
            <button
              onClick={() => { setActiveTab('health-check'); setShowResearchMenu(false); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 ${
                activeTab === 'health-check'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Check Crop Health</span>
            </button>

            {/* Toggle Research & Advanced Hub */}
            <button
              onClick={() => setShowResearchMenu(!showResearchMenu)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition border flex items-center space-x-1.5 ${
                showResearchMenu || activeTab !== 'health-check'
                  ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Research & Edge Hub</span>
              <span className="sm:hidden">Research</span>
            </button>

            {/* Backend Online Indicator */}
            <div className={`hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              backendOnline 
                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400' 
                : 'bg-amber-950/60 border-amber-500/30 text-amber-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{backendOnline ? 'AI Model Online' : 'Connecting...'}</span>
            </div>
          </div>
        </div>

        {/* Secondary Research Menu Dropdown/Strip when toggled */}
        {(showResearchMenu || activeTab !== 'health-check') && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 overflow-x-auto">
            <div className="flex items-center space-x-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mr-2 shrink-0">
                Advanced Modules:
              </span>
              {researchTabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setShowResearchMenu(true); }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                      isActive
                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
