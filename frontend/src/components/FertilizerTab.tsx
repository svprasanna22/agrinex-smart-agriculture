import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Calendar, 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { analyzeFertilizer } from '../services/api';
import { FertilizerResponse } from '../types';

export const FertilizerTab: React.FC = () => {
  const [params, setParams] = useState({
    crop: 'rice',
    soil_n: 45.0,
    soil_p: 25.0,
    soil_k: 20.0,
    soil_ph: 6.4,
    farm_area_acres: 2.5
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FertilizerResponse | null>(null);

  const cropsList = [
    'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas',
    'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate',
    'banana', 'mango', 'grapes', 'watermelon', 'muskmelon',
    'apple', 'orange', 'papaya', 'coconut', 'cotton', 'jute', 'coffee'
  ];

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await analyzeFertilizer(params);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAnalyze();
  }, [params.crop]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <FlaskConical className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Soil Nutrient Deficit & Fertilizer Dispenser</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Supported by Venkateswara & Padmanaban (Scientific Reports 2025, 41721). 
          Translates soil chemical lab measurements into exact commercial fertilizer dosages and split application timetables.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
            Target Crop & Soil Test Values
          </h3>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Target Crop:</label>
              <select
                value={params.crop}
                onChange={(e) => setParams(prev => ({ ...prev, crop: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 capitalize"
              >
                {cropsList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Farm Cultivation Area</span>
                <span className="text-emerald-400 font-semibold">{params.farm_area_acres} Acres</span>
              </div>
              <input
                type="range" min="0.5" max="25" step="0.5"
                value={params.farm_area_acres}
                onChange={(e) => setParams(prev => ({ ...prev, farm_area_acres: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Soil Available Nitrogen (N)</span>
                <span className="text-emerald-400 font-semibold">{params.soil_n} kg/ha</span>
              </div>
              <input
                type="range" min="0" max="140" step="1"
                value={params.soil_n}
                onChange={(e) => setParams(prev => ({ ...prev, soil_n: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Soil Available Phosphorus (P)</span>
                <span className="text-emerald-400 font-semibold">{params.soil_p} kg/ha</span>
              </div>
              <input
                type="range" min="0" max="100" step="1"
                value={params.soil_p}
                onChange={(e) => setParams(prev => ({ ...prev, soil_p: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Soil Available Potassium (K)</span>
                <span className="text-emerald-400 font-semibold">{params.soil_k} kg/ha</span>
              </div>
              <input
                type="range" min="0" max="120" step="1"
                value={params.soil_k}
                onChange={(e) => setParams(prev => ({ ...prev, soil_k: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Soil pH</span>
                <span className="text-amber-400 font-semibold">{params.soil_ph.toFixed(1)}</span>
              </div>
              <input
                type="range" min="4.0" max="9.0" step="0.1"
                value={params.soil_ph}
                onChange={(e) => setParams(prev => ({ ...prev, soil_ph: parseFloat(e.target.value) }))}
                className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition mt-2"
          >
            Calculate Precise Fertilizer Prescription
          </button>
        </div>

        {/* Right Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <>
              {/* Commercial Fertilizer Bags Summary */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-sm capitalize">
                      Prescribed Commercial Fertilizer Dosage for {result.crop}
                    </h4>
                    <p className="text-xs text-slate-400">Total requirement for {result.farm_area_acres} Acres</p>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400">
                    ICAR Formulated
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Urea */}
                  <div className="bg-slate-850 p-4 rounded-xl border border-slate-750 text-center space-y-1">
                    <span className="text-xs text-slate-400">Urea (46% N)</span>
                    <div className="text-2xl font-black text-white font-mono">
                      {result.fertilizer_dosages.urea_50kg_bags} <span className="text-xs font-normal text-slate-400">bags</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      ({result.fertilizer_dosages.urea_total_kg} kg)
                    </span>
                  </div>

                  {/* DAP */}
                  <div className="bg-slate-850 p-4 rounded-xl border border-slate-750 text-center space-y-1">
                    <span className="text-xs text-slate-400">DAP (18-46-0)</span>
                    <div className="text-2xl font-black text-white font-mono">
                      {result.fertilizer_dosages.dap_50kg_bags} <span className="text-xs font-normal text-slate-400">bags</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      ({result.fertilizer_dosages.dap_total_kg} kg)
                    </span>
                  </div>

                  {/* MOP */}
                  <div className="bg-slate-850 p-4 rounded-xl border border-slate-750 text-center space-y-1">
                    <span className="text-xs text-slate-400">MOP (60% K2O)</span>
                    <div className="text-2xl font-black text-white font-mono">
                      {result.fertilizer_dosages.mop_50kg_bags} <span className="text-xs font-normal text-slate-400">bags</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      ({result.fertilizer_dosages.mop_total_kg} kg)
                    </span>
                  </div>
                </div>

                {/* pH Advisory */}
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-400">Soil pH Status:</span>{' '}
                    <strong className="text-amber-400">{result.nutrient_status.ph.status}</strong>
                    <p className="text-slate-300 mt-0.5">{result.nutrient_status.ph.remedy}</p>
                  </div>
                </div>
              </div>

              {/* Split Application Schedule */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-bold text-white text-sm">3-Stage Synchronized Application Timetable</h4>
                </div>

                <div className="space-y-3">
                  {result.application_schedule.map((stage, idx) => (
                    <div key={idx} className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400">{stage.stage}</span>
                        <div className="flex space-x-2 font-mono">
                          {stage.urea_kg > 0 && <span className="text-slate-300">Urea: {stage.urea_kg} kg</span>}
                          {stage.dap_kg > 0 && <span className="text-slate-300">DAP: {stage.dap_kg} kg</span>}
                          {stage.mop_kg > 0 && <span className="text-slate-300">MOP: {stage.mop_kg} kg</span>}
                        </div>
                      </div>
                      <p className="text-slate-400 text-[11px]">{stage.guidance}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

