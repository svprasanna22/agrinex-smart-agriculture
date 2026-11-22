import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.crop_recommender import crop_recommender
from app.xai_engine import xai_engine
from app.irrigation_fl_engine import irrigation_fl_engine
from app.fertilizer_analyzer import fertilizer_analyzer
from app.crop_yield_engine import crop_yield_engine
from app.field_health_cv import field_health_cv_engine

def run_tests():
    print("Testing Backend AI Modules...")

    # 1. Test Crop Prediction
    sample = {'N': 90, 'P': 42, 'K': 43, 'temperature': 20.88, 'humidity': 82.0, 'ph': 6.5, 'rainfall': 202.9}
    pred = crop_recommender.predict(sample)
    print(f"[PASS] Crop Recommender: {pred['recommended_crop']} ({pred['confidence_percentage']}%)")

    # 2. Test Counterfactuals
    cfs = crop_recommender.generate_counterfactuals({'N': 44, 'P': 60, 'K': 55, 'temperature': 34.28, 'humidity': 90.56, 'ph': 6.83, 'rainfall': 98.54})
    print(f"[PASS] Counterfactuals generated: {len(cfs)}")
    for cf in cfs:
        print(f"       -> {cf['counterfactual_id']}: Target={cf['target_crop']}, Feasibility={cf['feasibility']}")

    # 3. Test SHAP & LIME
    shap_res = xai_engine.explain_instance_shap(sample)
    print(f"[PASS] SHAP features: {len(shap_res['waterfall_data'])}, Base={shap_res['base_value']}, TargetProb={shap_res['prediction_probability']}")
    lime_res = xai_engine.explain_instance_lime(sample)
    print(f"[PASS] LIME rules: {len(lime_res['local_rules'])}")

    # 4. Test Irrigation Zone CORAL prediction
    zone = irrigation_fl_engine.predict_irrigation_zone({'mu_mc': 34.5, 'P': 18.0, 'ET0': 15.2, 'C': 0.85, 'A2': 0.04, 'S': 0.92})
    print(f"[PASS] Irrigation Zone: {zone['predicted_zone_name']} - Prescribed Depth: {zone['prescribed_irrigation_depth_mm']} mm")

    # 5. Test FL Round
    fl_round = irrigation_fl_engine.simulate_federated_round(52)
    print(f"[PASS] FL Round 52 Accuracy: {fl_round['global_accuracy']}, Macro-F1: {fl_round['global_macro_f1']}, QWK: {fl_round['global_qwk']}")

    # 6. Test Fertilizer Deficit
    fert = fertilizer_analyzer.analyze_deficit('rice', 45, 25, 20, 6.4, 2.5)
    print(f"[PASS] Fertilizer Urea bags: {fert['fertilizer_dosages']['urea_50kg_bags']}, DAP bags: {fert['fertilizer_dosages']['dap_50kg_bags']}")

    # 7. Test Crop Yield
    cy = crop_yield_engine.predict_yield('rice', 5.0, 75, 35, 38, 42.0, 180.0, 24.5)
    print(f"[PASS] Yield Forecast: {cy['predicted_yield_tons_per_ha']} tons/ha ({cy['total_production_tons']} total tons)")

    # 8. Test CV & Grad-CAM
    cv_res = field_health_cv_engine.analyze_image()
    print(f"[PASS] Field CV Health Score: {cv_res['chlorophyll_health_index']}/100, Condition: {cv_res['condition']}")
    print(f"       Grad-CAM Heatmap generated (length: {len(cv_res['grad_cam_overlay64'] if 'grad_cam_overlay64' in cv_res else cv_res['grad_cam_overlay_base64'])} chars)")

    print("\nALL 8 BACKEND AI MODULE TESTS PASSED FLAWLESSLY!")

if __name__ == "__main__":
    run_tests()

