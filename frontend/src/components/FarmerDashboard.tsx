import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  FlaskConical, 
  TrendingUp, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  Sun, 
  Droplet, 
  Info,
  ChevronRight
} from 'lucide-react';
import { UserSession, CropHistoryEntry, DashboardSummary } from '../types';
import { getCropHistory, getDashboardSummary } from '../services/storage';

interface FarmerDashboardProps {
  user: UserSession;
  onNavigate: (tab: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ user, onNavigate }) => {
  const [summary, setSummary] = useState<DashboardSummary>(getDashboardSummary());
  const [recentAnalyses, setRecentAnalyses] = useState<CropHistoryEntry[]>([]);

  useEffect(() => {
    const s = getDashboardSummary();
    setSummary(s);
    const history = getCropHistory();
    setRecentAnalyses(history.slice(0, 4));
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AgriNex Decision Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Monitor your field health, inspect uploaded crop leaf photos for diseases, determine optimal fertilizer dosages, and forecast your seasonal harvest.
            </p>
          </div>

          <button
            onClick={() => onNavigate('health-check')}
            className="self-start md:self-center px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/60 transition flex items-center space-x-2 shrink-0 group"
          >
            <Scan className="w-4 h-4" />
            <span>Check Crop Health Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Analyses */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Analyses
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {summary.totalAnalyses}
            </span>
            <span className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <Scan className="w-4 h-4" />
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Crop images evaluated</p>
        </div>

        {/* Healthy Crops */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 space-y-2 hover:border-emerald-500/50 transition">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
            Healthy Crops
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {summary.healthyCount}
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Normal foliar vigor</p>
        </div>

        {/* Disease Affected */}
        <div className="bg-slate-900/90 border border-red-500/30 rounded-2xl p-4 space-y-2 hover:border-red-500/50 transition">
          <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider block">
            Diseased Crops
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-red-400 font-mono">
              {summary.diseasedCount}
            </span>
            <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Foliar infection identified</p>
        </div>

        {/* Fertilizer Recommendations */}
        <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-4 space-y-2 hover:border-sky-500/50 transition">
          <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block">
            Fertilizer Plans
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">
              {summary.fertilizerCount}
            </span>
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <FlaskConical className="w-4 h-4" />
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Tailored NPK schedules</p>
        </div>

        {/* Last Analysis Date */}
        <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Last Analysis
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm sm:text-base font-bold text-white truncate">
              {summary.lastAnalysisDate || 'No scans yet'}
            </span>
            <span className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Most recent checkup</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Check Crop Health */}
          <div 
            onClick={() => onNavigate('health-check')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-2xl cursor-pointer group transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-emerald-950/20"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
              <Scan className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
              Check Crop Health
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload a photo of your leaf or crop to detect diseases instantly with MobileNetV3 AI.
            </p>
            <div className="mt-3 text-xs font-semibold text-emerald-400 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
              <span>Scan photo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Action 2: Fertilizer Recommendation */}
          <div 
            onClick={() => onNavigate('fertilizer-rec')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-sky-500/60 rounded-2xl cursor-pointer group transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-sky-950/20"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-sky-400 transition-colors">
              Fertilizer Recommendation
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter your soil N-P-K and pH test values to receive exact Urea, DAP, and Potash dosages.
            </p>
            <div className="mt-3 text-xs font-semibold text-sky-400 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
              <span>Calculate doses</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Action 3: Predict Crop Yield */}
          <div 
            onClick={() => onNavigate('yield-pred')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl cursor-pointer group transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-amber-950/20"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
              Predict Crop Yield
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Estimate expected harvest in tonnes/hectare based on climate, irrigation, and field size.
            </p>
            <div className="mt-3 text-xs font-semibold text-amber-400 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
              <span>Estimate yield</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Action 4: View Crop History */}
          <div 
            onClick={() => onNavigate('crop-history')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-purple-500/60 rounded-2xl cursor-pointer group transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-purple-950/20"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
              <History className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors">
              View Crop History
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Browse previous photo diagnoses, past treatment advice, and visual Grad-CAM overlays.
            </p>
            <div className="mt-3 text-xs font-semibold text-purple-400 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
              <span>Browse records</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Analyses & Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Crop Analyses */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white">Recent Crop Analyses</h2>
              <p className="text-xs text-slate-400">Photos analyzed in your current browser session</p>
            </div>
            <button
              onClick={() => onNavigate('crop-history')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
            >
              <span>View All ({summary.totalAnalyses})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentAnalyses.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs text-slate-400">No crop photos evaluated yet.</p>
              <button
                onClick={() => onNavigate('health-check')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
              >
                Upload First Photo
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {recentAnalyses.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 group">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.thumbnail ? (
                        <img 
                          src={item.thumbnail} 
                          alt={item.cropName} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Scan className="w-5 h-5 text-slate-600" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="overflow-hidden">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs sm:text-sm text-white truncate">
                          {item.cropName}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'healthy'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'diseased'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                        }`}>
                          {item.status === 'healthy' ? 'Healthy' : item.diseaseName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {item.dateFormatted} • {item.confidence}% confidence
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('crop-history')}
                    className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition shrink-0"
                    title="View details in history"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Crop Health Ratio & Farming Insights */}
        <div className="space-y-6">
          {/* Health Overview Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Crop Health Overview
            </h2>

            {summary.totalAnalyses === 0 ? (
              <p className="text-xs text-slate-400">No data available yet.</p>
            ) : (
              <div className="space-y-3">
                {/* Visual Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Healthy Foliage Ratio</span>
                    <span className="font-mono font-bold text-emerald-400">{summary.healthRatio}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                    <div 
                      style={{ width: `${summary.healthRatio}%` }} 
                      className="bg-emerald-500 h-full transition-all duration-500"
                    />
                    <div 
                      style={{ width: `${100 - summary.healthRatio}%` }} 
                      className="bg-red-500 h-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center pt-2">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Healthy Scans</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">{summary.healthyCount}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Infections</span>
                    <span className="text-lg font-bold text-red-400 font-mono">{summary.diseasedCount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Farming Insights */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/20 rounded-3xl p-6 space-y-3 shadow-lg">
            <div className="flex items-center space-x-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Agronomic Field Insights</h3>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Morning Inspection:</strong> Scout for fungal spores in early dawn when leaves have dew and lesion visibility is sharpest.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Targeted Nitrogen:</strong> Avoid excessive urea top-dressing during high humidity periods to deter sheath blight and powdery mildew.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Camera Tip:</strong> Center the single affected leaf in sunlight and keep camera 15-20 cm away for optimal AI accuracy.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
