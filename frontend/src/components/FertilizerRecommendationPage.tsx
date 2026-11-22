import React, { useState } from 'react';
import { 
  FlaskConical, 
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
  Info,
  ChevronDown
} from 'lucide-react';
import { FertilizerRecommendationResponse } from '../types';
import { recommendFertilizer } from '../services/api';
import { incrementFertilizerCounter } from '../services/storage';

export const FertilizerRecommendationPage: React.FC = () => {
  // Required fields
  const [cropName, setCropName] = useState('rice');
  const [soilType, setSoilType] = useState('Loamy');
  const [nitrogen, setNitrogen] = useState<number>(45);
  const [phosphorus, setPhosphorus] = useState<number>(25);
  const [potassium, setPotassium] = useState<number>(20);
  const [soilMoisture, setSoilMoisture] = useState<number>(35);
  const [soilPh, setSoilPh] = useState<number>(6.4);
  const [farmArea, setFarmArea] = useState<number>(2.0);

  // Optional fields
  const [temperature, setTemperature] = useState<number>(26);
  const [humidity, setHumidity] = useState<number>(75);
  const [prevFertilizer, setPrevFertilizer] = useState('None / FYM');
  const [growthStage, setGrowthStage] = useState('Basal / Sowing');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FertilizerRecommendationResponse | null>(null);

  const crops = [
    { id: 'rice', label: 'Rice / Paddy' },
    { id: 'wheat', label: 'Wheat' },
    { id: 'maize', label: 'Maize / Corn' },
    { id: 'cotton', label: 'Cotton' },
    { id: 'sugarcane', label: 'Sugarcane' },
    { id: 'tomato', label: 'Tomato' },
    { id: 'potato', label: 'Potato' },
    { id: 'banana', label: 'Banana' },
    { id: 'soybean', label: 'Soybean' },
    { id: 'groundnut', label: 'Groundnut / Peanut' },
    { id: 'chickpea', label: 'Chickpea / Gram' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'mango', label: 'Mango' },
    { id: 'grapes', label: 'Grapes' },
    { id: 'watermelon', label: 'Watermelon' },
    { id: 'coconut', label: 'Coconut' },
  ];

  const soilTypes = [
    'Loamy',
    'Clay',
    'Sandy Loam',
    'Sandy',
    'Black / Regur',
    'Red Soil',
    'Alluvial'
  ];

  const growthStages = [
    'Basal / Sowing',
    'Vegetative / Tillering (Day 25-30)',
    'Panicle / Flowering (Day 50-60)',
    'Maturity / Grain Filling'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const resp = await recommendFertilizer({
        crop_name: cropName,
        soil_type: soilType,
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium),
        soil_moisture: Number(soilMoisture),
        soil_ph: Number(soilPh),
        temperature: Number(temperature),
        humidity: Number(humidity),
        previous_fertilizer: prevFertilizer,
        crop_growth_stage: growthStage,
        farm_area_acres: Number(farmArea)
      });
      setResult(resp);
      incrementFertilizerCounter();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to calculate fertilizer recommendation. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <FlaskConical className="w-4 h-4" />
          <span>Nutrient & Soil Chemistry Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
          Fertilizer Recommendation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Enter your soil test values and crop details to generate precise, stoichiometric fertilizer dosages (Urea, DAP, MOP), soil amendment guidance, and split application timing.
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
          {/* Section 1: Required Crop & Soil Profile */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono">1</span>
              <span>Crop & Soil Classification (Required)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Crop Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Crop *
                </label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 transition"
                  required
                >
                  {crops.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Soil Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Soil Type *
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 transition"
                  required
                >
                  {soilTypes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Farm Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Farm Area (Acres) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="1000"
                  value={farmArea}
                  onChange={(e) => setFarmArea(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Soil Nutrients & Chemistry (Required) */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono">2</span>
              <span>Soil Laboratory Test Results (Required)</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {/* Nitrogen */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  Nitrogen (N)
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={nitrogen}
                    onChange={(e) => setNitrogen(Number(e.target.value))}
                    className="w-full bg-transparent font-mono text-sm font-bold text-emerald-400 focus:outline-hidden"
                    required
                  />
                  <span className="text-[10px] text-slate-500">kg/ha</span>
                </div>
              </div>

              {/* Phosphorus */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  Phosphorus (P)
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(Number(e.target.value))}
                    className="w-full bg-transparent font-mono text-sm font-bold text-emerald-400 focus:outline-hidden"
                    required
                  />
                  <span className="text-[10px] text-slate-500">kg/ha</span>
                </div>
              </div>

              {/* Potassium */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  Potassium (K)
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={potassium}
                    onChange={(e) => setPotassium(Number(e.target.value))}
                    className="w-full bg-transparent font-mono text-sm font-bold text-emerald-400 focus:outline-hidden"
                    required
                  />
                  <span className="text-[10px] text-slate-500">kg/ha</span>
                </div>
              </div>

              {/* Soil Moisture */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  Soil Moisture
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={soilMoisture}
                    onChange={(e) => setSoilMoisture(Number(e.target.value))}
                    className="w-full bg-transparent font-mono text-sm font-bold text-sky-400 focus:outline-hidden"
                    required
                  />
                  <span className="text-[10px] text-slate-500">%</span>
                </div>
              </div>

              {/* Soil pH */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1 col-span-2 sm:col-span-1">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  Soil pH Level
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    step="0.1"
                    min="3.0"
                    max="11.0"
                    value={soilPh}
                    onChange={(e) => setSoilPh(Number(e.target.value))}
                    className="w-full bg-transparent font-mono text-sm font-bold text-amber-400 focus:outline-hidden"
                    required
                  />
                  <span className="text-[10px] text-slate-500">pH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Optional Field Agronomics */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-mono">3</span>
              <span className="text-slate-300">Environmental & Field Conditions (Optional)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Growth Stage
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 transition"
                >
                  {growthStages.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Previous Fertilizer
                </label>
                <input
                  type="text"
                  value={prevFertilizer}
                  onChange={(e) => setPrevFertilizer(e.target.value)}
                  placeholder="e.g. FYM / Urea"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Air Humidity (%)
                </label>
                <input
                  type="number"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-950/50 transition flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Calculating Stoichiometric Nutrient Dosages...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-emerald-200" />
                <span>Generate Fertilizer Recommendation</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Recommendation Hero */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/60 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-emerald-500/30 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Optimal Formulation • {result.crop} on {result.soil_type} Soil
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                  {result.recommended_fertilizer}
                </h2>
              </div>
              <div className="px-4 py-2 bg-slate-900 border border-emerald-500/30 rounded-xl text-right sm:text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Farm Area</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  {result.farm_area_acres} Acres <span className="text-xs text-slate-400">({result.farm_area_hectares} ha)</span>
                </span>
              </div>
            </div>

            {/* Scientific Reason */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-white flex items-center space-x-1.5 text-emerald-400">
                <Info className="w-4 h-4" />
                <span>Agronomic Reason for Recommendation:</span>
              </span>
              <p className="text-slate-300 leading-relaxed">{result.primary_reason}</p>
              <p className="text-[11px] text-slate-400 italic pt-1">{result.soil_characteristics}</p>
            </div>

            {/* Total Bags Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Urea */}
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase">Neem-Coated Urea (46% N)</span>
                <div className="text-3xl font-black text-white font-mono">
                  {result.fertilizer_dosages.urea.total_kg} <span className="text-sm font-normal text-slate-400">kg</span>
                </div>
                <div className="text-xs font-semibold text-emerald-400">
                  ≈ {result.fertilizer_dosages.urea.bags_50kg} bags (50kg each)
                </div>
              </div>

              {/* DAP */}
              <div className="bg-slate-950 border border-sky-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-xs font-bold text-sky-400 uppercase">DAP (18% N, 46% P₂O₅)</span>
                <div className="text-3xl font-black text-white font-mono">
                  {result.fertilizer_dosages.dap.total_kg} <span className="text-sm font-normal text-slate-400">kg</span>
                </div>
                <div className="text-xs font-semibold text-sky-400">
                  ≈ {result.fertilizer_dosages.dap.bags_50kg} bags (50kg each)
                </div>
              </div>

              {/* MOP */}
              <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase">MOP / Potash (60% K₂O)</span>
                <div className="text-3xl font-black text-white font-mono">
                  {result.fertilizer_dosages.mop.total_kg} <span className="text-sm font-normal text-slate-400">kg</span>
                </div>
                <div className="text-xs font-semibold text-amber-400">
                  ≈ {result.fertilizer_dosages.mop.bags_50kg} bags (50kg each)
                </div>
              </div>
            </div>

            {/* Nutrient Deficiencies Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Identified Nutrient Deficits & Crop Symptoms
              </h3>
              <div className="space-y-2">
                {result.deficiencies.map((d, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{d.nutrient}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.severity.includes('High') 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {d.severity} ({d.deficit_kg_ha} kg/ha deficit)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{d.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Application Schedule */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>3-Stage Split Application Guidance</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {result.application_guidance.map((step) => (
                  <div key={step.step} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                      {step.step}
                    </span>
                    <h4 className="font-bold text-white text-xs">{step.stage}</h4>
                    <p className="text-slate-300 font-mono text-[11px]">{step.action}</p>
                    <p className="text-slate-500 text-[10px] italic border-t border-slate-900 pt-1.5">{step.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Soil pH Amendment */}
            {result.nutrient_analysis.ph.status !== 'Optimal' && (
              <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-amber-400">Soil pH Correction:</span>
                <p className="text-slate-300">{result.nutrient_analysis.ph.remedy}</p>
              </div>
            )}

            {/* SHAP Explanation Attribution */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Explainable AI: Feature Influence on Dosage (SHAP)</span>
              </h3>
              <div className="space-y-2">
                {result.shap_explanation.map((s, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300 font-medium">{s.feature}</span>
                      <span className="font-mono text-emerald-400">{s.contribution_pct}% influence</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${s.contribution_pct}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
