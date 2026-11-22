"""
AgriNex Pre-trained Model Downloader
Downloads the PlantVillage MobileNetV3 checkpoint (17.2 MB) from HuggingFace.
"""
import os
import urllib.request
import sys

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "plant_village.pth")
MODEL_URL = "https://huggingface.co/hitmonleet/PlantVillage__MobileNetV3/resolve/main/plant_village.pth"

def download_model():
    os.makedirs(MODEL_DIR, exist_ok=True)
    if os.path.exists(MODEL_PATH) and os.path.getsize(MODEL_PATH) > 1000000:
        print(f"[OK] Model checkpoint already exists at {MODEL_PATH} ({os.path.getsize(MODEL_PATH):,} bytes)")
        return

    print(f"Downloading PlantVillage MobileNetV3 weights (~17.2 MB) from {MODEL_URL}...")
    try:
        def reporthook(count, block_size, total_size):
            percent = int(count * block_size * 100 / total_size)
            sys.stdout.write(f"\rDownloading: {percent}% [{count * block_size / (1024*1024):.1f}MB / {total_size / (1024*1024):.1f}MB]")
            sys.stdout.flush()

        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH, reporthook)
        print(f"\n[OK] Model successfully saved to {MODEL_PATH}")
    except Exception as e:
        print(f"\n[ERROR] Failed to download model: {e}")
        print("You can manually download the file from:")
        print(f"  {MODEL_URL}")
        print(f"and place it at: {MODEL_PATH}")

if __name__ == "__main__":
    download_model()
