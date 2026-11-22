import uvicorn
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("=" * 70)
    print("HYBRID AI FRAMEWORK FOR SMART AGRICULTURE")
    print("Using Explainable AI, Federated Learning, and Edge Computing")
    print("=" * 70)
    print("Server starting at http://127.0.0.1:8000")
    print("Interactive API Documentation: http://127.0.0.1:8000/docs")
    print("=" * 70)
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)

