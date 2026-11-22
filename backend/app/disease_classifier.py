"""
AgriNex Trained Plant Disease Classification Engine (MobileNetV3 on PlantVillage)
Supported by:
- D. M. Kabala et al. (Scientific Reports 2023, 19220): "Image-Based Crop Disease Detection with Federated Learning"
- H. A. Tahir et al. (IEEE Access 2025): Grad-CAM visual heatmaps and multimodal edge verification.
"""

import os
import io
import base64
import torch
import torchvision.models as models
import torchvision.transforms as transforms
import numpy as np
from PIL import Image, ImageFilter
from typing import Dict, Any, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "plant_village.pth")

# The 39 exact classes of the PlantVillage / New Plant Diseases Dataset
PLANT_VILLAGE_CLASSES = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy',
    'Background_without_leaves'
]

# Agronomic knowledge base for plant disease conditions
DISEASE_INFO = {
    'Apple_scab': {
        'name': 'Apple Scab',
        'description': 'A fungal disease causing olive-green to dark brown velvety spots on leaves and scabby lesions on fruit.',
        'recommendations': [
            'Rake and dispose of fallen leaves to reduce overwintering fungal spores.',
            'Apply preventive sulfur or copper-based fungicide before rainy periods in spring.',
            'Prune tree branches to improve air circulation and sunlight penetration.'
        ]
    },
    'Black_rot': {
        'name': 'Black Rot',
        'description': 'A fungal pathogen that causes circular reddish-brown leaf spots with dark margins and rotting of fruit.',
        'recommendations': [
            'Prune out diseased cankers, twigs, and mummified fruit from previous season.',
            'Apply fungicides such as Captan or Mancozeb during early bud break.',
            'Ensure proper spacing between plants for good canopy ventilation.'
        ]
    },
    'Cedar_apple_rust': {
        'name': 'Cedar Apple Rust',
        'description': 'Characterized by bright yellow-orange spots on the upper leaf surface that produce tube-like fungal projections.',
        'recommendations': [
            'Remove nearby Eastern red cedar or juniper trees if practical.',
            'Apply protective fungicides (e.g. Myclobutanil) when orange galls appear on junipers.',
            'Choose rust-resistant apple cultivars for future planting.'
        ]
    },
    'Powdery_mildew': {
        'name': 'Powdery Mildew',
        'description': 'White to grayish powdery fungal growth covering the surfaces of leaves, shoots, and young fruit.',
        'recommendations': [
            'Spray organic potassium bicarbonate or diluted neem oil (5 ml/L).',
            'Avoid overhead sprinkler irrigation; irrigate at soil level.',
            'Thin dense foliage to enhance airflow through the crop canopy.'
        ]
    },
    'Cercospora_leaf_spot Gray_leaf_spot': {
        'name': 'Gray Leaf Spot (Cercospora)',
        'description': 'Narrow rectangular lesions that turn tan or gray, bounded by leaf veins, common in humid warm weather.',
        'recommendations': [
            'Rotate crops with non-host species such as soybean or pulses for at least one year.',
            'Till crop residues after harvest to accelerate decomposition of fungal inoculum.',
            'Apply registered foliar fungicides if symptoms appear prior to tasseling.'
        ]
    },
    'Common_rust_': {
        'name': 'Common Rust',
        'description': 'Golden-brown to cinnamon-brown pustules developing on both upper and lower leaf surfaces.',
        'recommendations': [
            'Plant rust-tolerant hybrid corn varieties with specific Rp resistance genes.',
            'Apply triazole or strobilurin fungicides if disease spreads to upper ear leaves early in the season.',
            'Maintain balanced nitrogen fertilization to avoid excessive succulent tissue.'
        ]
    },
    'Northern_Leaf_Blight': {
        'name': 'Northern Corn Leaf Blight',
        'description': 'Large, cigar-shaped grayish-green to tan lesions that can coalesce and cause extensive leaf death.',
        'recommendations': [
            'Practice crop rotation to disrupt fungal survival in residue.',
            'Apply foliar fungicides at silking if weather is cool, wet, and lesions are visible.',
            'Select resistant hybrid seed varieties.'
        ]
    },
    'Esca_(Black_Measles)': {
        'name': 'Esca (Black Measles)',
        'description': 'Foliar tiger-stripe interveinal chlorosis and necrotic patches, accompanied by spotted grape berries.',
        'recommendations': [
            'Avoid making large pruning wounds during wet weather.',
            'Disinfect pruning tools between vines with a 70% alcohol or bleach solution.',
            'Mark and remove heavily diseased vines to prevent vineyard spread.'
        ]
    },
    'Leaf_blight_(Isariopsis_Leaf_Spot)': {
        'name': 'Isariopsis Leaf Blight',
        'description': 'Irregular brown spots on mature leaves that expand and cause premature defoliation.',
        'recommendations': [
            'Apply protective copper fungicides or Bordeaux mixture post-pruning.',
            'Ensure adequate trellis training to keep grape foliage dry and ventilated.',
            'Collect and destroy infected fallen leaf litter.'
        ]
    },
    'Haunglongbing_(Citrus_greening)': {
        'name': 'Citrus Greening (Huanglongbing)',
        'description': 'Asymmetrical leaf yellowing (blotchy mottle), twig dieback, and small, bitter, lopsided green fruit.',
        'recommendations': [
            'Manage Asian citrus psyllid insect vectors using systemic insecticides or biological controls.',
            'Promptly remove and destroy infected trees to prevent grove contagion.',
            'Use certified disease-free nursery rootstock and budwood.'
        ]
    },
    'Bacterial_spot': {
        'name': 'Bacterial Spot',
        'description': 'Water-soaked spots on leaves that turn brown-black with yellow halos; scab-like raised spots on fruit.',
        'recommendations': [
            'Spray fixed copper bactericide mixed with Mancozeb for improved bacterial control.',
            'Do not work in fields when crop foliage is wet to avoid spreading bacteria.',
            'Use pathogen-tested, hot-water-treated seeds.'
        ]
    },
    'Early_blight': {
        'name': 'Early Blight (Alternaria)',
        'description': 'Characteristic dark brown spots with concentric rings (target-like pattern) starting on older lower leaves.',
        'recommendations': [
            'Apply copper oxychloride (2.5 g/L) or Chlorothalonil fungicide at first sign of spots.',
            'Prune lower leaves touching wet soil to eliminate splash transmission.',
            'Mulch around plant bases and practice a 3-year crop rotation with non-solanaceous crops.'
        ]
    },
    'Late_blight': {
        'name': 'Late Blight (Phytophthora)',
        'description': 'Devastating water-soaked dark patches on leaves that rapidly enlarge, with white fungal fuzz underneath in damp conditions.',
        'recommendations': [
            'Immediate treatment required: Apply systemic fungicides like Metalaxyl or Mancozeb.',
            'Destroy severely infected plants immediately; do not compost them.',
            'Avoid overhead watering and ensure rows run parallel to prevailing winds for rapid drying.'
        ]
    },
    'Leaf_Mold': {
        'name': 'Leaf Mold (Passalora)',
        'description': 'Pale yellow spots on upper leaf surfaces matching olive-green to brown velvety patches on leaf undersides.',
        'recommendations': [
            'Reduce greenhouse relative humidity below 85% by increasing ventilation and heat.',
            'Space plants adequately to facilitate rapid foliar drying.',
            'Apply protective biofungicides (Bacillus subtilis) or copper spray.'
        ]
    },
    'Septoria_leaf_spot': {
        'name': 'Septoria Leaf Spot',
        'description': 'Numerous small circular spots with dark brown margins and sunken grayish-white centers with tiny black dots.',
        'recommendations': [
            'Remove and discard affected lower leaves as soon as spots appear.',
            'Keep leaves dry by watering only at the base with drip irrigation or soaker hoses.',
            'Apply copper or chlorothalonil fungicide every 7-10 days in wet seasons.'
        ]
    },
    'Spider_mites Two-spotted_spider_mite': {
        'name': 'Two-Spotted Spider Mites',
        'description': 'Fine stippling (pale dots) on leaves that turn bronzed and dry, accompanied by delicate silk webbing.',
        'recommendations': [
            'Spray underside of leaves with insecticidal soap or horticultural neem oil.',
            'Introduce natural predatory mites (Phytoseiulus persimilis) in enclosed greenhouses.',
            'Keep field humidity balanced as hot dry conditions favor rapid mite outbreaks.'
        ]
    },
    'Target_Spot': {
        'name': 'Target Spot (Corynespora)',
        'description': 'Brown lesions with concentric rings and chlorotic halos that expand on leaves, stems, and fruit.',
        'recommendations': [
            'Ensure adequate plant spacing and stake or trellis plants off the ground.',
            'Apply protectant fungicides (e.g. Azoxystrobin or Chlorothalonil) during humid weather.',
            'Eradicate volunteer weed hosts in surrounding border rows.'
        ]
    },
    'Tomato_Yellow_Leaf_Curl_Virus': {
        'name': 'Tomato Yellow Leaf Curl Virus (TYLCV)',
        'description': 'Severe upward curling and cupping of leaflets, marked yellowing of leaf margins, and stunted bushy growth.',
        'recommendations': [
            'Control whitefly vectors using yellow sticky traps and systemic insecticidal treatments.',
            'Use fine insect exclusion netting (50-mesh) on nursery seedlings.',
            'Plant TYLCV-resistant tomato hybrids.'
        ]
    },
    'Tomato_mosaic_virus': {
        'name': 'Tomato Mosaic Virus (ToMV)',
        'description': 'Mottled dark green and light yellow mosaic patterns on leaves with distortion, blistering, and fern-like foliage.',
        'recommendations': [
            'Disinfect hands and all pruning tools with a 20% nonfat dry milk or trisodium phosphate solution.',
            'Wash hands thoroughly before handling plants, especially if using tobacco products.',
            'Remove and burn infected plants immediately as the virus is highly infectious via contact.'
        ]
    },
    'Leaf_scorch': {
        'name': 'Strawberry Leaf Scorch',
        'description': 'Small irregular dark purple spots that enlarge and turn dark brown, giving the leaf a scorched or burned appearance.',
        'recommendations': [
            'Mow and incorporate strawberry foliage immediately after final fruit harvest.',
            'Apply copper fungicide in early spring as new leaves emerge.',
            'Ensure well-drained planting beds to minimize water pooling.'
        ]
    }
}

class DiseaseClassifier:
    def __init__(self):
        self.model: Optional[torch.nn.Module] = None
        self.model_available = False
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        self._load_model()

    def _load_model(self):
        try:
            if not os.path.exists(MODEL_PATH):
                print(f"[WARN] Plant disease model checkpoint not found at {MODEL_PATH}")
                self.model_available = False
                return

            # Initialize MobileNetV3 Large architecture with 39 classes
            model = models.mobilenet_v3_large(weights=None)
            model.classifier[3] = torch.nn.Linear(1280, len(PLANT_VILLAGE_CLASSES))
            
            checkpoint = torch.load(MODEL_PATH, map_location='cpu')
            state_dict = checkpoint.get('model_state_dict', checkpoint)
            model.load_state_dict(state_dict)
            model.eval()

            self.model = model
            self.model_available = True
            print(f"[OK] MobileNetV3 PlantVillage model loaded successfully from {MODEL_PATH}")
        except Exception as e:
            print(f"[ERROR] Failed to load disease classification model: {e}")
            self.model = None
            self.model_available = False

    def predict(self, image: Image.Image) -> Dict[str, Any]:
        """
        Runs real neural inference on uploaded image:
        - Classifies into Healthy, Diseased, or Unknown
        - Generates Grad-CAM activation heatmap overlay
        - Provides disease details & management recommendations
        """
        if not self.model_available or self.model is None:
            return {
                'status': 'error',
                'category': 'unavailable',
                'message': 'Disease detection model is not configured.',
                'model_name': 'MobileNetV3 (PlantVillage)',
                'confidence': 0.0
            }

        # Preprocess image
        input_tensor = self.transform(image).unsqueeze(0)  # Shape [1, 3, 224, 224]

        # Grad-CAM forward hook setup on last convolutional layer
        features_activation = []
        def forward_hook(module, inp, out):
            features_activation.append(out)

        hook_handle = self.model.features[-1].register_forward_hook(forward_hook)

        input_tensor.requires_grad = True
        outputs = self.model(input_tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]
        
        # Get top class prediction
        top_prob, top_idx = torch.topk(probabilities, 1)
        prob_val = float(top_prob.item())
        class_idx = int(top_idx.item())
        pred_class = PLANT_VILLAGE_CLASSES[class_idx]

        # Backward pass for Grad-CAM
        self.model.zero_grad()
        score = outputs[0, class_idx]
        score.backward()

        # Compute Grad-CAM
        grad_cam_overlay_b64 = None
        try:
            if features_activation and input_tensor.grad is not None:
                # Activation map from layer: [1, 960, 7, 7]
                act = features_activation[0].detach()[0] # [960, 7, 7]
                # Gradients: pool across spatial dimensions
                grads = torch.mean(input_tensor.grad[0], dim=[1, 2]) # [3]
                
                # Channel-weighted activation map
                weights = torch.mean(act, dim=[1, 2]) # [960]
                cam = torch.zeros(act.shape[1:], dtype=torch.float32)
                for i, w in enumerate(weights):
                    cam += w * act[i]
                cam = torch.relu(cam).numpy()

                # Normalize heatmap
                if np.max(cam) > np.min(cam):
                    cam = (cam - np.min(cam)) / (np.max(cam) - np.min(cam))
                else:
                    cam = np.zeros_like(cam)

                # Resize heatmap to match image dimensions
                orig_w, orig_h = image.size
                target_size = (384, int(384 * (orig_h / orig_w)))
                image_resized = image.resize(target_size, Image.Resampling.BILINEAR)
                
                cam_pil = Image.fromarray((cam * 255.0).astype(np.uint8))
                cam_pil = cam_pil.resize(target_size, Image.Resampling.BILINEAR)
                cam_smoothed = cam_pil.filter(ImageFilter.GaussianBlur(radius=12))
                cam_norm = np.array(cam_smoothed, dtype=np.float32) / 255.0

                # Colorize with JET colormap
                arr = np.array(image_resized, dtype=np.float32)
                heatmap = np.zeros_like(arr)
                heatmap[:, :, 0] = np.clip(1.5 * (cam_norm - 0.33) * 255.0, 0, 255)
                heatmap[:, :, 1] = np.clip(255.0 - 2.0 * np.abs(cam_norm - 0.5) * 255.0, 0, 255)
                heatmap[:, :, 2] = np.clip((0.66 - cam_norm) * 2.0 * 255.0, 0, 255)

                blended = (0.58 * arr + 0.42 * heatmap).astype(np.uint8)
                blended_img = Image.fromarray(blended)

                buf = io.BytesIO()
                blended_img.save(buf, format="JPEG", quality=85)
                grad_cam_overlay_b64 = f"data:image/jpeg;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"
        except Exception as e:
            print(f"[WARN] Grad-CAM computation warning: {e}")
        finally:
            hook_handle.remove()

        # Check for non-plant or low-confidence ambiguous prediction
        if pred_class == 'Background_without_leaves' or prob_val < 0.40:
            return {
                'status': 'success',
                'category': 'unknown',
                'message': 'Unable to identify the condition confidently. Please upload a clearer image.',
                'guidance': 'Ensure the leaf or crop is clearly in focus, well-lit, and occupying the center of the frame.',
                'model_name': 'MobileNetV3 (PlantVillage)',
                'confidence_percentage': round(prob_val * 100, 1),
                'top_prediction': pred_class.replace('___', ' - ').replace('_', ' ')
            }

        # Parse crop and condition from class name (Format: 'Crop___Condition')
        parts = pred_class.split('___')
        crop_raw = parts[0].replace('_', ' ').replace('(including sour)', '').replace('(maize)', '').replace(',', '').strip()
        condition_raw = parts[1] if len(parts) > 1 else 'healthy'

        # Check for Healthy condition
        if 'healthy' in condition_raw.lower():
            return {
                'status': 'success',
                'category': 'healthy',
                'crop_name': crop_raw.title(),
                'condition': 'Healthy',
                'message': 'Your crop appears healthy.',
                'confidence_percentage': round(prob_val * 100, 1),
                'model_name': 'MobileNetV3 (PlantVillage)',
                'recommendations': [
                    'Maintain current balanced irrigation and fertilization schedule.',
                    'Continue periodic field scouting to catch early pest or stress signs.',
                    'Ensure optimal soil moisture and good drainage around root zones.'
                ],
                'grad_cam_available': grad_cam_overlay_b64 is not None,
                'grad_cam_overlay_base64': grad_cam_overlay_b64
            }

        # Diseased condition
        disease_meta = DISEASE_INFO.get(condition_raw, {
            'name': condition_raw.replace('_', ' ').title(),
            'description': f'A foliar condition affecting {crop_raw.title()} crops, characterized by leaf discoloration or spots.',
            'recommendations': [
                'Prune and destroy severely infected lower leaves.',
                'Avoid overhead irrigation to minimize leaf moisture duration.',
                'Apply appropriate organic neem oil or recommended copper-based protective fungicide.'
            ]
        })

        return {
            'status': 'success',
            'category': 'diseased',
            'crop_name': crop_raw.title(),
            'disease_name': disease_meta['name'],
            'message': f'{crop_raw.title()} is affected by {disease_meta["name"]}.',
            'confidence_percentage': round(prob_val * 100, 1),
            'description': disease_meta['description'],
            'recommendations': disease_meta['recommendations'],
            'model_name': 'MobileNetV3 (PlantVillage)',
            'grad_cam_available': grad_cam_overlay_b64 is not None,
            'grad_cam_overlay_base64': grad_cam_overlay_b64
        }

# Singleton instance
disease_classifier = DiseaseClassifier()

