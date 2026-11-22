import React from 'react';
import {
  ShieldCheck,
  Cpu,
  TrendingUp,
  Zap,
  Server,
  Radio,
  CheckCircle2,
  ArrowRight,
  Database,
  ExternalLink
} from 'lucide-react';

interface OverviewTabProps {
  onSelectTab: (tabId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onSelectTab }) => {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 border border-emerald-500/20 p-6 md:p-8">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span>Research Paper Reference Implementation</span>
            <span>•</span>
            <span>Department of Artificial Intelligence & CSE</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Hybrid AI Framework for Smart Agriculture Using Explainable AI, Federated Learning, and Edge Computing
          </h2>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            An end-to-end decentralized agricultural intelligence platform designed to handle multimodal farm data
            (IoT soil sensors, drone imagery, satellite NDVI, and microclimate feeds) while preserving raw data locality.
            Integrates reliability-aware federated averaging, rank-consistent ordinal regression (CORAL), and deep explainability (SHAP, LIME, Grad-CAM, Counterfactuals) directly at the edge.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
            <div>
              <span className="text-slate-400">Authors:</span>{' '}
              <span className="font-semibold text-white">Vijay Prasanna S, Sakthi Sriram S, Nalin Naik M, Dr. Senthil Kumar Thangavel</span>
            </div>
            <div>
              <span className="text-slate-400">Project:</span>{' '}
              <span className="font-medium text-emerald-300">AgriNex Smart Agriculture</span>
            </div>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Key Benchmark Metrics Grid (Exact values from literature) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1.5 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>AgroXAI Top Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">99.24%</div>
          <p className="text-xs text-emerald-400/90 font-medium">Random Forest (Table III)</p>
          <p className="text-[11px] text-slate-400">Turgut et al. (AgroXAI 2024)</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1.5 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Federated Ordinal QWK</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">0.975</div>
          <p className="text-xs text-sky-400/90 font-medium">Quadratic Weighted Kappa</p>
          <p className="text-[11px] text-slate-400">Mwawado et al. (2026 Table 2)</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1.5 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Edge Resource Efficiency</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">59% / 41%</div>
          <p className="text-xs text-amber-400/90 font-medium">Energy & Comm. Cost Savings</p>
          <p className="text-[11px] text-slate-400">Alasbali et al. (IEEE TCE 2025)</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1.5 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>XAI Explanation Fidelity</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">0.910</div>
          <p className="text-xs text-purple-400/90 font-medium">PEFI Agreement Index</p>
          <p className="text-[11px] text-slate-400">Tahir et al. (IEEE Access 2025)</p>
        </div>
      </div>

      {/* 4-Tier Hierarchical Architecture Diagram */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white">System Architecture & Processing Pipeline</h3>
            <p className="text-xs text-slate-400">
              Coordinated Edge-Fog-Cloud Workflow (Physical Sensing → Edge Inference → Reliability-Weighted FL Aggregation → XAI Decision Support)
            </p>
          </div>
          <span className="px-2.5 py-1 text-xs bg-slate-800 text-slate-300 rounded-md border border-slate-700">
            No External DB (Zero DB Footprint)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Layer 1 */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold mb-1">
                <Radio className="w-4 h-4" />
                <span>1. Physical & IoT Layer</span>
              </div>
              <h4 className="font-bold text-white text-sm">Multimodal Sensing</h4>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                <li>• 18 Dragino LSE01 Soil Sensors</li>
                <li>• Volumetric Water Content (VWC)</li>
                <li>• Sentinel-2 Level-2A NDVI</li>
                <li>• Open-Meteo Weather API</li>
                <li>• In-situ Field Camera Imagery</li>
              </ul>
            </div>
            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800">
              Captures field-level heterogeneity and environmental microclimates.
            </div>
          </div>

          {/* Layer 2 */}
          <div className="bg-slate-800/60 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold mb-1">
                <Cpu className="w-4 h-4" />
                <span>2. Local Edge Layer</span>
              </div>
              <h4 className="font-bold text-white text-sm">Edge Computing Nodes</h4>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                <li>• Raspberry Pi 4B / Jetson TX2</li>
                <li>• Local Preprocessing & MAD QC</li>
                <li>• Reliability Scoring (C, A2, S)</li>
                <li>• CORAL Local Loss Optimization</li>
                <li>• Latency: &lt; 18.2 ms per inference</li>
              </ul>
            </div>
            <div className="text-[11px] text-emerald-300/80 bg-slate-900/60 p-2 rounded border border-slate-800">
              Raw data never leaves the farm boundary. Privacy-preserving by default.
            </div>
          </div>

          {/* Layer 3 */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold mb-1">
                <Server className="w-4 h-4" />
                <span>3. Federated Server</span>
              </div>
              <h4 className="font-bold text-white text-sm">Reliability Aggregation</h4>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                <li>• Weight: ω_m = n_m * r_bar_m</li>
                <li>• Downweights noisy sensors (F3)</li>
                <li>• AES-256-GCM Encrypted Payloads</li>
                <li>• 68.4 kB transmit / 69.1 kB recv</li>
                <li>• Checkpoint: Round 52 (QWK 0.975)</li>
              </ul>
            </div>
            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800">
              Stabilizes global learning despite non-IID and intermittent data.
            </div>
          </div>

          {/* Layer 4 */}
          <div className="bg-slate-800/60 border border-purple-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center space-x-2 text-purple-400 text-xs font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>4. XAI & Decision Layer</span>
              </div>
              <h4 className="font-bold text-white text-sm">Actionable Advisory</h4>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                <li>• SHAP Waterfall & Force Plots</li>
                <li>• LIME Local Rule Explanations</li>
                <li>• AgroXAI Counterfactual What-Ifs</li>
                <li>• Grad-CAM Leaf Lesion Maps</li>
                <li>• Utility Optimization UT(A, I)</li>
              </ul>
            </div>
            <div className="text-[11px] text-purple-300/80 bg-slate-900/60 p-2 rounded border border-slate-800">
              Empowers farmers with transparent reasons and exact actionable steps.
            </div>
          </div>
        </div>
      </div>

      {/* 3 Real Experimental Edge Nodes Status (Table 1 from Mwawado et al.) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white">Active Federated Edge Client Nodes</h3>
            <p className="text-xs text-slate-400">
              Real-world deployment testbed from Mwawado et al. (Table 1) evaluating heterogeneous soils and degraded sensing stress conditions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Field 1 */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white px-2 py-0.5 bg-slate-700 rounded">Client F1</span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Reliable / Moderate
              </span>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Field 1 (Flanders North)</h4>
              <p className="text-xs text-slate-400">Clay Loam (24.1% Sand, 47.5% Silt, 28.4% Clay)</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div><span className="text-slate-500">Area:</span> 12.20 ha</div>
              <div><span className="text-slate-500">Sensors:</span> 8 nodes</div>
              <div><span className="text-slate-500">Completeness (C):</span> 0.62</div>
              <div><span className="text-slate-500">Stability (S):</span> 0.81</div>
              <div><span className="text-slate-500">r_prior:</span> 0.95</div>
              <div><span className="text-slate-500">Blended Rel.:</span> <strong className="text-emerald-400">0.85</strong></div>
            </div>
            <p className="text-[11px] text-slate-400">
              Supports GIS inverse distance weighting (IDW) interpolation & Natural Breaks zonation.
            </p>
          </div>

          {/* Field 2 */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white px-2 py-0.5 bg-slate-700 rounded">Client F2</span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Reliable
              </span>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Field 2 (Flanders Central)</h4>
              <p className="text-xs text-slate-400">Clay (10.3% Sand, 32.8% Silt, 53.4% Clay)</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div><span className="text-slate-500">Area:</span> 10.28 ha</div>
              <div><span className="text-slate-500">Sensors:</span> 6 nodes</div>
              <div><span className="text-slate-500">Completeness (C):</span> 0.79</div>
              <div><span className="text-slate-500">Stability (S):</span> 0.95</div>
              <div><span className="text-slate-500">r_prior:</span> 1.00</div>
              <div><span className="text-slate-500">Blended Rel.:</span> <strong className="text-emerald-400">0.94</strong></div>
            </div>
            <p className="text-[11px] text-slate-400">
              Highest quality sensor telemetry with minimal noise and maximum server weighting.
            </p>
          </div>

          {/* Field 3 */}
          <div className="bg-slate-800/40 border border-amber-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white px-2 py-0.5 bg-slate-700 rounded">Client F3</span>
              <span className="text-xs font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                Degraded Stress Client
              </span>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Field 3 (Flanders South)</h4>
              <p className="text-xs text-slate-400">Sandy Soil (73.1% Sand, 16.3% Silt, 10.7% Clay)</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div><span className="text-slate-500">Area:</span> 7.18 ha</div>
              <div><span className="text-slate-500">Sensors:</span> 4 nodes</div>
              <div><span className="text-slate-500">Completeness (C):</span> 0.76</div>
              <div><span className="text-slate-500">Stability (S):</span> <span className="text-red-400">0.02 (Flatline)</span></div>
              <div><span className="text-slate-500">r_prior:</span> 0.40</div>
              <div><span className="text-slate-500">Blended Rel.:</span> <strong className="text-amber-400">0.46</strong></div>
            </div>
            <p className="text-[11px] text-amber-400/90">
              Reliability-weighting successfully moderates degraded readings without discarding local field participation.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Exploration Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onSelectTab('crop-rec')}
          className="text-left bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-xl transition group"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition">AgroXAI Crop Recommender</h4>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition text-emerald-400" />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Test 22 crop varieties with 99.24% Random Forest accuracy and generate counterfactual what-if paths.
          </p>
        </button>

        <button
          onClick={() => onSelectTab('federated')}
          className="text-left bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 p-5 rounded-xl transition group"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm group-hover:text-sky-400 transition">Federated Ordinal Irrigation</h4>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition text-sky-400" />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Simulate 77 communication rounds of reliability-aware FedAvg with CORAL ordinal ranking.
          </p>
        </button>

        <button
          onClick={() => onSelectTab('vision')}
          className="text-left bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 p-5 rounded-xl transition group"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm group-hover:text-purple-400 transition">Plant Vision & Grad-CAM</h4>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition text-purple-400" />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Analyze authentic field crop photos, compute Excess Green canopy coverage, and view Grad-CAM heatmaps.
          </p>
        </button>
      </div>
    </div>
  );
};

