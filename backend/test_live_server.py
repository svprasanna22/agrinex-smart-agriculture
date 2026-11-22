import subprocess
import time
import urllib.request
import json
import sys

def test_live():
    print("Launching FastAPI backend subprocess...")
    proc = subprocess.Popen([sys.executable, "run_backend.py"], cwd=r"C:\agri\backend")
    time.sleep(3.5)
    try:
        # Test Health
        with urllib.request.urlopen("http://127.0.0.1:8000/api/health", timeout=5) as res:
            health = json.loads(res.read().decode())
            print("[PASS] /api/health:", health["title"][:50] + "...", f"(Active Nodes: {health['edge_nodes_active']})")

        # Test Crop Prediction
        req_data = json.dumps({"N": 90, "P": 42, "K": 43, "temperature": 20.88, "humidity": 82.0, "ph": 6.5, "rainfall": 202.94}).encode()
        req = urllib.request.Request("http://127.0.0.1:8000/api/crops/predict", data=req_data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=5) as res:
            pred = json.loads(res.read().decode())
            print("[PASS] /api/crops/predict:", pred["recommended_crop"], f"({pred['confidence_percentage']}%)")

        # Test Federated Learning Round
        with urllib.request.urlopen("http://127.0.0.1:8000/api/federated/round?round_number=52", timeout=5) as res:
            fl = json.loads(res.read().decode())
            print("[PASS] /api/federated/round 52: Accuracy=", fl["global_accuracy"], "QWK=", fl["global_qwk"])

        print("\nALL LIVE SERVER REST ENDPOINTS VERIFIED!")
    finally:
        proc.terminate()
        proc.wait()
        print("Backend subprocess terminated.")

if __name__ == "__main__":
    test_live()

