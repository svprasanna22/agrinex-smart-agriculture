"""
FastAPI Backend Server
Hybrid AI Framework for Smart Agriculture Using Explainable AI, Federated Learning, and Edge Computing
"""

import os
from typing import Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.crop_recommender import crop_recommender, FEATURE_NAMES
from app.xai_engine import xai_engine
from app.irrigation_fl_engine import irrigation_fl_engine
from app.fertilizer_analyzer import fertilizer_analyzer
from app.crop_yield_engine import crop_yield_engine
from app.field_health_cv import field_health_cv_engine
from app.disease_classifier import disease_classifier

app = FastAPI(
    title="Hybrid AI Framework for Smart Agriculture",
    description="Research-backed decision support system combining Explainable AI, Federated Learning, and Edge Computing",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class CropPredictionRequest(BaseModel):
    N: float = 90.0
    P: float = 42.0
    K: float = 43.0
    temperature: float = 20.88
    humidity: float = 82.00
    ph: float = 6.50
    rainfall: float = 202.94
    model_type: str = "Random Forest (RF)"

class CounterfactualRequest(BaseModel):
    N: float = 44.0
    P: float = 60.0
    K: float = 55.0
    temperature: float = 34.28
    humidity: float = 90.56
    ph: float = 6.83
    rainfall: float = 98.54
    target_crops: Optional[list] = None

class UtilityTradeoffRequest(BaseModel):
    accuracy: float = 0.944
    interpretability: float = 0.910
    cost: float = 0.150
    alpha_t: float = 0.50

class IrrigationZoneRequest(BaseModel):
    field_id: str = "F1"
    mu_mc: float = 34.5
    sigma_mc: float = 4.2
    mc_min: float = 26.0
    mc_max: float = 42.0
    T_mean: float = 19.5
    P: float = 18.0
    ET0: float = 15.2
    mu_NDVI: float = 0.68
    sigma_NDVI: float = 0.07
    a_NDVI: float = 1.0
    C: float = 0.85
    A2: float = 0.04
    S: float = 0.92

class FertilizerRequest(BaseModel):
    crop: str = "rice"
    soil_n: float = 45.0
    soil_p: float = 25.0
    soil_k: float = 20.0
    soil_ph: float = 6.4
    farm_area_acres: float = 2.5

class FertilizerRecommendationRequest(BaseModel):
    crop_name: str = "rice"
    soil_type: str = "Loamy"
    nitrogen: float = 45.0
    phosphorus: float = 25.0
    potassium: float = 20.0
    soil_moisture: float = 35.0
    soil_ph: float = 6.4
    temperature: Optional[float] = 25.0
    humidity: Optional[float] = 70.0
    previous_fertilizer: Optional[str] = "None / FYM"
    crop_growth_stage: Optional[str] = "Basal / Sowing"
    farm_area_acres: float = 1.0

class YieldRequest(BaseModel):
    crop: str = "rice"
    area_acres: float = 5.0
    soil_n: float = 75.0
    soil_p: float = 35.0
    soil_k: float = 38.0
    soil_moisture: float = 42.0
    rainfall_mm: float = 180.0
    avg_temp_c: float = 24.5
    ndvi: float = 0.69

class YieldPredictionRequest(BaseModel):
    crop_type: str = "Rice"
    cultivated_area: float = 2.5
    area_unit: str = "acre"
    season: str = "Kharif"
    soil_type: str = "Loamy"
    rainfall: Optional[float] = 180.0
    temperature: Optional[float] = 24.5
    humidity: Optional[float] = 75.0
    irrigation_availability: Optional[str] = "Canal / Tube Well"
    nitrogen: Optional[float] = 80.0
    phosphorus: Optional[float] = 40.0
    potassium: Optional[float] = 40.0

class DiseaseExplainRequest(BaseModel):
    crop_name: str = "Tomato"
    disease_name: str = "Early Blight"
    image_base64: Optional[str] = None

class ImageUploadRequest(BaseModel):
    image_base64: str

# Endpoints

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "title": "Hybrid AI Framework for Smart Agriculture Using Explainable AI, Federated Learning, and Edge Computing",
        "authors": "VIJAY PRASANNA S, SAKTHI SRIRAM S, NALIN NAIK M, Senthil Kumar Thangavel",
        "institution": "AgriNex Agriculture Research Initiative",
        "edge_nodes_active": 3,
        "database": "None (Fully In-Memory & File-Based Architecture)",
        "fl_aggregation": "Reliability-Weighted FedAvg (omega = n_m * r_bar_m)",
        "security": "AES-256-GCM Encrypted Updates"
    }

@app.post("/api/crops/predict")
def predict_crop(req: CropPredictionRequest):
    sample = {
        'N': req.N, 'P': req.P, 'K': req.K,
        'temperature': req.temperature, 'humidity': req.humidity,
        'ph': req.ph, 'rainfall': req.rainfall
    }
    return crop_recommender.predict(sample, model_type=req.model_type)

@app.post("/api/crops/counterfactuals")
def generate_counterfactuals(req: CounterfactualRequest):
    sample = {
        'N': req.N, 'P': req.P, 'K': req.K,
        'temperature': req.temperature, 'humidity': req.humidity,
        'ph': req.ph, 'rainfall': req.rainfall
    }
    return {
        'actual_sample': sample,
        'counterfactuals': crop_recommender.generate_counterfactuals(sample, req.target_crops)
    }

@app.post("/api/xai/shap")
def get_shap_explanation(req: CropPredictionRequest):
    sample = {
        'N': req.N, 'P': req.P, 'K': req.K,
        'temperature': req.temperature, 'humidity': req.humidity,
        'ph': req.ph, 'rainfall': req.rainfall
    }
    return xai_engine.explain_instance_shap(sample)

@app.post("/api/xai/lime")
def get_lime_explanation(req: CropPredictionRequest):
    sample = {
        'N': req.N, 'P': req.P, 'K': req.K,
        'temperature': req.temperature, 'humidity': req.humidity,
        'ph': req.ph, 'rainfall': req.rainfall
    }
    return xai_engine.explain_instance_lime(sample)

@app.post("/api/xai/eli5")
def get_eli5_explanation(req: CropPredictionRequest):
    sample = {
        'N': req.N, 'P': req.P, 'K': req.K,
        'temperature': req.temperature, 'humidity': req.humidity,
        'ph': req.ph, 'rainfall': req.rainfall
    }
    return xai_engine.explain_eli5(sample)

@app.post("/api/xai/utility")
def calculate_utility(req: UtilityTradeoffRequest):
    return xai_engine.calculate_utility_metric(
        accuracy=req.accuracy,
        interpretability=req.interpretability,
        cost=req.cost,
        alpha_t=req.alpha_t
    )

@app.get("/api/xai/radar")
def get_cross_modal_radar(crop: str = "rice"):
    return xai_engine.get_cross_modal_radar(crop)

@app.post("/api/irrigation/predict")
def predict_irrigation_zone(req: IrrigationZoneRequest):
    return irrigation_fl_engine.predict_irrigation_zone(req.model_dump())

@app.get("/api/federated/round")
def get_federated_round(round_number: int = 52):
    return irrigation_fl_engine.simulate_federated_round(round_number)

@app.get("/api/federated/confusion-matrix")
def get_federated_confusion_matrix():
    return irrigation_fl_engine.get_confusion_matrix()

@app.get("/api/federated/fields")
def get_field_nodes():
    return irrigation_fl_engine.fields

@app.get("/api/model/status")
def get_model_status():
    """
    Returns the real loading status and metadata of all agricultural AI models.
    """
    return {
        "status": "online",
        "models": {
            "disease_classifier": {
                "name": "MobileNetV3 Large (PlantVillage)",
                "classes": 39,
                "configured": disease_classifier.model_available,
                "framework": "PyTorch 2.15 (CPU)",
                "checkpoint": "backend/models/plant_village.pth",
                "explainability": "Grad-CAM Activation Heatmaps (model.features[-1])"
            },
            "crop_recommender": {
                "name": "AgroXAI Random Forest Classifier",
                "classes": len(crop_recommender.crops),
                "configured": len(crop_recommender.crops) > 0,
                "benchmark_accuracy": "99.24%",
                "dataset": "crop_recommendation.csv (2,200 rows)",
                "explainability": "SHAP TreeExplainer & LIME Tabular Explainer"
            },
            "fertilizer_recommender": {
                "name": "Stoichiometric & Soil Leaching Recommendation Engine",
                "configured": fertilizer_analyzer.model_configured,
                "dataset": "fertilizer.csv & ICAR/FAO Soil Nutrient Guidelines",
                "explainability": "SHAP Nutrient Deficit Attribution"
            },
            "yield_predictor": {
                "name": "Agro-Climate Multi-Factor Yield Estimator",
                "configured": crop_yield_engine.model_configured,
                "methodology": "Climate & Soil Multiplier Regression (Koksal et al. 2026)",
                "explainability": "Agronomic Factor Influence Attribution"
            },
            "federated_irrigation": {
                "name": "Decentralized Reliability-Weighted CORAL Ordinal Regressor",
                "configured": True,
                "qwk": 0.975,
                "rounds_converged": 52
            }
        }
    }

@app.post("/api/fertilizer/analyze")
def analyze_fertilizer(req: FertilizerRequest):
    return fertilizer_analyzer.analyze_deficit(
        crop=req.crop,
        soil_n=req.soil_n,
        soil_p=req.soil_p,
        soil_k=req.soil_k,
        soil_ph=req.soil_ph,
        farm_area_acres=req.farm_area_acres
    )

@app.post("/api/fertilizer/recommend")
def recommend_fertilizer(req: FertilizerRecommendationRequest):
    """
    Primary Farmer Fertilizer Recommendation Endpoint:
    Provides specific NPK dosages, soil texture leaching corrections,
    lime/gypsum pH amendments, 3-stage application schedule, and SHAP attribution.
    """
    return fertilizer_analyzer.recommend(
        crop=req.crop_name,
        soil_type=req.soil_type,
        soil_n=req.nitrogen,
        soil_p=req.phosphorus,
        soil_k=req.potassium,
        soil_moisture=req.soil_moisture,
        soil_ph=req.soil_ph,
        temperature=req.temperature,
        humidity=req.humidity,
        previous_fertilizer=req.previous_fertilizer,
        crop_growth_stage=req.crop_growth_stage,
        farm_area_acres=req.farm_area_acres
    )

@app.post("/api/yield/predict")
def predict_yield_endpoint(req: YieldPredictionRequest):
    """
    Primary Farmer Crop Yield Prediction Endpoint:
    Calculates estimated yield per hectare and total harvest,
    with contributing agronomic factor breakdown and SHAP feature influence.
    """
    return crop_yield_engine.predict_farmer_yield(
        crop_type=req.crop_type,
        cultivated_area=req.cultivated_area,
        area_unit=req.area_unit,
        season=req.season,
        soil_type=req.soil_type,
        rainfall=req.rainfall,
        temperature=req.temperature,
        humidity=req.humidity,
        irrigation_availability=req.irrigation_availability,
        nitrogen=req.nitrogen,
        phosphorus=req.phosphorus,
        potassium=req.potassium
    )

@app.get("/api/vision/list")
def list_vision_images():
    return field_health_cv_engine.get_available_images()

@app.get("/api/vision/analyze")
def analyze_vision_image(filename: Optional[str] = None):
    return field_health_cv_engine.analyze_image(filename=filename)

@app.post("/api/disease/predict")
async def disease_predict(file: UploadFile = File(...)):
    """
    Standardized Disease Prediction Endpoint (alias for /api/crop/diagnose)
    """
    return await diagnose_crop_file(file)

@app.post("/api/disease/explain")
def disease_explain(req: DiseaseExplainRequest):
    """
    Pathological and explainability details for diagnosed plant condition
    """
    from app.disease_classifier import DISEASE_INFO
    clean_name = req.disease_name.replace(' ', '_')
    meta = DISEASE_INFO.get(clean_name, {
        'name': req.disease_name,
        'description': f'A foliar condition affecting {req.crop_name} crops, characterized by leaf discoloration or spots.',
        'recommendations': [
            'Inspect crops frequently to detect early symptoms.',
            'Ensure adequate plant spacing to allow canopy air circulation.',
            'Avoid excessive surface moisture and overhead irrigation.'
        ]
    })
    return {
        'status': 'success',
        'crop_name': req.crop_name,
        'disease_name': meta['name'],
        'description': meta['description'],
        'recommendations': meta['recommendations'],
        'explainability_method': 'PyTorch Grad-CAM with Class-Selective Feature Attribution'
    }

@app.post("/api/crop/diagnose")
async def diagnose_crop_file(file: UploadFile = File(...)):
    """
    Main Farmer Crop Disease Diagnostic Endpoint:
    Accepts real multipart/form-data image file (JPG, PNG, WEBP),
    runs MobileNetV3 inference, returns disease status, management recommendations,
    and Grad-CAM heatmap.
    """
    import io
    import base64
    from PIL import Image
    from fastapi import HTTPException

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a crop photograph (JPG, PNG, or WEBP).")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(contents) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum limit of 15MB.")

    try:
        image = Image.open(io.BytesIO(contents)).convert('RGB')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not decode image file: {str(e)}")

    res = disease_classifier.predict(image)

    # Attach base64 representation of the uploaded image for clean display
    buf = io.BytesIO()
    # Downscale for compact JSON transport
    w, h = image.size
    preview_size = (480, int(480 * (h / w)))
    image.resize(preview_size, Image.Resampling.BILINEAR).save(buf, format="JPEG", quality=85)
    res['uploaded_image_base64'] = f"data:image/jpeg;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"
    return res

@app.post("/api/crop/diagnose-base64")
def diagnose_crop_base64(req: ImageUploadRequest):
    import io
    import base64
    from PIL import Image
    from fastapi import HTTPException

    raw = req.image_base64
    if "," in raw:
        raw = raw.split(",")[1]
    try:
        image_bytes = base64.b64decode(raw)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not decode base64 image: {str(e)}")

    res = disease_classifier.predict(image)
    res['uploaded_image_base64'] = req.image_base64 if req.image_base64.startswith("data:") else f"data:image/jpeg;base64,{raw}"
    return res

@app.post("/api/vision/analyze-base64")
def analyze_vision_base64(req: ImageUploadRequest):
    import base64
    raw = req.image_base64
    if "," in raw:
        raw = raw.split(",")[1]
    image_bytes = base64.b64decode(raw)
    return field_health_cv_engine.analyze_image(image_bytes=image_bytes)

@app.post("/api/vision/upload")
async def upload_vision_image(file: UploadFile = File(...)):
    contents = await file.read()
    return field_health_cv_engine.analyze_image(image_bytes=contents)
