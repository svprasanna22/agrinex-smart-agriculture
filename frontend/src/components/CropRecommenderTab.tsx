import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  RotateCcw,
  Sliders
} from 'lucide-react';
import { predictCrop, getCounterfactuals } from '../services/api';
import { CropPredictionResponse, CounterfactualItem } from '../types';

export const CropRecommenderTab: React.FC = () => {
  // Input parameters (defaults match Kaggle sample #1 Rice)
  const [inputs, setInputs] = useState({
    N: 90,
    P: 42,
    K: 43,
    temperature: 20.88,
    humidity: 82.0,
    ph: 6.5,
    rainfall: 202.94,
    model_type: 'Random Forest (RF)'
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<CropPredictionResponse | null>(null);
  const [counterfactuals, setCounterfactuals] = useState<CounterfactualItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Preset Configurations
  const presets = [
    {
      name: 'Wetland Rice (AgroXAI Sample)',
      values: { N: 90, P: 42, K: 43, temperature: 20.88, humidity: 82.0, ph: 6.5, rainfall: 202.94 }
    },
    {
      name: 'Papaya (Table IV Actual Instance)',
      values: { N: 44, P: 60, K: 55, temperature: 34.28, humidity: 90.56, ph: 6.83, rainfall: 98.54 }
    },
    {
      name: 'Semi-Arid Chickpea',
      values: { N: 40, P: 68, K: 79, temperature: 18.8, humidity: 16.8, ph: 7.3, rainfall: 78.5 }
    },
    {
      name: 'Commercial Cotton',
      values: { N: 117, P: 46, K: 20, temperature: 24.5, humidity: 79.9, ph: 6.9, rainfall: 80.2 }
    },
    {
      name: 'High-Value Grapes',
      values: { N: 23, P: 134, K: 200, temperature: 23.8, humidity: 81.8, ph: 6.0, rainfall: 69.8 }
    }
  ];

  const handleInputChange = (field: string, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleRunPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const predRes = await predictCrop(inputs);
      setPrediction(predRes);

      const cfRes = await getCounterfactuals(inputs);
      setCounterfactuals(cfRes.counterfactuals);
    } catch (err: any) {
      console.error(err);
      setError('Unable to fetch live prediction. Running in fallback mode.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRunPrediction();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sprout className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">AgroXAI Crop Recommender & Counterfactuals</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supported by Turgut et al. (AgroXAI 2024, Table I-V) & Shastri et al. (Scientific Reports 2025). 
            Evaluates 22 crop classes with regional what-if diversification.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 whitespace-nowrap">Load Preset:</span>
          <select 
            onChange={(e) => {
              const selected = presets.find(p => p.name === e.target.value);
              if (selected) {
                setInputs(prev => ({ ...prev, ...selected.values }));
              }
            }}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            {presets.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-amber-950/60 border border-amber-500/40 rounded-xl text-xs text-amber-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Soil & Climate Parameters</span>
            </span>
            <span className="text-[11px] text-slate-400">7 Multimodal Features</span>
          </div>

          <div className="space-y-3.5">
            {/* Nitrogen */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Nitrogen (N)</span>
                <span className="text-emerald-400 font-semibold">{inputs.N} mg/kg</span>
              </div>
              <input
                type="range" min="0" max="140" step="1"
                value={inputs.N}
                onChange={(e) => handleInputChange('N', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Phosphorus */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Phosphorus (P)</span>
                <span className="text-emerald-400 font-semibold">{inputs.P} mg/kg</span>
              </div>
              <input
                type="range" min="5" max="145" step="1"
                value={inputs.P}
                onChange={(e) => handleInputChange('P', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Potassium */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Potassium (K)</span>
                <span className="text-emerald-400 font-semibold">{inputs.K} mg/kg</span>
              </div>
              <input
                type="range" min="5" max="205" step="1"
                value={inputs.K}
                onChange={(e) => handleInputChange('K', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Temperature */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Temperature</span>
                <span className="text-sky-400 font-semibold">{inputs.temperature.toFixed(1)} °C</span>
              </div>
              <input
                type="range" min="8" max="45" step="0.1"
                value={inputs.temperature}
                onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Humidity */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Relative Humidity</span>
                <span className="text-sky-400 font-semibold">{inputs.humidity.toFixed(1)} %</span>
              </div>
              <input
                type="range" min="14" max="100" step="0.5"
                value={inputs.humidity}
                onChange={(e) => handleInputChange('humidity', parseFloat(e.target.value))}
                className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Soil pH */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Soil pH Level</span>
                <span className="text-amber-400 font-semibold">{inputs.ph.toFixed(2)}</span>
              </div>
              <input
                type="range" min="3.5" max="9.9" step="0.05"
                value={inputs.ph}
                onChange={(e) => handleInputChange('ph', parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rainfall */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Rainfall</span>
                <span className="text-indigo-400 font-semibold">{inputs.rainfall.toFixed(1)} mm</span>
              </div>
              <input
                type="range" min="20" max="300" step="1"
                value={inputs.rainfall}
                onChange={(e) => handleInputChange('rainfall', parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Model Selection */}
          <div className="pt-2 border-t border-slate-800">
            <label className="text-xs font-medium text-slate-300 mb-1 block">Machine Learning Architecture:</label>
            <select
              value={inputs.model_type}
              onChange={(e) => handleInputChange('model_type', e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="Random Forest (RF)">Random Forest (RF) - 99.24% Benchmark Accuracy</option>
              <option value="Decision Tree (DT)">Decision Tree (DT) - 98.48% Accuracy</option>
              <option value="LightGBM (LGBM)">LightGBM (LGBM) - 97.58% Accuracy</option>
              <option value="Support Vector Machine (SVM)">Support Vector Machine (SVM) - 97.42% Accuracy</option>
              <option value="K-Nearest Neighbors (KNN)">K-Nearest Neighbors (KNN) - 96.67% Accuracy</option>
            </select>
          </div>

          <button
            onClick={handleRunPrediction}
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Evaluating Model...' : 'Run AgroXAI Inference'}</span>
          </button>
        </div>

        {/* Right Column: Prediction Results & Counterfactuals (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Recommendation Hero */}
          {prediction && (
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950/50 border border-emerald-500/30 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Optimal Recommended Crop
                  </span>
                  <h3 className="text-3xl font-black text-white capitalize mt-1 tracking-tight">
                    {prediction.recommended_crop}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Classified via {prediction.model_used} (Model Test Accuracy: {prediction.model_accuracy}%)
                  </p>
                </div>

                <div className="text-right bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-2xl font-black text-emerald-400">
                    {prediction.confidence_percentage}%
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Confidence Score</span>
                </div>
              </div>

              {/* Top 5 Alternatives Probability Bars */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
                <span className="text-xs font-semibold text-slate-300">Top Crop Probabilities:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {prediction.top_recommendations.map((item, idx) => (
                    <div key={item.crop} className="bg-slate-850/80 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between text-xs">
                      <span className="capitalize font-medium text-slate-200">
                        #{idx + 1} {item.crop}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-full rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="font-mono text-emerald-400 font-semibold">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AgroXAI Counterfactual What-If Generator (Table IV & V) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-white text-sm">
                  Counterfactual Explainability & Alternative Crop Diversification
                </h4>
                <p className="text-xs text-slate-400">
                  What minimal field adjustments are required to switch from {prediction?.recommended_crop || 'actual crop'} to other crops? (AgroXAI Table IV & V)
                </p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                Actionable Optimization
              </span>
            </div>

            <div className="space-y-4">
              {counterfactuals.map((cf) => (
                <div key={cf.counterfactual_id} className="bg-slate-850 border border-slate-750 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                        {cf.counterfactual_id}
                      </span>
                      <h5 className="font-bold text-white capitalize text-sm">
                        Alternative Target: <span className="text-emerald-400">{cf.target_crop}</span>
                      </h5>
                    </div>

                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      cf.feasibility === 'High' 
                        ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300' 
                        : cf.feasibility === 'Moderate'
                        ? 'bg-sky-950/60 border-sky-500/30 text-sky-300'
                        : 'bg-amber-950/60 border-amber-500/30 text-amber-300'
                    }`}>
                      {cf.feasibility} Feasibility
                    </span>
                  </div>

                  {/* Required Feature Adjustments */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {cf.feature_adjustments
                      .filter(adj => Math.abs(adj.delta) > 0.05)
                      .map((adj) => (
                        <div key={adj.feature} className="p-2 rounded bg-slate-900 border border-slate-800 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-slate-400">
                            <span>{adj.display_name.split('(')[0]}</span>
                            <span className={`text-[10px] font-mono px-1 rounded ${
                              adj.is_controllable ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {adj.is_controllable ? 'Controllable' : 'Climate'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-slate-400 font-mono text-[11px]">{adj.current_value} → <strong className="text-white">{adj.target_value}</strong></span>
                            <span className={`flex items-center font-bold text-xs ${
                              adj.direction === 'increase' ? 'text-emerald-400' : 'text-amber-400'
                            }`}>
                              {adj.direction === 'increase' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                              {adj.delta > 0 ? `+${adj.delta}` : adj.delta}
                            </span>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

