import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Droplet, 
  Sun, 
  Wind,
  Info,
  Calendar
} from 'lucide-react';
import { YieldPredictionResponse } from '../types';
import { predictCropYield } from '../services/api';
import { incrementYieldCounter } from '../services/storage';

export const CropYieldPredictionPage: React.FC = () => {
  // Required fields
  const [cropType, setCropType] = useState('Rice');
  const [cultivatedArea, setCultivatedArea] = useState<number>(3.5);
  const [areaUnit, setAreaUnit] = useState<'acre' | 'hectare'>('acre');
  const [season, setSeason] = useState('Kharif');
  const [soilType, setSoilType] = useState('Alluvial');

  // Additional features
  const [rainfall, setRainfall] = useState<number>(190);
  const [temperature, setTemperature] = useState<number>(25.5);
  const [humidity, setHumidity] = useState<number>(80);
  const [irrigation, setIrrigation] = useState('Canal / Tube Well');
  const [nitrogen, setNitrogen] = useState<number>(85);
  const [phosphorus, setPhosphorus] = useState<number>(45);
  const [potassium, setPotassium] = useState<number>(42);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<YieldPredictionResponse | null>(null);

  const crops = [
    'Rice',
    'Wheat',
    'Maize',
    'Cotton',
    'Sugarcane',
    'Banana',
    'Potato',
    'Tomato',
    'Soybean',
    'Groundnut',
    'Chickpea',
    'Coffee',
    'Watermelon',
    'Coconut',
    'Apple',
    'Mango'
  ];

  const seasons = [
    { id: 'Kharif', label: 'Kharif (Monsoon: June – October)' },
    { id: 'Rabi', label: 'Rabi (Winter: November – April)' },
    { id: 'Zaid', label: 'Zaid (Summer: March – June)' },
    { id: 'Whole Year', label: 'Perennial / Whole Year' }
  ];

  const soilTypes = [
    'Alluvial',
    'Black / Regur',
    'Loamy',
    'Clay',
    'Red Soil',
    'Laterite',
    'Sandy'
  ];

  const irrigationOptions = [
    'Canal / Tube Well (Standard)',
    'Drip Irrigation (High Efficiency)',
    'Sprinkler System',
    'Rainfed (Monsoon Dependent)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const resp = await predictCropYield({
        crop_type: cropType,
        cultivated_area: Number(cultivatedArea),
        area_unit: areaUnit,
        season,
        soil_type: soilType,
        rainfall: Number(rainfall),
        temperature: Number(temperature),
        humidity: Number(humidity),
        irrigation_availability: irrigation,
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium)
      });
      setResult(resp);
      incrementYieldCounter();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to predict crop yield. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          <span>Agro-Climate Yield Forecasting Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
          Crop Yield Prediction
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Estimate your anticipated agricultural harvest per hectare and total farm tonnage using multi-factor regression modeling supported by Koksal et al. (2026) and ICAR yield baselines.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-2xl flex items-center space-x-3 text-xs text-red-300">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Required Cultivation Parameters */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono">1</span>
              <span>Cultivation Plan (Required)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Crop Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Crop *
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 transition"
                  required
                >
                  {crops.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Cultivated Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Cultivated Area *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10000"
                  value={cultivatedArea}
                  onChange={(e) => setCultivatedArea(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 transition"
                  required
                />
              </div>

              {/* Area Unit */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Area Unit *
                </label>
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 transition"
                  required
                >
                  <option value="acre">Acres (1 ha = 2.47 ac)</option>
                  <option value="hectare">Hectares (ha)</option>
                </select>
              </div>

              {/* Season */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Cropping Season *
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 transition"
                  required
                >
                  {seasons.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Soil & Irrigation Features */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono">2</span>
              <span>Soil Texture & Irrigation Management</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Soil Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Dominant Soil Type *
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 transition"
                  required
                >
                  {soilTypes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Irrigation Availability */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Irrigation Availability & Method *
                </label>
                <select
                  value={irrigation}
                  onChange={(e) => setIrrigation(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 transition"
                  required
                >
                  {irrigationOptions.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Climate & Soil Fertility */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-mono">3</span>
              <span className="text-slate-300">Environmental Aggregates & Soil Nutrients</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {/* Rainfall */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block">Rainfall (mm)</label>
                <input
                  type="number"
                  value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-sm font-bold text-sky-400 focus:outline-hidden"
                />
              </div>

              {/* Temperature */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block">Avg Temp (°C)</label>
                <input
                  type="number"
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-sm font-bold text-amber-400 focus:outline-hidden"
                />
              </div>

              {/* Humidity */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block">Humidity (%)</label>
                <input
                  type="number"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-sm font-bold text-blue-400 focus:outline-hidden"
                />
              </div>

              {/* Nitrogen */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block">Nitrogen (N)</label>
                <input
                  type="number"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-sm font-bold text-emerald-400 focus:outline-hidden"
                />
              </div>

              {/* Phosphorus */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block">Phosphorus (P)</label>
                <input
                  type="number"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-sm font-bold text-emerald-400 focus:outline-hidden"
                />
              </div>

              {/* Potassium */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block">Potassium (K)</label>
                <input
                  type="number"
                  value={potassium}
                  onChange={(e) => setPotassium(Number(e.target.value))}
                  className="w-full bg-transparent font-mono text-sm font-bold text-emerald-400 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-950/50 transition flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Running Climate Multi-Factor Yield Model...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 text-amber-100" />
                <span>Calculate Expected Crop Yield</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Hero Result Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950/40 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-amber-500/30 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {result.season} Season Harvest Forecast • {result.crop}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                  Estimated Yield: <span className="text-amber-400">{result.predicted_yield_tons_ha} tonnes/ha</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  Equivalent to {result.predicted_yield_kg_ha.toLocaleString()} kg per hectare
                </p>
              </div>

              {/* Total Harvest Box */}
              <div className="bg-slate-950/90 border border-amber-500/30 px-5 py-3 rounded-2xl text-right sm:text-center shadow-lg">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Total Farm Production
                </span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-0.5">
                  {result.total_production_tons} <span className="text-sm font-normal text-slate-300">Tonnes</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  ≈ {result.total_production_quintals} Quintals ({result.total_production_kg.toLocaleString()} kg)
                </span>
              </div>
            </div>

            {/* Farm Area & Irrigation Analysis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-white flex items-center space-x-1.5 text-amber-400">
                  <Calendar className="w-4 h-4" />
                  <span>Field & Cultivation Summary:</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Cultivation Area: <strong>{result.cultivated_area} {result.area_unit.toUpperCase()}</strong> ({result.area_hectares} ha). Soil texture: <strong>{result.soil_type}</strong>. Genetic potential under ideal conditions: <strong>{result.base_potential_tons_ha} t/ha</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-white flex items-center space-x-1.5 text-sky-400">
                  <Droplet className="w-4 h-4" />
                  <span>Irrigation Performance:</span>
                </span>
                <p className="text-slate-300 leading-relaxed">{result.irrigation_analysis}</p>
              </div>
            </div>

            {/* Limiting Factors Capacity Breakdown */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Agronomic Capacity Multipliers (Koksal et al. 2026 Model)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.influencing_factors.map((f, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-200">{f.factor}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.status === 'Optimal' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : f.status === 'Favorable'
                          ? 'bg-sky-500/20 text-sky-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {f.score_pct}% ({f.status})
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${f.score_pct}%` }} 
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SHAP Explanation */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Feature Importance Weights on Harvest Yield</span>
              </h3>
              <div className="space-y-2">
                {result.shap_explanation.map((s, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300 font-medium">{s.feature}</span>
                      <span className="font-mono text-amber-400">{s.weight_pct}% contribution</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${s.weight_pct * 3}%` }} 
                        className="h-full bg-amber-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Human Summary */}
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-emerald-400">Yield Forecast Conclusion:</span>
              <p className="text-slate-300 leading-relaxed">{result.summary_explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
