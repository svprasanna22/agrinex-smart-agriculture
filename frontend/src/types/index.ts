export interface CropPredictionResponse {
  model_used: string;
  model_accuracy: number;
  recommended_crop: string;
  confidence: number;
  confidence_percentage: number;
  top_recommendations: {
    crop: string;
    probability: number;
    percentage: number;
  }[];
  all_probabilities: Record<string, number>;
}

export interface FeatureAdjustment {
  feature: string;
  display_name: string;
  current_value: number;
  target_value: number;
  delta: number;
  direction: 'increase' | 'decrease' | 'unchanged';
  is_controllable: boolean;
  unit: string;
}

export interface CounterfactualItem {
  counterfactual_id: string;
  target_crop: string;
  feasibility: string;
  total_perturbation_distance: number;
  feature_adjustments: FeatureAdjustment[];
  target_parameters: Record<string, number>;
}

export interface SHAPFeature {
  feature: string;
  display_name: string;
  value: number;
  shap_value: number;
  impact: 'positive' | 'negative';
  description: string;
}

export interface SHAPResponse {
  crop: string;
  prediction_probability: number;
  base_value: number;
  shap_values: Record<string, number>;
  waterfall_data: SHAPFeature[];
  efficiency_check: {
    sum_shap: number;
    delta_from_base: number;
  };
}

export interface LIMERule {
  feature: string;
  rule: string;
  weight: number;
  direction: 'supports' | 'opposes';
  target_crop: string;
}

export interface LIMEResponse {
  crop: string;
  confidence: number;
  local_rules: LIMERule[];
}

export interface UtilityResponse {
  task_mode: string;
  alpha_t: number;
  utility_score_UT: number;
  composite_metric_xi: number;
  accuracy_score: number;
  interpretability_pefi: number;
  cost_metric: number;
  interpretation: string;
}

export interface IrrigationZoneResponse {
  latent_score: number;
  threshold_probabilities: number[];
  threshold_decision_cutoff: number;
  predicted_zone_code: string;
  predicted_zone_name: string;
  zone_description: string;
  prescribed_irrigation_depth_mm: number;
  reliability_analysis: {
    r_prior: number;
    r_dyn: number;
    r_blend: number;
    completeness_C: number;
    anomaly_A2: number;
    stability_S: number;
  };
  soil_status: string;
}

export interface FederatedClientUpdate {
  field_id: string;
  field_name: string;
  samples_nm: number;
  mean_reliability_rbar: number;
  server_aggregation_weight_omega: number;
  weight_percentage: number;
  local_accuracy: number;
  local_qwk: number;
  encrypted_gradient_hash_aes_gcm: string;
}

export interface FederatedRoundResponse {
  communication_round: number;
  total_rounds: number;
  best_checkpoint_round: number;
  global_accuracy: number;
  global_macro_f1: number;
  global_qwk: number;
  server_transmit_kb: number;
  server_receive_kb: number;
  total_send_time_ms: number;
  total_receive_time_ms: number;
  server_memory_mb: number;
  participating_clients: FederatedClientUpdate[];
  benchmark_comparison: Record<string, { Accuracy: number; Macro_F1: number; QWK: number }>;
}

export interface FertilizerResponse {
  crop: string;
  farm_area_acres: number;
  nutrient_status: {
    nitrogen: { current: number; target: number; deficit: number; status: string };
    phosphorus: { current: number; target: number; deficit: number; status: string };
    potassium: { current: number; target: number; deficit: number; status: string };
    ph: { current: number; ideal: number; status: string; remedy: string };
  };
  fertilizer_dosages: {
    urea_50kg_bags: number;
    urea_total_kg: number;
    dap_50kg_bags: number;
    dap_total_kg: number;
    mop_50kg_bags: number;
    mop_total_kg: number;
  };
  application_schedule: {
    stage: string;
    urea_kg: number;
    dap_kg: number;
    mop_kg: number;
    guidance: string;
  }[];
}

export interface YieldResponse {
  crop: string;
  area_acres: number;
  area_hectares: number;
  potential_yield_tons_per_ha: number;
  predicted_yield_tons_per_ha: number;
  predicted_yield_quintals_per_ha: number;
  total_production_tons: number;
  total_production_quintals: number;
  limiting_factors: Record<string, string>;
  edge_fog_cloud_efficiency: Record<string, any>;
}

export interface VisionImageAnalysis {
  filename: string;
  image_dimensions: { width: number; height: number };
  canopy_coverage_percentage: number;
  chlorophyll_health_index: number;
  lesion_surface_percentage: number;
  condition: string;
  severity_level: string;
  agronomic_prescription: string;
  edge_inference_latency_ms: number;
  grad_cam_fidelity_pefi: number;
  original_image_base64: string;
  grad_cam_overlay_base64: string;
}

// =========================================================================
// Farmer-Centric Platform Types (Dummy Auth, History, Recommendation, Yield)
// =========================================================================

export interface UserSession {
  name: string;
  email: string;
  farmLocation?: string;
  memberSince?: string;
}

export interface CropHistoryEntry {
  id: string;
  timestamp: string;
  dateFormatted: string;
  cropName: string;
  diseaseName: string;
  status: 'healthy' | 'diseased' | 'unknown';
  confidence: number;
  thumbnail: string; // downscaled data URL for safe local storage
  message: string;
  description?: string;
  recommendations?: string[];
  gradCamOverlay?: string;
}

export interface FertilizerRecommendationParams {
  crop_name: string;
  soil_type: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soil_moisture: number;
  soil_ph: number;
  temperature?: number;
  humidity?: number;
  previous_fertilizer?: string;
  crop_growth_stage?: string;
  farm_area_acres: number;
}

export interface FertilizerRecommendationResponse {
  status: string;
  crop: string;
  soil_type: string;
  farm_area_acres: number;
  farm_area_hectares: number;
  recommended_fertilizer: string;
  primary_reason: string;
  soil_characteristics: string;
  nutrient_analysis: {
    nitrogen: { current: number; target: number; deficit: number; unit: string };
    phosphorus: { current: number; target: number; deficit: number; unit: string };
    potassium: { current: number; target: number; deficit: number; unit: string };
    ph: { current: number; ideal: number; status: string; remedy: string };
    moisture: { current: number; optimal: number; unit: string };
  };
  deficiencies: {
    nutrient: string;
    deficit_kg_ha: number;
    severity: string;
    impact: string;
  }[];
  fertilizer_dosages: {
    urea: { total_kg: number; bags_50kg: number };
    dap: { total_kg: number; bags_50kg: number };
    mop: { total_kg: number; bags_50kg: number };
  };
  application_guidance: {
    step: number;
    stage: string;
    action: string;
    notes: string;
  }[];
  shap_explanation: {
    feature: string;
    contribution_pct: number;
    impact: string;
  }[];
}

export interface YieldPredictionParams {
  crop_type: string;
  cultivated_area: number;
  area_unit: string;
  season: string;
  soil_type: string;
  rainfall?: number;
  temperature?: number;
  humidity?: number;
  irrigation_availability?: string;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
}

export interface YieldPredictionResponse {
  status: string;
  crop: string;
  cultivated_area: number;
  area_unit: string;
  area_hectares: number;
  area_acres: number;
  season: string;
  soil_type: string;
  base_potential_tons_ha: number;
  predicted_yield_tons_ha: number;
  predicted_yield_kg_ha: number;
  total_production_tons: number;
  total_production_quintals: number;
  total_production_kg: number;
  influencing_factors: {
    factor: string;
    score_pct: number;
    status: string;
  }[];
  irrigation_analysis: string;
  shap_explanation: {
    feature: string;
    weight_pct: number;
    direction: string;
  }[];
  summary_explanation: string;
}

export interface ModelStatusResponse {
  status: string;
  models: Record<string, {
    name: string;
    configured: boolean;
    classes?: number;
    framework?: string;
    checkpoint?: string;
    explainability?: string;
    benchmark_accuracy?: string;
    dataset?: string;
    methodology?: string;
  }>;
}

export interface DashboardSummary {
  totalAnalyses: number;
  healthyCount: number;
  diseasedCount: number;
  unknownCount: number;
  fertilizerCount: number;
  yieldCount: number;
  lastAnalysisDate: string | null;
  healthRatio: number;
}


