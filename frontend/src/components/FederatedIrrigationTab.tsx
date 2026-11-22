import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Droplet, 
  Activity, 
  Server, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { getFederatedRound, predictIrrigationZone, getFederatedConfusionMatrix } from '../services/api';
import { FederatedRoundResponse, IrrigationZoneResponse } from '../types';

export const FederatedIrrigationTab: React.FC = () => {
  const [roundNumber, setRoundNumber] = useState(52);
  const [roundData, setRoundData] = useState<FederatedRoundResponse | null>(null);
  const [confusionData, setConfusionData] = useState<any>(null);
  const [irrigationPrediction, setIrrigationPrediction] = useState<IrrigationZoneResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Irrigation Test Input Form
  const [zoneInputs, setZoneInputs] = useState({
    field_id: 'F1',
    mu_mc: 34.5,
    sigma_mc: 4.2,
    mc_min: 26.0,
    mc_max: 42.0,
    T_mean: 19.5,
    P: 18.0,
    ET0: 15.2,
    mu_NDVI: 0.68,
    sigma_NDVI: 0.07,
    a_NDVI: 1.0,
    C: 0.85,
    A2: 0.04,
    S: 0.92
  });

  const fetchRound = async (r: number) => {
    try {
      const data = await getFederatedRound(r);
      setRoundData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const runZoneInference = async () => {
    try {
      const res = await predictIrrigationZone(zoneInputs);
      setIrrigationPrediction(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRound(roundNumber);
  }, [roundNumber]);

  useEffect(() => {
    getFederatedConfusionMatrix().then(setConfusionData).catch(console.error);
    runZoneInference();
  }, []);

  // Round play simulator
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setRoundNumber(prev => {
          if (prev >= 77) {
            setIsPlaying(false);
            return 52;
          }
          return prev + 1;
        });
      }, 350);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Share2 className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-bold text-white">Reliability-Aware Federated Ordinal Irrigation (FL)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supported by Mwawado et al. (Smart Agricultural Technology 2026, 102460). 
            Weekly irrigation zone prediction using rank-consistent ordinal regression (CORAL) on distributed edge nodes.
          </p>
        </div>

        {/* Communication Round Slider Controls */}
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition"
            title={isPlaying ? "Pause simulation" : "Play rounds 1-77"}
          >
            {isPlaying ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          </button>
          <div className="flex flex-col text-xs">
            <span className="text-slate-400 font-medium">Comm. Round: <strong className="text-sky-400 font-mono text-sm">{roundNumber}</strong> / 77</span>
            <input
              type="range" min="1" max="77"
              value={roundNumber}
              onChange={(e) => setRoundNumber(parseInt(e.target.value))}
              className="accent-sky-500 h-1.5 w-32 bg-slate-700 rounded-lg cursor-pointer mt-1"
            />
          </div>
        </div>
      </div>

      {/* Top Banner: Global Federated Learning State */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Global Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {roundData ? (roundData.global_accuracy * 100).toFixed(1) : '94.4'}%
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">
            Best: 94.4% (Round 52)
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Macro-F1 Score</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {roundData ? roundData.global_macro_f1.toFixed(3) : '0.904'}
          </div>
          <span className="text-[11px] text-sky-400 font-medium">
            Balanced Class Recognition
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Quadratic Weighted Kappa</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {roundData ? roundData.global_qwk.toFixed(3) : '0.975'}
          </div>
          <span className="text-[11px] text-purple-400 font-medium">
            Penalizes Distant Ordinal Inversions
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Payload & Hardware Profile</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono mt-1">
            68.4 kB Tx / 69.1 kB Rx
          </div>
          <span className="text-[11px] text-slate-400">
            Memory: 299.1 MB • Latency: 403 ms
          </span>
        </div>
      </div>

      {/* Main Grid: Client Weighting & CORAL VRI Prescription */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3 Edge Clients & Aggregation Weighting (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm">Server Reliability Aggregation (ω_m = n_m · r_bar_m)</h3>
              <p className="text-xs text-slate-400">Dual-level weighting preserves field locality while moderating degraded sensing (F3)</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-400 font-mono">
              FedAvg-Rel
            </span>
          </div>

          <div className="space-y-3">
            {roundData?.participating_clients.map((client) => {
              const isDegraded = client.field_id === 'F3';
              return (
                <div key={client.field_id} className={`p-4 rounded-xl border transition ${
                  isDegraded ? 'bg-amber-950/20 border-amber-500/30' : 'bg-slate-850 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                        {client.field_id}
                      </span>
                      <h4 className="font-bold text-white text-sm">{client.field_name}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-400">
                      {client.weight_percentage}% Server Weight
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400">Samples (n):</span>{' '}
                      <strong className="text-white">{client.samples_nm}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Reliability (r̄):</span>{' '}
                      <strong className={isDegraded ? 'text-amber-400' : 'text-emerald-400'}>
                        {client.mean_reliability_rbar}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Local QWK:</span>{' '}
                      <strong className="text-white">{client.local_qwk}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span className="font-mono text-slate-400 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{client.encrypted_gradient_hash_aes_gcm}</span>
                    </span>
                    {isDegraded && (
                      <span className="text-amber-400 font-semibold flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Zero-dominated stress downweighted</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Benchmark Table (Table 2 from Mwawado et al.) */}
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase">Ablation & Benchmark Comparison (Table 2)</h4>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-1.5">Configuration</th>
                    <th>Accuracy</th>
                    <th>Macro-F1</th>
                    <th>QWK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                  <tr>
                    <td className="py-1.5 font-sans">Local-only CORAL</td>
                    <td>0.778</td>
                    <td>0.485</td>
                    <td>0.530</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-sans">FedAvg + Multiclass MLP</td>
                    <td>0.861</td>
                    <td>0.604</td>
                    <td>0.915</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-sans">FedAvg + CORAL</td>
                    <td>0.917</td>
                    <td>0.849</td>
                    <td>0.962</td>
                  </tr>
                  <tr className="text-emerald-400 font-bold bg-emerald-950/20">
                    <td className="py-1.5 font-sans">Proposed Reliability Fed-CORAL</td>
                    <td>0.944</td>
                    <td>0.904</td>
                    <td>0.975</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Live CORAL Inference & Confusion Matrix (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Live Weekly Zone & VRI Prescription */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm">CORAL Weekly Irrigation Management Zone Prediction</h3>
                <p className="text-xs text-slate-400">Evaluates 13-D device-week vector with rank-consistent binary cutoffs</p>
              </div>
              <button
                onClick={runZoneInference}
                className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition"
              >
                Re-evaluate
              </button>
            </div>

            {/* Prediction Display */}
            {irrigationPrediction && (
              <div className="bg-gradient-to-br from-slate-850 to-sky-950/40 border border-sky-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
                      Predicted Irrigation Zone
                    </span>
                    <h4 className="text-2xl font-black text-white mt-0.5">
                      Zone {irrigationPrediction.predicted_zone_name}
                    </h4>
                  </div>
                  <div className="text-right bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-xl font-bold text-sky-400">
                      {irrigationPrediction.prescribed_irrigation_depth_mm} mm
                    </div>
                    <span className="text-[10px] text-slate-400">Prescribed VRI Depth</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300">
                  {irrigationPrediction.zone_description}
                </p>

                {/* Threshold Probabilities */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400">CORAL Threshold Cumulative Probabilities p_k:</span>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    {irrigationPrediction.threshold_probabilities.map((prob, idx) => (
                      <div key={idx} className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                        <span className="text-slate-400 text-[10px]">Threshold b{idx}</span>
                        <div className={`font-bold mt-0.5 ${prob > 0.40 ? 'text-sky-400' : 'text-slate-500'}`}>
                          {prob.toFixed(3)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Input adjustment sliders */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Soil Moisture (μ_mc):</span>
                  <span className="font-semibold text-sky-400">{zoneInputs.mu_mc}%</span>
                </div>
                <input
                  type="range" min="10" max="50" step="0.5"
                  value={zoneInputs.mu_mc}
                  onChange={(e) => setZoneInputs(prev => ({ ...prev, mu_mc: parseFloat(e.target.value) }))}
                  className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Precipitation (P):</span>
                  <span className="font-semibold text-sky-400">{zoneInputs.P} mm</span>
                </div>
                <input
                  type="range" min="0" max="60" step="1"
                  value={zoneInputs.P}
                  onChange={(e) => setZoneInputs(prev => ({ ...prev, P: parseFloat(e.target.value) }))}
                  className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Temporal Stability (S):</span>
                  <span className="font-semibold text-sky-400">{zoneInputs.S.toFixed(2)}</span>
                </div>
                <input
                  type="range" min="0.0" max="1.0" step="0.05"
                  value={zoneInputs.S}
                  onChange={(e) => setZoneInputs(prev => ({ ...prev, S: parseFloat(e.target.value) }))}
                  className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Vegetation NDVI:</span>
                  <span className="font-semibold text-sky-400">{zoneInputs.mu_NDVI.toFixed(2)}</span>
                </div>
                <input
                  type="range" min="0.1" max="0.9" step="0.05"
                  value={zoneInputs.mu_NDVI}
                  onChange={(e) => setZoneInputs(prev => ({ ...prev, mu_NDVI: parseFloat(e.target.value) }))}
                  className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Best Checkpoint Confusion Matrix (Figure 5) */}
          {confusionData && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h4 className="font-bold text-white text-sm">Round 52 Confusion Matrix (Figure 5)</h4>
                  <p className="text-xs text-slate-400">36 Held-Out Deployment Samples • Diagonal Concentration</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">
                  Zero Inversions
                </span>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="p-2 text-left">Reference \ Predicted</th>
                      <th className="p-2">L</th>
                      <th className="p-2">M</th>
                      <th className="p-2">MH</th>
                      <th className="p-2">H</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                    {confusionData.matrix.map((row: number[], rIdx: number) => (
                      <tr key={rIdx}>
                        <td className="p-2 font-bold font-sans text-left text-slate-300">
                          {confusionData.labels[rIdx]}
                        </td>
                        {row.map((val: number, cIdx: number) => {
                          const isDiagonal = rIdx === cIdx;
                          const isNonZero = val > 0;
                          return (
                            <td 
                              key={cIdx} 
                              className={`p-2 font-bold ${
                                isDiagonal && isNonZero 
                                  ? 'bg-emerald-600/30 text-emerald-300' 
                                  : isNonZero 
                                  ? 'bg-amber-600/30 text-amber-300' 
                                  : 'text-slate-600'
                              }`}
                            >
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-slate-400">
                Notice: All predictions lie on the diagonal or immediate adjacent cells (L↔M, M↔MH). 
                Zero errors occur between distant classes (e.g. Low never confused with High).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

