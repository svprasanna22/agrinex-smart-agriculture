import React from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  Code, 
  Database,
  Layers,
  Award
} from 'lucide-react';

export const ResearchLibraryTab: React.FC = () => {
  const papers = [
    {
      id: 1,
      title: "Hybrid AI Framework for Smart Agriculture Using Explainable AI, Federated Learning, and Edge Computing",
      authors: "Vijay Prasanna S, Sakthi Sriram S, Nalin Naik M, Dr. Senthil Kumar Thangavel",
      institution: "AgriNex Research Initiative",
      publication: "Primary Research Specification & Architectural Framework, 2026",
      key_role: "Core architectural blueprint: unifies multimodal sensing, edge preprocessing, reliability-weighted FL, XAI (SHAP, LIME, Grad-CAM, Counterfactuals), and multi-task agronomic decision support.",
      metrics: "Integrates 5 agricultural modules without external database dependency."
    },
    {
      id: 2,
      title: "AgroXAI: Explainable AI-Driven Crop Recommendation System for Agriculture 4.0",
      authors: "Ö. Turgut, İ. Kök, S. Özdemir",
      institution: "Pamukkale University, Ankara University, Hacettepe University, Turkey",
      publication: "arXiv preprint arXiv:2412.16196, 2024",
      key_role: "Crop recommendation benchmark with Random Forest (99.24%), Decision Tree (98.48%), LightGBM (97.58%), ELI5 tree weights, SHAP force plots, and Counterfactual alternative crop generation (Table IV & V).",
      metrics: "RF 99.24% Acc, DT 98.48%, LGBM 97.58%, SVM 97.42%."
    },
    {
      id: 3,
      title: "Reliability-Aware Federated Ordinal Learning for Weekly Irrigation Management Zone Prediction on Edge Nodes",
      authors: "R. Mwawado, J. Nsenga, M. Zennaro, D. Hanyurwimfura, A. Morellos, M. Qaswar, A. M. Mouazen",
      institution: "University of Rwanda, ICTP Italy, Ghent University Belgium",
      publication: "Smart Agricultural Technology, vol. 15, p. 102460, 2026",
      key_role: "13-D device-week feature fusion, rank-consistent ordinal regression (CORAL), sensor reliability blending (λ=0.35, r_min=0.10), 3-field edge testbed (F1, F2, F3), and reliability-weighted FedAvg (ω_m = n_m · r̄_m).",
      metrics: "Checkpoint Round 52: Accuracy 0.944, Macro-F1 0.904, QWK 0.975. Zero distant inversions."
    },
    {
      id: 4,
      title: "A Federated Explainable AI Framework for Smart Agriculture: Enhancing Transparency, Efficiency, and Sustainability",
      authors: "H. A. Tahir, W. Alayed, W. U. Hassan",
      institution: "Western Sydney University, NeuroArc Labs, Princess Nourah bint Abdulrahman University",
      publication: "IEEE Access, vol. 13, pp. 97567-97584, 2025",
      key_role: "AES-256-GCM encrypted gradient exchange, accuracy-interpretability utility formulation UT(A, I) = α_T · A + (1 - α_T) · I, Grad-CAM visual heatmaps, and cross-modal harmony analysis (JSD < 0.15).",
      metrics: "PEFI 0.910 fidelity, 59% energy reduction, 41% communication savings, <18 ms edge latency."
    },
    {
      id: 5,
      title: "Interpretable Deep Learning Models for Independent Fertilizer and Crop Recommendation",
      authors: "S. M. Venkateswara, J. Padmanaban",
      institution: "Scientific Reports, Nature Publishing Group",
      publication: "Scientific Reports, vol. 15, p. 41721, 2025",
      key_role: "Crop nutrient requirements vs soil test deficits, iterative imputation, TabNet classification, SHAP feature attributions, and exact commercial fertilizer conversion (Urea, DAP, MOP, Lime/Gypsum).",
      metrics: "High predictive accuracy with complete chemical stoichiometric balancing."
    },
    {
      id: 6,
      title: "Advancing Crop Recommendation System with Supervised Machine Learning and Explainable Artificial Intelligence",
      authors: "S. Shastri, S. Kumar, V. Mansotra, R. Salgotra",
      institution: "Scientific Reports, Nature Publishing Group",
      publication: "Scientific Reports, 2025",
      key_role: "Supervised ensemble machine learning with Gradient Boosting and Random Forest, identifying decisive environmental features via SHAP summary rankings.",
      metrics: "Ensemble classification robustness over 22 Indian agricultural zones."
    },
    {
      id: 7,
      title: "Role of Explainable AI in Crop Recommendation Technique of Smart Farming",
      authors: "Y. Akkem, S. K. Biswas, A. Varanasi",
      institution: "International Journal of Intelligent Systems and Applications",
      publication: "IJISA, vol. 17, no. 1, pp. 31-52, 2025",
      key_role: "Comparative evaluation of LIME local surrogates, SHAP Shapley values, and counterfactual perturbation paths for farmer-accessible advisory.",
      metrics: "Fosters user confidence and adoption in precision agriculture."
    },
    {
      id: 8,
      title: "IoT-UAV Enabled Intelligent Resource Management in Low-Carbon Smart Agriculture Using Federated Reinforcement Learning",
      authors: "N. Alasbali, F. Masood, N. Alnazzawi, W. Ghaban, A. Alazeb, S. Basurra, F. Saeed",
      institution: "IEEE Transactions on Consumer Electronics",
      publication: "IEEE Trans. Consumer Electronics, 2025, doi: 10.1109/TCE.2025.3572552",
      key_role: "Federated reinforcement learning for UAV flight paths and IoT resource scheduling, reducing carbon footprint and device battery drainage.",
      metrics: "59% IoT/UAV energy savings compared to centralized baselines."
    },
    {
      id: 9,
      title: "Centralized and Vertical Federated Learning for Climate-Based Crop Yield Prediction",
      authors: "D. D. Koksal, K. E. Bennin, B. Tekinerdogan",
      institution: "Wageningen University & Research, The Netherlands",
      publication: "Computers and Electronics in Agriculture, vol. 249, p. 111851, 2026",
      key_role: "Climate-driven yield forecasting for staple grains under horizontal and vertical federated settings across multi-country zones.",
      metrics: "Preserves cross-institutional data privacy while optimizing yield regressions."
    },
    {
      id: 10,
      title: "Image-Based Crop Disease Detection with Federated Learning",
      authors: "D. M. Kabala, A. Hafiane, L. Bobelin, R. Canals",
      institution: "INSA Centre Val de Loire, France",
      publication: "Scientific Reports, vol. 13, p. 19220, 2023",
      key_role: "Federated CNN and Vision Transformer classification over PlantVillage leaf pathology images, demonstrating convergence across client distributions.",
      metrics: "Edge inference under communication and client-heterogeneity constraints."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Research Papers & Mathematical Formulations</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Complete annotated bibliography and technical foundations supporting the Hybrid AI Framework for Smart Agriculture.
        </p>
      </div>

      {/* Synthesis of Research Gap Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Research Gap Emerging from the Literature</h3>
            <p className="text-xs text-slate-400">Identified in Team 1 Primary Paper (Section V)</p>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            Literature Review Synthesis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-white flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. Fragmentation Across Isolated Tasks</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Prior studies focus strictly on a single task (crop selection only, or disease detection only, or yield prediction only). This framework unifies all 5 core functions under a synchronized multimodal architecture.
            </p>
          </div>

          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-white flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>2. Separation of XAI, FL, and Edge Tiers</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              XAI studies focus on centralized post-hoc explainability, while FL studies focus purely on privacy without explainability. Our framework integrates SHAP, LIME, and Grad-CAM directly on edge-trained models.
            </p>
          </div>

          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-white flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. Unreliable Sensing & Heterogeneous Non-IID Data</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Field IoT networks frequently suffer from calibration drift, flatlines, and missing transmissions. Mwawado et al.’s dual-weighting scheme ensures degraded clients (F3) do not distort the global model.
            </p>
          </div>

          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-white flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>4. Loss of Ordinal Structure in Irrigation Decisions</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Standard multiclass models treat Low, Medium, and High irrigation zones as independent categories. The CORAL rank-consistent formulation preserves label ordering and eliminates harmful distant inversions (QWK = 0.975).
            </p>
          </div>
        </div>
      </div>

      {/* Core Mathematical Formulations */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
          Core Mathematical Formulations Implemented
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* Formula 1 */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-sans font-semibold text-[11px] block">
              1. Sensor Reliability Blending Model (Mwawado et al. Eq. 2)
            </span>
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-sky-300">
              r_blend(f, d, τ) = clip(λ · r_prior(f, d) + (1 - λ) · r_dyn(f, d, τ), r_min, 1.0)
            </div>
            <p className="font-sans text-[11px] text-slate-400">
              Where λ = 0.35, r_min = 0.10. Balances prior deployment trust with observed dynamic completeness, anomaly burden, and stability.
            </p>
          </div>

          {/* Formula 2 */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-sans font-semibold text-[11px] block">
              2. Reliability-Aware Server Aggregation (Mwawado et al. Eq. 6 & 7)
            </span>
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-sky-300">
              ω_m = n_m · r̄_m ;  θ^(r+1) = (Σ ω_m · θ_m^(r+1)) / (Σ ω_m)
            </div>
            <p className="font-sans text-[11px] text-slate-400">
              Weights client updates by both local sample count and mean blended sensor quality, providing robustness under degraded sensing.
            </p>
          </div>

          {/* Formula 3 */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-sans font-semibold text-[11px] block">
              3. Accuracy-Interpretability Utility Function (Tahir et al. Eq. 18)
            </span>
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-purple-300">
              UT(A, I) = α_T · Accuracy + (1 - α_T) · Interpretability (PEFI)
            </div>
            <p className="font-sans text-[11px] text-slate-400">
              Dynamically tunes system balance: α_T = 0.40 for farmer trust, α_T = 0.80 for equipment predictive maintenance.
            </p>
          </div>

          {/* Formula 4 */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-sans font-semibold text-[11px] block">
              4. Rank-Consistent Ordinal Classification (CORAL Eq. 3 & 4)
            </span>
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-emerald-300">
              p_k = σ(s(x) - b_k) ;  ŷ = Σ I[p_k &gt; τ]  (b_0 &lt; b_1 &lt; b_2)
            </div>
            <p className="font-sans text-[11px] text-slate-400">
              Guarantees threshold monotonicity across Low (0), Medium (1), Mod-High (2), and High (3) weekly moisture classes.
            </p>
          </div>
        </div>
      </div>

      {/* Annotated Bibliography */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Annotated Research Bibliography (The 10 Studies)</h3>

        <div className="space-y-3">
          {papers.map((p) => (
            <div key={p.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 font-mono">Paper #{p.id}</span>
                <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {p.institution.split(',')[0]}
                </span>
              </div>

              <h4 className="font-bold text-white text-sm">{p.title}</h4>
              <p className="text-xs text-slate-300">
                <span className="text-slate-400">Authors:</span> {p.authors} — <span className="italic text-slate-400">{p.publication}</span>
              </p>

              <div className="text-xs bg-slate-850 p-3 rounded-lg border border-slate-800 space-y-1">
                <div>
                  <strong className="text-slate-200">Role in Framework:</strong>{' '}
                  <span className="text-slate-300">{p.key_role}</span>
                </div>
                <div>
                  <strong className="text-emerald-400">Reported Benchmark:</strong>{' '}
                  <span className="text-slate-300 font-mono">{p.metrics}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

