"""
Model configuration and metadata for AGRISMART-AI Crop Disease Classifier.
Matches PlantVillage class structure and default ResNet50 backbone.
"""

import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_WEIGHTS_PATH = os.getenv("MODEL_WEIGHTS_PATH", str(BASE_DIR / "model" / "weights" / "resnet50_best.pth"))

# Input Normalization (Standard ImageNet values matching training script)
IMAGE_SIZE = (224, 224)
NORMALIZE_MEAN = [0.485, 0.456, 0.406]
NORMALIZE_STD = [0.229, 0.224, 0.225]

# Exact 15 PlantVillage classes sorted alphabetically as per dataset
CLASS_NAMES = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "Tomato__Target_Spot",
    "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato__Tomato_mosaic_virus",
    "Tomato_healthy"
]

# Detailed Agronomic Metadata for Output Formatting
DISEASE_METADATA = {
    "Tomato_Early_blight": {
        "friendly_name": "Tomato Early Blight",
        "crop": "Tomato",
        "pathogen": "Alternaria solani",
        "severity": "Moderate",
        "precautions": [
            "Remove visibly affected lower leaves to reduce airborne fungal spores.",
            "Avoid overhead irrigation; switch exclusively to drip irrigation at root level.",
            "Maintain adequate spacing between plants to enhance canopy airflow.",
            "Consult local agricultural extension for approved copper or bio-fungicides."
        ]
    },
    "Tomato_Late_blight": {
        "friendly_name": "Tomato Late Blight",
        "crop": "Tomato",
        "pathogen": "Phytophthora infestans",
        "severity": "High",
        "precautions": [
            "Immediately isolate or destroy severely blighted plants to stop field spread.",
            "Apply protective copper fungicides during cool, high-humidity weather.",
            "Ensure strict field hygiene and remove solanaceous weed hosts."
        ]
    },
    "Tomato_Bacterial_spot": {
        "friendly_name": "Tomato Bacterial Spot",
        "crop": "Tomato",
        "pathogen": "Xanthomonas vesicatoria",
        "severity": "High",
        "precautions": [
            "Avoid working in field beds while foliage is wet.",
            "Use certified disease-free seeds and transplants.",
            "Apply copper-mancozeb sprays if symptoms appear early."
        ]
    },
    "Tomato_Leaf_Mold": {
        "friendly_name": "Tomato Leaf Mold",
        "crop": "Tomato",
        "pathogen": "Passalora fulva",
        "severity": "Moderate",
        "precautions": [
            "Improve greenhouse ventilation and lower ambient humidity below 85%.",
            "Prune lower canopy leaves to increase light penetration.",
            "Use resistant crop varieties in high-moisture seasons."
        ]
    },
    "Tomato_Septoria_leaf_spot": {
        "friendly_name": "Tomato Septoria Leaf Spot",
        "crop": "Tomato",
        "pathogen": "Septoria lycopersici",
        "severity": "Moderate",
        "precautions": [
            "Remove affected bottom leaves at first sign of circular lesions.",
            "Mulch bed base to prevent fungal soil splash onto lower foliage.",
            "Practice a 3-year crop rotation with non-solanaceous crops."
        ]
    },
    "Tomato_Spider_mites_Two_spotted_spider_mite": {
        "friendly_name": "Tomato Two-Spotted Spider Mites",
        "crop": "Tomato",
        "pathogen": "Tetranychus urticae",
        "severity": "Moderate",
        "precautions": [
            "Spray foliage undersides with water or insecticidal soap to reduce mite density.",
            "Introduce natural predators such as Phytoseiulus persimilis mites.",
            "Avoid excessive nitrogen fertilization which encourages mite proliferation."
        ]
    },
    "Tomato__Target_Spot": {
        "friendly_name": "Tomato Target Spot",
        "crop": "Tomato",
        "pathogen": "Corynespora cassiicola",
        "severity": "Moderate",
        "precautions": [
            "Maintain optimal row spacing for canopy ventilation.",
            "Foliar fungicide spray when environmental conditions favor disease development.",
            "Clear crop residue promptly post-harvest."
        ]
    },
    "Tomato__Tomato_YellowLeaf__Curl_Virus": {
        "friendly_name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "crop": "Tomato",
        "pathogen": "Begomovirus (transmitted by Whitefly)",
        "severity": "High",
        "precautions": [
            "Control whitefly vectors using yellow sticky traps and neem oil.",
            "Install insect-proof fine mesh netting in nursery beds.",
            "Remove and destroy infected virus-stunted plants immediately."
        ]
    },
    "Tomato__Tomato_mosaic_virus": {
        "friendly_name": "Tomato Mosaic Virus (ToMV)",
        "crop": "Tomato",
        "pathogen": "Tobamovirus",
        "severity": "High",
        "precautions": [
            "Sanitize hands and pruning tools with milk or trisodium phosphate solution.",
            "Do not use tobacco products near tomato crops.",
            "Plant ToMV-resistant tomato hybrids."
        ]
    },
    "Tomato_healthy": {
        "friendly_name": "Healthy Tomato Foliage",
        "crop": "Tomato",
        "pathogen": "None (Solanum lycopersicum)",
        "severity": "None",
        "precautions": [
            "Maintain current balanced fertilizer and drip irrigation schedule.",
            "Continue weekly monitoring of lower canopy for early pathogen spots.",
            "Ensure good field sanitation and weed management."
        ]
    },
    "Potato___Early_blight": {
        "friendly_name": "Potato Early Blight",
        "crop": "Potato",
        "pathogen": "Alternaria solani",
        "severity": "Moderate",
        "precautions": [
            "Ensure proper vine destruction 2 weeks prior to harvest.",
            "Apply nitrogen and potassium balanced nutrients to maintain plant vigor.",
            "Avoid overhead sprinkler irrigation late in the afternoon."
        ]
    },
    "Potato___Late_blight": {
        "friendly_name": "Potato Late Blight",
        "crop": "Potato",
        "pathogen": "Phytophthora infestans",
        "severity": "High",
        "precautions": [
            "Destroy infected foliage to prevent tuber sporangia wash-down.",
            "Fungicide preventive spray when relative humidity exceeds 90% for 10+ hours.",
            "Store harvested tubers at cool, dry conditions with adequate aeration."
        ]
    },
    "Potato___healthy": {
        "friendly_name": "Healthy Potato Foliage",
        "crop": "Potato",
        "pathogen": "None (Solanum tuberosum)",
        "severity": "None",
        "precautions": [
            "Keep potato hills properly mounded.",
            "Inspect fields twice weekly for signs of foliar lesion development."
        ]
    },
    "Pepper__bell___Bacterial_spot": {
        "friendly_name": "Pepper Bell Bacterial Spot",
        "crop": "Pepper Bell",
        "pathogen": "Xanthomonas euvesicatoria",
        "severity": "High",
        "precautions": [
            "Spray copper-based bactericides at first sign of water-soaked spots.",
            "Avoid handling foliage when wet with rain or dew.",
            "Practice 2 to 3-year crop rotation with non-solanaceous crops."
        ]
    },
    "Pepper__bell___healthy": {
        "friendly_name": "Healthy Pepper Bell Foliage",
        "crop": "Pepper Bell",
        "pathogen": "None (Capsicum annuum)",
        "severity": "None",
        "precautions": [
            "Maintain regular root drip irrigation.",
            "Ensure proper soil drainage and adequate calcium levels to prevent end rot."
        ]
    }
}
