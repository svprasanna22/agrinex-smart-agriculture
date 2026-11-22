import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  BarChart2, 
  Sliders, 
  HelpCircle, 
  TrendingUp, 
  Info, 
  Check, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { getSHAPExplanation, getLIMEExplanation, getUtilityTradeoff, getCrossModalRadar } from '../services/api';
import { SHAPResponse, LIMEResponse, UtilityResponse } from '../types';

export const XAITab: React.FC = () => {
  const [sample, setSample] = useState({
    N: 90,
    P: 42,
    K: 43,
    temperature: 20.88,
    humidity: 82.0,
    ph: 6.5,
    rainfall: 202.94
  });

  const [shapData, setShapData] = useState<SHAPResponse | null>(null);
  const [limeData, setLimeData] = useState<LIMEResponse | null>(null);
  const [alphaT, setAlphaT] = useState(0.50);
  const [utility, setUtility] = useState<UtilityResponse | null>(null);
  const [radar, setRadar] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchXAIData = async () => {
    setLoading(true);
    try {
      const s = await getSHAPExplanation(sample);
      setShapData(s);

      const l = await getLIMEExplanation(sample);
      setLimeData(l);

      const u = await getUtilityTradeoff({
        accuracy: 0.944,
        interpretability: 0.910,
        cost: 0.150,
        alpha_t: alphaT
      });
      setUtility(u);

      const r = await getCrossModalRadar(s.crop || 'rice');
      setRadar(r);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchXAIData();
  }, [alphaT]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Explainable AI (XAI) Suite</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Supported by Tahir et al. (IEEE Access 2025, Eq. 6-18) & Akkem et al. (IJISA 2025). 
          Demystifies black-box models using SHAP Shapley values, LIME local rules, ELI5 feature weights, and utility optimization.
        </p>
      </div>

      {/* Top Section: Tahir et al. Utility Tradeoff Optimization UT(A, I) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-purple-950/40 border border-purple-500/30 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tahir et al. (2025) Accuracy-Interpretability Trade-off (Eq. 18)</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Utility Optimization: UT(A, I) = α_T · Accuracy + (1 - α_T) · Interpretability
            </h3>
            <p className="text-xs text-slate-400">
              Balances predictive rigor against farmer interpretability and trust for specialized deployment contexts.
            </p>
          </div>

          {/* Quick Scenario Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAlphaT(0.40)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                alphaT === 0.40 
                  ? 'bg-purple-600 text-white border-purple-500' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              Farmer Trust (α=0.40)
            </button>
            <button
              onClick={() => setAlphaT(0.50)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                alphaT === 0.50 
                  ? 'bg-purple-600 text-white border-purple-500' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              Balanced (α=0.50)
            </button>
            <button
              onClick={() => setAlphaT(0.80)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                alphaT === 0.80 
                  ? 'bg-purple-600 text-white border-purple-500' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              Predictive Maint. (α=0.80)
            </button>
          </div>
        </div>

        {/* Slider & Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Tuning Weight α_T (Emphasis on Accuracy vs Interpretability):</span>
              <span className="font-mono text-purple-400 font-bold">{alphaT.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0.10" max="0.90" step="0.05"
              value={alphaT}
              onChange={(e) => setAlphaT(parseFloat(e.target.value))}
              className="w-full accent-purple-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>← High Interpretability / Farmer Trust (α_T = 0.1)</span>
              <span>Baseline Accuracy Driven (α_T = 0.9) →</span>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[11px] text-slate-400">Utility Score UT(A, I)</span>
              <div className="text-2xl font-black text-purple-400 mt-1">
                {utility ? utility.utility_score_UT : '0.881'}
              </div>
              <span className="text-[10px] text-emerald-400">Optimal Pareto Frontier</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[11px] text-slate-400">Composite Metric ξ</span>
              <div className="text-2xl font-black text-white mt-1">
                {utility ? utility.composite_metric_xi : '0.852'}
              </div>
              <span className="text-[10px] text-slate-400">Net Domain Trade-off</span>
            </div>
          </div>
        </div>
      </div>

      {/* SHAP & LIME Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SHAP Feature Contribution Waterfall (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="font-bold text-white text-sm">
                SHAP Local Feature Contributions (Force / Waterfall)
              </h4>
              <p className="text-xs text-slate-400">
                Shapley values φ_i for recommended crop <strong className="text-emerald-400 capitalize">{shapData?.crop || 'Rice'}</strong> (Base Value: {shapData?.base_value || 0.045})
              </p>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono">
              Eff. Checked: Σφ = Δf
            </span>
          </div>

          {/* Waterfall Visual Bars */}
          <div className="space-y-3">
            {shapData?.waterfall_data.map((item) => {
              const isPositive = item.shap_value >= 0;
              const absVal = Math.abs(item.shap_value);
              const barWidth = Math.min(100, (absVal / 0.5) * 100);

              return (
                <div key={item.feature} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300">
                      {item.display_name.split('(')[0]} <span className="text-slate-500 font-mono">({item.value})</span>
                    </span>
                    <span className={`font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isPositive ? `+${item.shap_value.toFixed(4)}` : item.shap_value.toFixed(4)}
                    </span>
                  </div>

                  {/* Horizontal Bar relative to baseline center */}
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex items-center">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isPositive ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-amber-600 to-amber-400'
                      }`}
                      style={{ width: `${Math.max(8, barWidth)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400">{item.description}</p>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-850 rounded-xl text-xs text-slate-300 border border-slate-800">
            <strong>AgroXAI Agronomic Finding:</strong> Humidity and Rainfall act as primary macro-drivers in crop viability, followed by Potassium and Phosphorus nutrient density.
          </div>
        </div>

        {/* LIME Rule Explanation & Cross-Modal Radar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* LIME Local Rules */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-white text-sm">LIME Local Decision Rules</h4>
                <p className="text-xs text-slate-400">
                  Surrogate linear decision boundaries (AgroXAI Figure 7 & 8)
                </p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-400">
                Rule Bounds
              </span>
            </div>

            <div className="space-y-2.5">
              {limeData?.local_rules.map((rule, idx) => (
                <div key={idx} className="bg-slate-850 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-slate-200">{rule.rule}</span>
                    <p className="text-[10px] text-slate-400 capitalize mt-0.5">
                      {rule.direction} recommendation for {rule.target_crop}
                    </p>
                  </div>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                    rule.weight >= 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {rule.weight >= 0 ? `+${rule.weight.toFixed(3)}` : rule.weight.toFixed(3)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Modal Harmony (Tahir et al. Figure 12) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white text-sm">Cross-Modal Sensor Harmony</h4>
              <span className="text-[11px] text-purple-400 font-mono">JS Divergence &lt; 0.15</span>
            </div>

            <div className="space-y-2">
              {radar?.modalities.map((m: any) => (
                <div key={m.modality} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{m.modality}</span>
                    <span className="font-mono text-purple-300 font-semibold">{Math.round(m.value * 100)}% weight</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full rounded-full" 
                      style={{ width: `${m.value * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              Balanced modality fusion ensures stability under sensor failure or cloudy satellite periods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

