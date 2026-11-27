import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { FarmerDashboard } from './components/FarmerDashboard';
import { FarmerHealthChecker } from './components/FarmerHealthChecker';
import { CropHistoryPage } from './components/CropHistoryPage';
import { FertilizerRecommendationPage } from './components/FertilizerRecommendationPage';
import { CropYieldPredictionPage } from './components/CropYieldPredictionPage';
import { SettingsPage } from './components/SettingsPage';

// Research & Advanced Tabs
import { OverviewTab } from './components/OverviewTab';
import { CropRecommenderTab } from './components/CropRecommenderTab';
import { XAITab } from './components/XAITab';
import { FederatedIrrigationTab } from './components/FederatedIrrigationTab';
import { FertilizerTab } from './components/FertilizerTab';
import { FieldDiagnosticsTab } from './components/FieldDiagnosticsTab';
import { YieldOptimizerTab } from './components/YieldOptimizerTab';
import { ResearchLibraryTab } from './components/ResearchLibraryTab';

import { checkBackendHealth } from './services/api';
import { getStoredAuth, clearStoredAuth } from './services/storage';
import { UserSession } from './types';
import { Menu, Sprout } from 'lucide-react';

const DEFAULT_USER: UserSession = {
  name: 'Farmer Ramesh',
  email: 'farmer@agrinex.com',
  farmLocation: 'Coimbatore District',
  memberSince: 'March 2024'
};

export function App() {
  const [user, setUser] = useState<UserSession>(() => getStoredAuth() || DEFAULT_USER);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  // Poll backend health status
  useEffect(() => {
    const probe = async () => {
      const ok = await checkBackendHealth();
      setBackendOnline(ok);
    };
    probe();
    const interval = setInterval(probe, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        backendOnline={backendOnline}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setIsOpenMobile(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-1.5">
              <div className="p-1 rounded-md bg-emerald-600 text-white">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-black text-base text-white">AgriNex</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-xs text-slate-300 font-semibold">{user.name.split(' ')[0]}</span>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <FarmerDashboard user={user} onNavigate={setActiveTab} />
          )}
          {activeTab === 'health-check' && <FarmerHealthChecker />}
          {activeTab === 'crop-history' && (
            <CropHistoryPage onNavigateToCheck={() => setActiveTab('health-check')} />
          )}
          {activeTab === 'fertilizer-rec' && <FertilizerRecommendationPage />}
          {activeTab === 'yield-pred' && <CropYieldPredictionPage />}
          {activeTab === 'xai' && <XAITab />}
          {activeTab === 'settings' && (
            <SettingsPage user={user} />
          )}

          {/* Research & Advanced Edge Tabs */}
          {activeTab === 'overview' && <OverviewTab onSelectTab={setActiveTab} />}
          {activeTab === 'crop-rec' && <CropRecommenderTab />}
          {activeTab === 'federated' && <FederatedIrrigationTab />}
          {activeTab === 'fertilizer' && <FertilizerTab />}
          {activeTab === 'vision' && <FieldDiagnosticsTab />}
          {activeTab === 'yield' && <YieldOptimizerTab />}
          {activeTab === 'research' && <ResearchLibraryTab />}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              AgriNex • Smart Agriculture Decision Support Portal
            </span>
            <span className="font-mono text-slate-400">
              Zero-Database Client Ledger • MobileNetV3 • Koksal Yield Model • ICAR Guidelines
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
