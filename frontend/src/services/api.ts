import {
  CropPredictionResponse,
  CounterfactualItem,
  SHAPResponse,
  LIMEResponse,
  UtilityResponse,
  IrrigationZoneResponse,
  FederatedRoundResponse,
  FertilizerResponse,
  YieldResponse,
  VisionImageAnalysis,
  FertilizerRecommendationParams,
  FertilizerRecommendationResponse,
  YieldPredictionParams,
  YieldPredictionResponse,
  ModelStatusResponse
} from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2500) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function predictCrop(params: {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  model_type?: string;
}): Promise<CropPredictionResponse> {
  const res = await fetch(`${API_BASE}/crops/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to predict crop');
  return res.json();
}

export async function getCounterfactuals(params: {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  target_crops?: string[];
}): Promise<{ actual_sample: Record<string, number>; counterfactuals: CounterfactualItem[] }> {
  const res = await fetch(`${API_BASE}/crops/counterfactuals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to get counterfactuals');
  return res.json();
}

export async function getSHAPExplanation(params: {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}): Promise<SHAPResponse> {
  const res = await fetch(`${API_BASE}/xai/shap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to get SHAP explanation');
  return res.json();
}

export async function getLIMEExplanation(params: {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}): Promise<LIMEResponse> {
  const res = await fetch(`${API_BASE}/xai/lime`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to get LIME explanation');
  return res.json();
}

export async function getCrossModalRadar(crop: string): Promise<{
  crop: string;
  modalities: { modality: string; value: number; unit: string }[];
  js_divergence: number;
  harmony_status: string;
}> {
  const res = await fetch(`${API_BASE}/xai/radar?crop=${encodeURIComponent(crop)}`);
  if (!res.ok) throw new Error('Failed to get radar data');
  return res.json();
}

export async function getUtilityTradeoff(params: {
  accuracy: number;
  interpretability: number;
  cost: number;
  alpha_t: number;
}): Promise<UtilityResponse> {
  const res = await fetch(`${API_BASE}/xai/utility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to calculate utility');
  return res.json();
}

export async function predictIrrigationZone(params: {
  field_id: string;
  mu_mc: number;
  sigma_mc: number;
  mc_min: number;
  mc_max: number;
  T_mean: number;
  P: number;
  ET0: number;
  mu_NDVI: number;
  sigma_NDVI: number;
  a_NDVI: number;
  C: number;
  A2: number;
  S: number;
}): Promise<IrrigationZoneResponse> {
  const res = await fetch(`${API_BASE}/irrigation/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to predict irrigation zone');
  return res.json();
}

export async function getFederatedRound(roundNumber: number): Promise<FederatedRoundResponse> {
  const res = await fetch(`${API_BASE}/federated/round?round_number=${roundNumber}`);
  if (!res.ok) throw new Error('Failed to get federated round data');
  return res.json();
}

export async function getFederatedConfusionMatrix(): Promise<{
  checkpoint_round: number;
  labels: string[];
  label_names: string[];
  matrix: number[][];
  total_samples: number;
  off_diagonal_errors: number;
  error_characterization: string;
  accuracy: number;
  macro_f1: number;
  qwk: number;
}> {
  const res = await fetch(`${API_BASE}/federated/confusion-matrix`);
  if (!res.ok) throw new Error('Failed to get confusion matrix');
  return res.json();
}

export async function analyzeFertilizer(params: {
  crop: string;
  soil_n: number;
  soil_p: number;
  soil_k: number;
  soil_ph: number;
  farm_area_acres: number;
}): Promise<FertilizerResponse> {
  const res = await fetch(`${API_BASE}/fertilizer/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to analyze fertilizer');
  return res.json();
}

export async function predictYield(params: {
  crop: string;
  area_acres: number;
  soil_n: number;
  soil_p: number;
  soil_k: number;
  soil_moisture: number;
  rainfall_mm: number;
  avg_temp_c: number;
  ndvi: number;
}): Promise<YieldResponse> {
  const res = await fetch(`${API_BASE}/yield/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to predict yield');
  return res.json();
}

export async function getVisionImages(): Promise<{ id: number; filename: string; label: string; path: string }[]> {
  const res = await fetch(`${API_BASE}/vision/list`);
  if (!res.ok) throw new Error('Failed to list vision images');
  return res.json();
}

export async function analyzeVisionImage(filename?: string): Promise<VisionImageAnalysis> {
  const url = filename ? `${API_BASE}/vision/analyze?filename=${encodeURIComponent(filename)}` : `${API_BASE}/vision/analyze`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to analyze image');
  return res.json();
}

export async function diagnoseCropFile(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/crop/diagnose`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to analyze crop image');
  }

  return res.json();
}

export async function analyzeUploadedImage(base64Image: string): Promise<VisionImageAnalysis> {
  const res = await fetch(`${API_BASE}/vision/analyze-base64`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_base64: base64Image }),
  });
  if (!res.ok) throw new Error('Failed to analyze uploaded image');
  return res.json();
}

export async function recommendFertilizer(params: FertilizerRecommendationParams): Promise<FertilizerRecommendationResponse> {
  const res = await fetch(`${API_BASE}/fertilizer/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to generate fertilizer recommendation');
  }
  return res.json();
}

export async function predictCropYield(params: YieldPredictionParams): Promise<YieldPredictionResponse> {
  const res = await fetch(`${API_BASE}/yield/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to predict crop yield');
  }
  return res.json();
}

export async function getModelStatus(): Promise<ModelStatusResponse> {
  const res = await fetch(`${API_BASE}/model/status`);
  if (!res.ok) throw new Error('Failed to retrieve model status');
  return res.json();
}

export async function explainDisease(cropName: string, diseaseName: string): Promise<{
  status: string;
  crop_name: string;
  disease_name: string;
  description: string;
  recommendations: string[];
  explainability_method: string;
}> {
  const res = await fetch(`${API_BASE}/disease/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ crop_name: cropName, disease_name: diseaseName }),
  });
  if (!res.ok) throw new Error('Failed to get disease explanation');
  return res.json();
}


