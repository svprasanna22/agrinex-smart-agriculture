"""
Fertilizer Recommendation & Soil Deficit Analyzer
Supported by:
- S. M. Venkateswara and J. Padmanaban (2025), "Interpretable deep learning models for independent fertilizer
  and crop recommendation", Scientific Reports 15: 41721.
- Indian Council of Agricultural Research (ICAR) & FAO Soil Nutrient Guidelines.
"""

import os
import csv
from typing import Dict, List, Any, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "fertilizer.csv")

class FertilizerAnalyzer:
    def __init__(self):
        self.crop_standards: Dict[str, Dict[str, float]] = {}
        self.model_configured = False
        self.load_data()

    def load_data(self):
        if not os.path.exists(DATA_PATH):
            print(f"[WARN] Fertilizer data not found at {DATA_PATH}")
            self.model_configured = False
            return

        with open(DATA_PATH, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                crop = row['Crop'].strip().lower()
                self.crop_standards[crop] = {
                    'N': float(row['N']),
                    'P': float(row['P']),
                    'K': float(row['K']),
                    'pH': float(row['pH']),
                    'soil_moisture': float(row['soil_moisture'])
                }
        self.model_configured = True

    def recommend(
        self,
        crop: str,
        soil_type: str,
        soil_n: float,
        soil_p: float,
        soil_k: float,
        soil_moisture: float,
        soil_ph: float,
        temperature: Optional[float] = None,
        humidity: Optional[float] = None,
        previous_fertilizer: Optional[str] = None,
        crop_growth_stage: Optional[str] = None,
        farm_area_acres: float = 1.0
    ) -> Dict[str, Any]:
        """
        Farmer-Friendly Fertilizer Recommendation Engine:
        Analyzes stoichiometric N-P-K and pH deficits, applies soil texture and crop stage adjustments,
        and produces actionable dosage guidelines with SHAP-style feature importance.
        """
        crop_clean = crop.strip().lower()
        standards = self.crop_standards.get(crop_clean, {
            'N': 80.0, 'P': 40.0, 'K': 40.0, 'pH': 6.5, 'soil_moisture': 40.0
        })

        target_n = standards['N']
        target_p = standards['P']
        target_k = standards['K']
        ideal_ph = standards['pH']

        # Deficits in kg/hectare
        def_n = max(0.0, target_n - soil_n)
        def_p = max(0.0, target_p - soil_p)
        def_k = max(0.0, target_k - soil_k)

        # Soil texture leaching adjustment
        soil_clean = (soil_type or "Loamy").strip().lower()
        leach_factor_n = 1.0
        leach_factor_k = 1.0
        soil_desc = "Standard drainage and nutrient retention."
        if "sand" in soil_clean:
            leach_factor_n = 1.15
            leach_factor_k = 1.10
            soil_desc = "Sandy soils have rapid percolation and high nutrient leaching; split applications are essential."
        elif "clay" in soil_clean:
            leach_factor_n = 0.95
            leach_factor_k = 0.95
            soil_desc = "Clay soils retain nutrients effectively; avoid over-application to prevent salinity stress."
        elif "black" in soil_clean:
            leach_factor_n = 1.0
            leach_factor_k = 0.90
            soil_desc = "Black/Regur soils are rich in potash but typically benefit from targeted phosphorus and nitrogen supplementation."

        # Area conversion
        area_ha = max(0.1, farm_area_acres / 2.47105)

        # Fertilizer dosages (kg):
        # DAP: 46% P2O5, 18% N
        # Urea: 46% N
        # MOP: 60% K2O
        adj_def_p = def_p
        adj_def_n = def_n * leach_factor_n
        adj_def_k = def_k * leach_factor_k

        dap_kg = (adj_def_p / 0.46) * area_ha if adj_def_p > 0 else 0.0
        n_supplied_by_dap = dap_kg * 0.18 / area_ha if area_ha > 0 else 0.0
        remaining_n = max(0.0, adj_def_n - n_supplied_by_dap)
        urea_kg = (remaining_n / 0.46) * area_ha if remaining_n > 0 else 0.0
        mop_kg = (adj_def_k / 0.60) * area_ha if adj_def_k > 0 else 0.0

        # Primary fertilizer product recommendation
        if def_n > 30 and def_p > 20 and def_k > 20:
            recommended_primary = "DAP + Urea + MOP Balanced Triple Formulation"
            primary_reason = f"Soil has broad N-P-K depletion. Applying DAP as a basal starter provides critical phosphorus for root growth, while Urea and MOP restore vegetative vigor and crop resilience."
        elif def_n > 25 and def_p > 15:
            recommended_primary = "Urea + Di-Ammonium Phosphate (DAP)"
            primary_reason = f"High nitrogen deficit ({round(def_n, 1)} kg/ha) and phosphorus deficit ({round(def_p, 1)} kg/ha). DAP satisfies early root phosphorus needs, and Urea covers foliar nitrogen demands."
        elif def_n > 25:
            recommended_primary = "Neem-Coated Urea"
            primary_reason = f"Nitrogen is the primary limiting nutrient (current: {soil_n} vs required: {target_n} kg/ha). Neem coating prevents volatilization and leaching."
        elif def_p > 15:
            recommended_primary = "Single Super Phosphate (SSP) or DAP"
            primary_reason = f"Phosphorus is deficient (current: {soil_p} vs required: {target_p} kg/ha). Crucial for early root establishment and seed development."
        elif def_k > 15:
            recommended_primary = "Muriate of Potash (MOP / Potassium Chloride)"
            primary_reason = f"Potassium deficit ({round(def_k, 1)} kg/ha). Potash enhances drought resistance, disease resistance, and fruit/grain quality."
        else:
            recommended_primary = "Organic Compost / Farmyard Manure Maintenance Dose"
            primary_reason = f"Soil nutrients are closely aligned with optimal {crop.title()} requirements. Maintain soil organic matter with well-rotted manure (FYM)."

        # Nutrient deficiencies categorization
        deficiencies = []
        if def_n > 40:
            deficiencies.append({'nutrient': 'Nitrogen (N)', 'deficit_kg_ha': round(def_n, 1), 'severity': 'High Deficit', 'impact': 'Stunted growth, pale yellowing of older leaves, reduced tillering.'})
        elif def_n > 10:
            deficiencies.append({'nutrient': 'Nitrogen (N)', 'deficit_kg_ha': round(def_n, 1), 'severity': 'Moderate Deficit', 'impact': 'Suboptimal vegetative growth and biomass accumulation.'})

        if def_p > 25:
            deficiencies.append({'nutrient': 'Phosphorus (P)', 'deficit_kg_ha': round(def_p, 1), 'severity': 'High Deficit', 'impact': 'Poor root branching, purplish foliage discoloration, delayed maturity.'})
        elif def_p > 8:
            deficiencies.append({'nutrient': 'Phosphorus (P)', 'deficit_kg_ha': round(def_p, 1), 'severity': 'Moderate Deficit', 'impact': 'Slow seedling emergence and reduced flowering.'})

        if def_k > 30:
            deficiencies.append({'nutrient': 'Potassium (K)', 'deficit_kg_ha': round(def_k, 1), 'severity': 'High Deficit', 'impact': 'Marginal leaf scorch, weak stems, susceptibility to lodging and drought.'})
        elif def_k > 10:
            deficiencies.append({'nutrient': 'Potassium (K)', 'deficit_kg_ha': round(def_k, 1), 'severity': 'Moderate Deficit', 'impact': 'Reduced grain filling and compromised disease resistance.'})

        if not deficiencies:
            deficiencies.append({'nutrient': 'Overall NPK', 'deficit_kg_ha': 0.0, 'severity': 'Adequate', 'impact': 'Nutrients are currently sufficient for normal growth.'})

        # pH status and amendment
        ph_status = "Optimal"
        ph_remedy = "Soil pH is in the favorable agronomic zone (6.0 - 7.2)."
        if soil_ph < 5.8:
            ph_status = "Acidic (Low pH)"
            lime_kg = round(250.0 * (6.5 - soil_ph) * area_ha, 1)
            ph_remedy = f"Apply ~{lime_kg} kg Agricultural Limestone (CaCO3) 2-3 weeks before sowing to neutralize soil acidity and unlock phosphorus availability."
        elif soil_ph > 7.6:
            ph_status = "Alkaline / Saline (High pH)"
            gypsum_kg = round(180.0 * (soil_ph - 7.0) * area_ha, 1)
            ph_remedy = f"Apply ~{gypsum_kg} kg Agricultural Gypsum (CaSO4) or Elemental Sulfur to displace excess sodium and lower root-zone pH."

        # SHAP-like feature attribution for fertilizer dosage
        total_shap_weight = max(1.0, def_n + def_p + def_k + abs(soil_ph - ideal_ph) * 15.0 + abs(soil_moisture - 40.0) * 0.5)
        shap_explanation = [
            {'feature': 'Nitrogen Deficit (N)', 'contribution_pct': round((def_n / total_shap_weight) * 100, 1), 'impact': 'Drives Urea recommendation'},
            {'feature': 'Phosphorus Deficit (P)', 'contribution_pct': round((def_p / total_shap_weight) * 100, 1), 'impact': 'Drives DAP / SSP dosage'},
            {'feature': 'Potassium Deficit (K)', 'contribution_pct': round((def_k / total_shap_weight) * 100, 1), 'impact': 'Drives MOP potash dosage'},
            {'feature': 'Soil pH Divergence', 'contribution_pct': round(((abs(soil_ph - ideal_ph) * 15.0) / total_shap_weight) * 100, 1), 'impact': 'Determines nutrient uptake efficiency'},
            {'feature': 'Soil Texture & Moisture', 'contribution_pct': round(((abs(soil_moisture - 40.0) * 0.5) / total_shap_weight) * 100, 1), 'impact': 'Influences leaching and split schedule'}
        ]
        shap_explanation.sort(key=lambda x: x['contribution_pct'], reverse=True)

        # Growth stage split recommendations
        stage = (crop_growth_stage or "Basal / Sowing").strip()
        application_guidance = [
            {
                'step': 1,
                'stage': 'Basal Dressing (At Sowing / Transplanting)',
                'action': f"Apply 100% of DAP ({round(dap_kg, 1)} kg), 50% of MOP ({round(mop_kg * 0.5, 1)} kg), and 33% of Urea ({round(urea_kg * 0.33, 1)} kg).",
                'notes': 'Broadcast and till into top 10-15 cm of soil before seed placement.'
            },
            {
                'step': 2,
                'stage': 'First Top-Dressing (Vegetative / Tillering, Day 25-30)',
                'action': f"Apply 34% of Urea ({round(urea_kg * 0.34, 1)} kg) as side-dressing along crop rows.",
                'notes': 'Apply when soil is moist or immediately follow with light irrigation.'
            },
            {
                'step': 3,
                'stage': 'Second Top-Dressing (Panicle Initiation / Flowering, Day 50-60)',
                'action': f"Apply remaining 33% of Urea ({round(urea_kg * 0.33, 1)} kg) and remaining 50% of MOP ({round(mop_kg * 0.5, 1)} kg).",
                'notes': 'Prevents late-stage flag leaf senescence and optimizes grain filling.'
            }
        ]

        return {
            'status': 'success',
            'crop': crop.title(),
            'soil_type': soil_type.title() if soil_type else 'Loamy',
            'farm_area_acres': farm_area_acres,
            'farm_area_hectares': round(area_ha, 2),
            'recommended_fertilizer': recommended_primary,
            'primary_reason': primary_reason,
            'soil_characteristics': soil_desc,
            'nutrient_analysis': {
                'nitrogen': {'current': soil_n, 'target': target_n, 'deficit': round(def_n, 1), 'unit': 'kg/ha'},
                'phosphorus': {'current': soil_p, 'target': target_p, 'deficit': round(def_p, 1), 'unit': 'kg/ha'},
                'potassium': {'current': soil_k, 'target': target_k, 'deficit': round(def_k, 1), 'unit': 'kg/ha'},
                'ph': {'current': soil_ph, 'ideal': ideal_ph, 'status': ph_status, 'remedy': ph_remedy},
                'moisture': {'current': soil_moisture, 'optimal': standards.get('soil_moisture', 40.0), 'unit': '%'}
            },
            'deficiencies': deficiencies,
            'fertilizer_dosages': {
                'urea': {'total_kg': round(urea_kg, 1), 'bags_50kg': round(urea_kg / 50.0, 1)},
                'dap': {'total_kg': round(dap_kg, 1), 'bags_50kg': round(dap_kg / 50.0, 1)},
                'mop': {'total_kg': round(mop_kg, 1), 'bags_50kg': round(mop_kg / 50.0, 1)}
            },
            'application_guidance': application_guidance,
            'shap_explanation': shap_explanation
        }

    def analyze_deficit(self, crop: str, soil_n: float, soil_p: float, soil_k: float, soil_ph: float, farm_area_acres: float = 1.0) -> Dict[str, Any]:
        """Legacy compatibility wrapper for existing tabs"""
        res = self.recommend(
            crop=crop,
            soil_type='Loamy',
            soil_n=soil_n,
            soil_p=soil_p,
            soil_k=soil_k,
            soil_moisture=40.0,
            soil_ph=soil_ph,
            farm_area_acres=farm_area_acres
        )
        return {
            'crop': res['crop'].lower(),
            'farm_area_acres': farm_area_acres,
            'nutrient_status': {
                'nitrogen': {'current': soil_n, 'target': res['nutrient_analysis']['nitrogen']['target'], 'deficit': res['nutrient_analysis']['nitrogen']['deficit'], 'status': 'Deficient' if res['nutrient_analysis']['nitrogen']['deficit'] > 0 else 'Adequate'},
                'phosphorus': {'current': soil_p, 'target': res['nutrient_analysis']['phosphorus']['target'], 'deficit': res['nutrient_analysis']['phosphorus']['deficit'], 'status': 'Deficient' if res['nutrient_analysis']['phosphorus']['deficit'] > 0 else 'Adequate'},
                'potassium': {'current': soil_k, 'target': res['nutrient_analysis']['potassium']['target'], 'deficit': res['nutrient_analysis']['potassium']['deficit'], 'status': 'Deficient' if res['nutrient_analysis']['potassium']['deficit'] > 0 else 'Adequate'},
                'ph': {'current': soil_ph, 'ideal': res['nutrient_analysis']['ph']['ideal'], 'status': res['nutrient_analysis']['ph']['status'], 'remedy': res['nutrient_analysis']['ph']['remedy']}
            },
            'fertilizer_dosages': {
                'urea_50kg_bags': res['fertilizer_dosages']['urea']['bags_50kg'],
                'urea_total_kg': res['fertilizer_dosages']['urea']['total_kg'],
                'dap_50kg_bags': res['fertilizer_dosages']['dap']['bags_50kg'],
                'dap_total_kg': res['fertilizer_dosages']['dap']['total_kg'],
                'mop_50kg_bags': res['fertilizer_dosages']['mop']['bags_50kg'],
                'mop_total_kg': res['fertilizer_dosages']['mop']['total_kg']
            },
            'application_schedule': [
                {
                    'stage': g['stage'],
                    'urea_kg': round(res['fertilizer_dosages']['urea']['total_kg'] * 0.33, 1),
                    'dap_kg': res['fertilizer_dosages']['dap']['total_kg'] if g['step'] == 1 else 0.0,
                    'mop_kg': round(res['fertilizer_dosages']['mop']['total_kg'] * 0.5, 1) if g['step'] != 2 else 0.0,
                    'guidance': g['notes']
                } for g in res['application_guidance']
            ]
        }

# Singleton instance
fertilizer_analyzer = FertilizerAnalyzer()


