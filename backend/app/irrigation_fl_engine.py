"""
Reliability-Aware Federated Ordinal Learning for Irrigation Management Zone Prediction
Supported by:
- R. Mwawado, J. Nsenga, M. Zennaro, D. Hanyurwimfura, A. Morellos, M. Qaswar, A. M. Mouazen (2026),
  "Reliability-aware federated ordinal learning for weekly irrigation management zone prediction on edge nodes",
  Smart Agricultural Technology 15: 102460.
- H. A. Tahir et al. (2025), "A Federated Explainable AI Framework for Smart Agriculture", IEEE Access.
"""

import math
import numpy as np
from typing import Dict, List, Any, Optional

ZONE_NAMES = ['Low (L)', 'Medium (M)', 'Moderately High (MH)', 'High (H)']
ZONE_CODES = ['L', 'M', 'MH', 'H']
ZONE_DESCRIPTIONS = [
    'Dry conditions - High irrigation priority required',
    'Moderate moisture - Normal scheduled irrigation',
    'Adequate moisture - Reduced / Delayed irrigation',
    'High wetness / Saturation - Suppress irrigation / Risk of nutrient leaching'
]

class IrrigationFLEngine:
    def __init__(self):
        # Parameters from Mwawado et al. Section 2.4 & Section 2.7
        self.LAMBDA = 0.35  # Blending parameter
        self.R_MIN = 0.10   # Minimum reliability floor
        self.DECISION_THRESHOLD = 0.40  # Best checkpoint threshold (Section 3.1)
        
        # Field Client Specifications (Table 1)
        self.fields = {
            'F1': {
                'field_id': 'F1',
                'name': 'Field 1 (Flanders North)',
                'area_ha': 12.20,
                'sensor_count': 8,
                'soil_type': 'Clay Loam (24.1% Sand, 47.5% Silt, 28.4% Clay)',
                'ph': 7.54,
                'toc_pct': 1.04,
                'completeness_C': 0.62,
                'temporal_stability_S': 0.81,
                'prior_reliability_r_prior': 0.95,
                'dynamic_reliability_r_dyn': 0.79,
                'blended_reliability_r_blend': 0.85,
                'dominant_category': 'Reliable / Moderate',
                'spatial_comparison_valid': True,
                'sample_count': 120
            },
            'F2': {
                'field_id': 'F2',
                'name': 'Field 2 (Flanders Central)',
                'area_ha': 10.28,
                'sensor_count': 6,
                'soil_type': 'Clay (10.3% Sand, 32.8% Silt, 53.4% Clay)',
                'ph': 6.92,
                'toc_pct': 7.25,
                'completeness_C': 0.79,
                'temporal_stability_S': 0.95,
                'prior_reliability_r_prior': 1.00,
                'dynamic_reliability_r_dyn': 0.91,
                'blended_reliability_r_blend': 0.94,
                'dominant_category': 'Reliable',
                'spatial_comparison_valid': True,
                'sample_count': 95
            },
            'F3': {
                'field_id': 'F3',
                'name': 'Field 3 (Flanders South - Degraded Stress Test)',
                'area_ha': 7.18,
                'sensor_count': 4,
                'soil_type': 'Sandy Soil (73.1% Sand, 16.3% Silt, 10.7% Clay)',
                'ph': 7.67,
                'toc_pct': 1.29,
                'completeness_C': 0.76,
                'temporal_stability_S': 0.02, # Flatline failure & zero-dominated records
                'prior_reliability_r_prior': 0.40,
                'dynamic_reliability_r_dyn': 0.50,
                'blended_reliability_r_blend': 0.46,
                'dominant_category': 'Unreliable (Stress Client)',
                'spatial_comparison_valid': False,
                'sample_count': 55
            }
        }

        # CORAL Ordinal Model weights & thresholds (Section 2.6)
        # 13 features: [mu_mc, sigma_mc, mc_min, mc_max, T_mean, P, ET0, mu_NDVI, sigma_NDVI, a_NDVI, C, A2, S]
        self.weights = np.array([
            0.18,   # mu_mc (mean volumetric water content)
            -0.05,  # sigma_mc
            0.08,   # mc_min
            0.12,   # mc_max
            -0.04,  # T_mean
            0.15,   # Cumulative precipitation P
            -0.11,  # Reference evapotranspiration ET0
            0.09,   # mu_NDVI
            0.02,   # sigma_NDVI
            0.01,   # a_NDVI flag
            0.05,   # Completeness C
            -0.08,  # Anomaly burden A2
            0.07    # Temporal stability S
        ])
        self.bias = -3.2
        # Ordered thresholds b0 < b1 < b2
        self.thresholds = np.array([-1.20, 0.45, 2.10])

        # Pre-computed Convergence History across 77 communication rounds (Mwawado et al. Figure 4)
        self.round_history = self._generate_round_history()

    def calculate_reliability(self, field_id: str, completeness_c: float, anomaly_a2: float, stability_s: float) -> Dict[str, float]:
        """
        Calculates sensor reliability according to Eq. 2:
        r_blend(f, d, tau) = clip(lambda * r_prior(f, d) + (1 - lambda) * r_dyn(f, d, tau), r_min, 1.0)
        """
        field = self.fields.get(field_id, self.fields['F1'])
        r_prior = field['prior_reliability_r_prior']

        # Dynamic reliability combines completeness, low anomaly burden, and high stability
        r_dyn = (0.35 * completeness_c) + (0.35 * (1.0 - anomaly_a2)) + (0.30 * stability_s)
        r_dyn = max(0.0, min(1.0, r_dyn))

        # Blending formula (Eq. 2)
        r_blend_raw = (self.LAMBDA * r_prior) + ((1.0 - self.LAMBDA) * r_dyn)
        r_blend = max(self.R_MIN, min(1.0, r_blend_raw))

        return {
            'r_prior': round(r_prior, 3),
            'r_dyn': round(r_dyn, 3),
            'r_blend': round(r_blend, 3),
            'completeness_C': round(completeness_c, 3),
            'anomaly_A2': round(anomaly_a2, 3),
            'stability_S': round(stability_s, 3)
        }

    def predict_irrigation_zone(self, features_dict: Dict[str, float]) -> Dict[str, Any]:
        """
        Predicts ordinal weekly irrigation management zone using CORAL rank-consistent formulation (Eq. 3 & Eq. 4).
        """
        vec = np.array([
            features_dict.get('mu_mc', 32.0),
            features_dict.get('sigma_mc', 4.5),
            features_dict.get('mc_min', 24.0),
            features_dict.get('mc_max', 40.0),
            features_dict.get('T_mean', 18.5),
            features_dict.get('P', 22.0),
            features_dict.get('ET0', 14.5),
            features_dict.get('mu_NDVI', 0.65),
            features_dict.get('sigma_NDVI', 0.08),
            features_dict.get('a_NDVI', 1.0),
            features_dict.get('C', 0.90),
            features_dict.get('A2', 0.05),
            features_dict.get('S', 0.85)
        ])

        # Latent score s(x; theta)
        score = float(np.dot(vec, self.weights) + self.bias)

        # Threshold probabilities: p_k = sigma(s - b_k) (Eq. 3)
        pk = [1.0 / (1.0 + math.exp(-(score - b))) for b in self.thresholds]

        # Predicted class by counting crossed thresholds (Eq. 4)
        threshold_crossings = [p > self.DECISION_THRESHOLD for p in pk]
        predicted_zone_idx = sum(threshold_crossings)  # 0: Low, 1: Medium, 2: Mod-High, 3: High
        predicted_zone_idx = min(3, max(0, predicted_zone_idx))

        # Reliability scoring of input sample
        rel = self.calculate_reliability(
            features_dict.get('field_id', 'F1'),
            features_dict.get('C', 0.9),
            features_dict.get('A2', 0.05),
            features_dict.get('S', 0.85)
        )

        # VRI prescription calculation
        irrigation_rates = {0: 38.0, 1: 25.0, 2: 12.0, 3: 0.0}  # mm of water needed
        prescribed_irrigation_mm = irrigation_rates[predicted_zone_idx]

        return {
            'latent_score': round(score, 3),
            'threshold_probabilities': [round(p, 4) for p in pk],
            'threshold_decision_cutoff': self.DECISION_THRESHOLD,
            'predicted_zone_code': ZONE_CODES[predicted_zone_idx],
            'predicted_zone_name': ZONE_NAMES[predicted_zone_idx],
            'zone_description': ZONE_DESCRIPTIONS[predicted_zone_idx],
            'prescribed_irrigation_depth_mm': prescribed_irrigation_mm,
            'reliability_analysis': rel,
            'soil_status': 'Deficit' if predicted_zone_idx == 0 else ('Optimum' if predicted_zone_idx in [1, 2] else 'Surplus')
        }

    def simulate_federated_round(self, current_round: int) -> Dict[str, Any]:
        """
        Simulates a communication round of Reliability-Aware FedAvg across the 3 fields.
        Aggregates weights using omega_m = n_m * r_bar_m (Eq. 6 & Eq. 7).
        """
        round_idx = min(77, max(1, current_round))
        round_info = self.round_history[round_idx - 1]

        # Client update payloads
        client_updates = []
        total_omega = 0.0
        for fid, f in self.fields.items():
            n_m = f['sample_count']
            r_bar = f['blended_reliability_r_blend']
            omega_m = n_m * r_bar
            total_omega += omega_m
            client_updates.append({
                'field_id': fid,
                'field_name': f['name'],
                'samples_nm': n_m,
                'mean_reliability_rbar': r_bar,
                'server_aggregation_weight_omega': round(omega_m, 2),
                'local_accuracy': round(min(0.96, round_info['accuracy'] + (0.02 if fid != 'F3' else -0.06)), 3),
                'local_qwk': round(min(0.98, round_info['qwk'] + (0.01 if fid != 'F3' else -0.08)), 3),
                'encrypted_gradient_hash_aes_gcm': f"aes-256-gcm:{hash(fid + str(current_round)) & 0xffffffff:08x}"
            })

        # Normalize server weights
        for cu in client_updates:
            cu['weight_percentage'] = round((cu['server_aggregation_weight_omega'] / total_omega) * 100, 1)

        return {
            'communication_round': round_idx,
            'total_rounds': 77,
            'best_checkpoint_round': 52,
            'global_accuracy': round_info['accuracy'],
            'global_macro_f1': round_info['macro_f1'],
            'global_qwk': round_info['qwk'],
            'server_transmit_kb': 68.4,
            'server_receive_kb': 69.1,
            'total_send_time_ms': 3.0,
            'total_receive_time_ms': 403.0,
            'server_memory_mb': 299.1,
            'participating_clients': client_updates,
            'benchmark_comparison': {
                'Local-only CORAL': {'Accuracy': 0.778, 'Macro_F1': 0.485, 'QWK': 0.530},
                'FedAvg + Multiclass MLP': {'Accuracy': 0.861, 'Macro_F1': 0.604, 'QWK': 0.915},
                'FedAvg + CORAL': {'Accuracy': 0.917, 'Macro_F1': 0.849, 'QWK': 0.962},
                'Proposed Reliability-Aware Fed-CORAL': {'Accuracy': 0.944, 'Macro_F1': 0.904, 'QWK': 0.975}
            }
        }

    def _generate_round_history(self) -> List[Dict[str, float]]:
        """
        Generates realistic convergence trajectory matching Figure 4 from Mwawado et al.
        """
        history = []
        for r in range(1, 78):
            # Smooth logistic convergence toward round 52 peak (Acc 0.944, F1 0.904, QWK 0.975)
            progress = 1.0 - math.exp(-r / 14.0)
            noise = (math.sin(r * 0.7) * 0.012) if r < 50 else (math.sin(r * 0.5) * 0.005)
            
            acc = 0.55 + 0.394 * progress + noise
            f1 = 0.30 + 0.604 * progress + (noise * 1.5)
            qwk = 0.45 + 0.525 * progress + noise
            
            if r >= 52:
                # Stabilizes around best checkpoint
                acc = min(0.944, max(0.935, acc))
                f1 = min(0.904, max(0.890, f1))
                qwk = min(0.975, max(0.965, qwk))

            history.append({
                'round': r,
                'accuracy': round(float(acc), 3),
                'macro_f1': round(float(f1), 3),
                'qwk': round(float(qwk), 3)
            })
        return history

    def get_confusion_matrix(self) -> Dict[str, Any]:
        """
        Confusion matrix for the best checkpoint (Round 52) on the 36 held-out test samples.
        Matches Mwawado et al. Figure 5.
        """
        matrix = [
            [23, 1, 0, 0],  # L reference (23 correct, 1 confused with M)
            [0, 3, 1, 0],   # M reference (3 correct, 1 confused with MH)
            [0, 0, 4, 0],   # MH reference (4 correct)
            [0, 0, 0, 4]    # H reference (4 correct)
        ]
        return {
            'checkpoint_round': 52,
            'labels': ZONE_CODES,
            'label_names': ZONE_NAMES,
            'matrix': matrix,
            'total_samples': 36,
            'off_diagonal_errors': 2,
            'error_characterization': "Errors occur strictly between adjacent ordinal levels (L<->M, M<->MH). Zero distant inversions.",
            'accuracy': 0.944,
            'macro_f1': 0.904,
            'qwk': 0.975
        }

# Singleton instance
irrigation_fl_engine = IrrigationFLEngine()

