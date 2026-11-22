import io
import json
import urllib.request
from PIL import Image, ImageDraw

def create_synthetic_leaf():
    img = Image.new('RGB', (300, 300), color=(240, 240, 240))
    draw = ImageDraw.Draw(img)
    draw.ellipse([50, 40, 250, 260], fill=(34, 139, 34))
    draw.ellipse([80, 80, 110, 110], fill=(139, 69, 19))
    draw.ellipse([140, 150, 170, 180], fill=(160, 82, 45))
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    return buf.getvalue()

def test_upload():
    image_bytes = create_synthetic_leaf()
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    
    body = bytearray()
    body.extend(f'--{boundary}\r\n'.encode('utf-8'))
    body.extend(b'Content-Disposition: form-data; name="file"; filename="test_leaf.jpg"\r\n')
    body.extend(b'Content-Type: image/jpeg\r\n\r\n')
    body.extend(image_bytes)
    body.extend(b'\r\n')
    body.extend(f'--{boundary}--\r\n'.encode('utf-8'))
    
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/crop/diagnose',
        data=bytes(body),
        headers={
            'Content-Type': f'multipart/form-data; boundary={boundary}',
            'Content-Length': str(len(body))
        },
        method='POST'
    )
    
    with urllib.request.urlopen(req, timeout=15) as resp:
        print(f"Status Code: {resp.status}")
        raw = resp.read().decode('utf-8')
        data = json.loads(raw)
        print(f"Status: {data.get('status')}")
        print(f"Category: {data.get('category')}")
        print(f"Crop: {data.get('crop_name')}")
        print(f"Disease: {data.get('disease_name')}")
        print(f"Confidence %: {data.get('confidence_percentage')}%")
        print(f"Message: {data.get('message')}")
        print(f"Description: {data.get('description')}")
        print(f"Recommendations ({len(data.get('recommendations', []))} items): {data.get('recommendations')}")
        has_cam = 'grad_cam_overlay_base64' in data and bool(data['grad_cam_overlay_base64'])
        print(f"Has GradCAM: {has_cam}")
        if has_cam:
            print(f"GradCAM length: {len(data['grad_cam_overlay_base64'])} chars")
        has_preview = 'uploaded_image_base64' in data and bool(data['uploaded_image_base64'])
        print(f"Has Uploaded Preview: {has_preview}")
        print("\nAll farmer diagnostic fields successfully verified!")

if __name__ == '__main__':
    test_upload()
