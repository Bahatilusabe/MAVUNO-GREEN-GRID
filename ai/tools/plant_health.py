import os
import requests
from dotenv import load_dotenv

load_dotenv()

def diagnose_crop(image_path: str, api_key: str = None) -> dict:
    """
    Sends a plant leaf image to the Kindwise Crop.health API to identify diseases,
    pests, and nutrient deficiencies, returning treatment advice.
    """
    key = api_key or os.environ.get("KINDWISE_API_KEY")
    if not key:
        raise RuntimeError("KINDWISE_API_KEY is not set in environment variables.")

    url = "https://crop.kindwise.com/api/v1/identification"
    
    headers = {
        "Api-Key": key
    }
    
    # Open the image file to upload
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at path: {image_path}")

    with open(image_path, "rb") as img_file:
        files = {"images": img_file}
        # Request disease details and treatment recommendations
        data = {
            "details": "disease_details,treatment,cause"
        }
        
        response = requests.post(url, headers=headers, files=files, data=data)

    if response.status_code != 201 and response.status_code != 200:
        raise RuntimeError(f"Kindwise API Error ({response.status_code}): {response.text}")

    result = response.json()
    
    # Parse the top disease prediction
    suggestion = result.get("result", {}).get("disease", {}).get("suggestions", [])
    if not suggestion:
        return {"diagnosis": "Healthy or unknown condition", "confidence": 0.0, "treatment": "No treatment required."}

    top_match = suggestion[0]
    disease_name = top_match.get("name", "Unknown Disease")
    probability = top_match.get("probability", 0.0)
    details = top_match.get("details", {})
    
    treatment = details.get("treatment", {}).get("text", "Monitor crop condition and consult local agricultural extension officers.")
    cause = details.get("cause", "Environmental or pathogen factors.")

    return {
        "diagnosis": disease_name,
        "confidence": round(probability * 100, 1),
        "cause": cause,
        "treatment": treatment
    }

# Quick terminal test block
if __name__ == "__main__":
    TEST_IMAGE = "path_to_test_leaf.jpg"
    try:
        # diagnosis = diagnose_crop(TEST_IMAGE)
        # print(diagnosis)
        print("Plant health module ready for configuration.")
    except Exception as e:
        print(f"Error: {e}")