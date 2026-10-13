import os
import base64
from openai import OpenAI

def analyze_crop_image(image_path: str, prompt: str = "Analyze this farm crop photo. Check for nutrient deficiencies, pest damage, or disease symptoms."):
    if not os.path.exists(image_path):
        return {"error": "Image file not found"}

    # Convert local image file to base64 data URI
    with open(image_path, "rb") as f:
        image_bytes = f.read()
        image_b64 = base64.b64encode(image_bytes).decode("utf-8")
        
    # Determine mime type roughly
    mime_type = "image/jpeg"
    if image_path.endswith(".png"):
        mime_type = "image/png"
    elif image_path.endswith(".gif"):
        mime_type = "image/gif"

    image_data_url = f"data:{mime_type};base64,{image_b64}"

    # Connect to NVIDIA NIM VLM endpoint (or cloud catalog endpoint)
    client = OpenAI(
        base_url=os.getenv("NVIDIA_VLM_BASE_URL", "https://integrate.api.nvidia.com/v1"),
        api_key=os.getenv("NVIDIA_API_KEY", "not-used")
    )

    try:
        response = client.chat.completions.create(
            model=os.getenv("NVIDIA_VLM_MODEL", "meta/llama-3.2-11b-vision-instruct"),
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_data_url
                            }
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ],
            max_tokens=300
        )
        return {
            "status": "success",
            "visual_assessment": response.choices[0].message.content
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}