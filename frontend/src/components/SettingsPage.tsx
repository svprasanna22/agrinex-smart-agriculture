import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  HardDrive, 
  Cpu, 
  ShieldCheck, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { UserSession, ModelStatusResponse } from '../types';
import { getModelStatus } from '../services/api';
import { getCropHistory, clearCropHistory } from '../services/storage';

interface SettingsPageProps {
  user: UserSession;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
  const [modelStatus, setModelStatus] = useState<ModelStatusResponse | null>(null);
  const [loadingModels, setLoadingModels] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [clearedMsg, setClearedMsg] = useState(false);

  // Preferred units preference
  const [preferredAreaUnit, setPreferredAreaUnit] = useState<'acre' | 'hectare'>('acre');
  const [preferredWeightUnit, setPreferredWeightUnit] = useState<'kg' | 'tonnes'>('tonnes');

  const fetchStatus = async () => {
    setLoadingModels(true);
    try {
      const data = await getModelStatus();
      setModelStatus(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    setHistoryCount(getCropHistory().length);
  }, []);

  const handleClearData = () => {
    clearCropHistory();
    setHistoryCount(0);
    setClearedMsg(true);
    setTimeout(() => setClearedMsg(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <SettingsIcon className="w-4 h-4" />
          <span>System & Account Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
          Settings & Diagnostics
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your farmer profile, review local browser storage footprint, and inspect verified AI model health.
        </p>
      </div>

      {/* Section 1: Farmer Profile */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Farmer Profile</h2>
            <p className="text-[11px] text-slate-400">Active user session</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Farmer Name</span>
            <span className="font-bold text-white text-sm mt-0.5 block">{user.name}</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Registered Email</span>
            <span className="font-bold text-slate-200 text-sm mt-0.5 block">{user.email}</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Primary Location</span>
            <span className="font-bold text-emerald-400 text-sm mt-0.5 block">{user.farmLocation || 'Tamil Nadu, India'}</span>
          </div>
        </div>
      </div>

      {/* Section 2: Browser Storage & Data Privacy */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Local Storage & Privacy</h2>
            <p className="text-[11px] text-slate-400">Zero database architecture: client-side session ledger</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Stored Crop Diagnoses</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {historyCount} photo evaluations saved locally in this browser.
              </p>
            </div>
            <button
              onClick={handleClearData}
              disabled={historyCount === 0}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-red-950/50 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/40 text-xs font-semibold rounded-xl transition disabled:opacity-40"
            >
              Reset History
            </button>
          </div>

          {clearedMsg && (
            <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Local crop evaluation ledger cleared successfully.</span>
            </div>
          )}

          <div className="p-3.5 bg-slate-950/50 rounded-2xl border border-slate-800/80 space-y-1 text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Database Design Verification</span>
            </div>
            <p>
              AgriNex does not connect to MongoDB, MySQL, Firebase, or Supabase. All calculations are executed in-memory or saved directly in your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Verified AI Models Health */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">AI & Machine Learning Engine Status</h2>
              <p className="text-[11px] text-slate-400">Honest status reporting from FastAPI backend</p>
            </div>
          </div>
          <button
            onClick={fetchStatus}
            disabled={loadingModels}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Refresh status"
          >
            <RefreshCw className={`w-4 h-4 ${loadingModels ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {modelStatus?.models ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {Object.entries(modelStatus.models).map(([key, m]) => (
              <div key={key} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{m.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    m.configured 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {m.configured ? 'Configured & Online' : 'Not Configured'}
                  </span>
                </div>
                {m.classes && <p className="text-[11px] text-slate-400">{m.classes} Classification Classes</p>}
                {m.benchmark_accuracy && <p className="text-[11px] text-emerald-400 font-mono">Accuracy: {m.benchmark_accuracy}</p>}
                {m.explainability && <p className="text-[10px] text-slate-500 italic">{m.explainability}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-950 rounded-2xl text-xs text-slate-400 text-center">
            {loadingModels ? 'Polling backend AI engine status...' : 'Unable to connect to backend engine.'}
          </div>
        )}
      </div>
    </div>
  );
};
