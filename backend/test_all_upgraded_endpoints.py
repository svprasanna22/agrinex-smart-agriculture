"""
Verification script for all upgraded AgriNex API endpoints
"""
import io
import json
import urllib.request
from PIL import Image, ImageDraw

def test_health():
    print("\n--- 1. Testing GET /api/health ---")
    req = urllib.request.Request('http://127.0.0.1:8000/api/health')
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode())
        print(f"Status Code: {resp.status}, Database: {data.get('database')}")
        assert resp.status == 200

def test_model_status():
    print("\n--- 2. Testing GET /api/model/status ---")
    req = urllib.request.Request('http://127.0.0.1:8000/api/model/status')
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode())
        models = data.get('models', {})
        print(f"Loaded models count: {len(models)}")
        for k, v in models.items():
            print(f"  • {k}: {v.get('name')} (configured: {v.get('configured')})")
        assert resp.status == 200

def test_fertilizer_recommend():
    print("\n--- 3. Testing POST /api/fertilizer/recommend ---")
    payload = {
        "crop_name": "rice",
        "soil_type": "Sandy Loam",
        "nitrogen": 40.0,
        "phosphorus": 20.0,
        "potassium": 25.0,
        "soil_moisture": 35.0,
        "soil_ph": 6.2,
        "temperature": 27.0,
        "humidity": 75.0,
        "previous_fertilizer": "None / FYM",
        "crop_growth_stage": "Basal / Sowing",
        "farm_area_acres": 2.5
    }
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/fertilizer/recommend',
        data=body,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode())
        print(f"Recommended: {data.get('recommended_fertilizer')}")
        print(f"Reason: {data.get('primary_reason')[:90]}...")
        print(f"Urea: {data['fertilizer_dosages']['urea']['total_kg']} kg ({data['fertilizer_dosages']['urea']['bags_50kg']} bags)")
        print(f"DAP: {data['fertilizer_dosages']['dap']['total_kg']} kg ({data['fertilizer_dosages']['dap']['bags_50kg']} bags)")
        print(f"MOP: {data['fertilizer_dosages']['mop']['total_kg']} kg ({data['fertilizer_dosages']['mop']['bags_50kg']} bags)")
        print(f"SHAP features: {len(data.get('shap_explanation', []))}")
        assert resp.status == 200

def test_yield_predict():
    print("\n--- 4. Testing POST /api/yield/predict ---")
    payload = {
        "crop_type": "Rice",
        "cultivated_area": 3.0,
        "area_unit": "acre",
        "season": "Kharif",
        "soil_type": "Alluvial",
        "rainfall": 200.0,
        "temperature": 26.0,
        "humidity": 80.0,
        "irrigation_availability": "Drip Irrigation (High Efficiency)",
        "nitrogen": 85.0,
        "phosphorus": 45.0,
        "potassium": 42.0
    }
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/yield/predict',
        data=body,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode())
        print(f"Predicted Yield: {data.get('predicted_yield_tons_ha')} tonnes/ha ({data.get('predicted_yield_kg_ha')} kg/ha)")
        print(f"Total Farm Production: {data.get('total_production_tons')} tonnes ({data.get('total_production_quintals')} quintals)")
        print(f"Summary: {data.get('summary_explanation')[:90]}...")
        assert resp.status == 200

def test_disease_explain():
    print("\n--- 5. Testing POST /api/disease/explain ---")
    payload = {
        "crop_name": "Tomato",
        "disease_name": "Early Blight"
    }
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/disease/explain',
        data=body,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode())
        print(f"Disease: {data.get('disease_name')}")
        print(f"Description: {data.get('description')[:70]}...")
        print(f"Method: {data.get('explainability_method')}")
        assert resp.status == 200

def test_disease_predict_file():
    print("\n--- 6. Testing POST /api/disease/predict with image file ---")
    img = Image.new('RGB', (250, 250), color=(240, 240, 240))
    draw = ImageDraw.Draw(img)
    draw.ellipse([30, 30, 220, 220], fill=(34, 139, 34))
    draw.ellipse([70, 70, 100, 100], fill=(139, 69, 19))
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    image_bytes = buf.getvalue()
    
    boundary = '----AgriNexBoundaryTest'
    body = bytearray()
    body.extend(f'--{boundary}\r\n'.encode('utf-8'))
    body.extend(b'Content-Disposition: form-data; name="file"; filename="test_leaf.jpg"\r\n')
    body.extend(b'Content-Type: image/jpeg\r\n\r\n')
    body.extend(image_bytes)
    body.extend(b'\r\n')
    body.extend(f'--{boundary}--\r\n'.encode('utf-8'))

    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/disease/predict',
        data=bytes(body),
        headers={
            'Content-Type': f'multipart/form-data; boundary={boundary}',
            'Content-Length': str(len(body))
        },
        method='POST'
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode())
        print(f"Category: {data.get('category')}")
        print(f"Crop: {data.get('crop_name')}, Disease: {data.get('disease_name')}")
        print(f"Confidence: {data.get('confidence_percentage')}%")
        print(f"Has GradCAM: {'grad_cam_overlay_base64' in data and bool(data['grad_cam_overlay_base64'])}")
        assert resp.status == 200

if __name__ == '__main__':
    print("=================================================")
    print("RUNNING AGRINEX FULL ENDPOINT INTEGRATION SUITE")
    print("=================================================")
    test_health()
    test_model_status()
    test_fertilizer_recommend()
    test_yield_predict()
    test_disease_explain()
    test_disease_predict_file()
    print("\n=================================================")
    print("ALL 6 TESTS PASSED WITH 100% SUCCESS!")
    print("=================================================")
