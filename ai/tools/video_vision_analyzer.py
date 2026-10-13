import base64
import os

import cv2
from openai import OpenAI


def analyze_crop_video(
    video_path: str,
    prompt: str = "Analyze this farm video for crop health, weeds, wilting, or pest damage.",
):
    if not os.path.exists(video_path):
        return {"error": "Video file not found"}

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        cap.release()
        return {"error": "Could not open video"}

    fps = cap.get(cv2.CAP_PROP_FPS)
    fps = fps if fps and fps > 0 else 30
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if frame_count <= 0:
        cap.release()
        return {"error": "Could not read video frame count"}

    # Three samples provide a view across the clip while keeping requests small.
    sample_count = min(3, frame_count)
    if sample_count == 1:
        sample_indices = [0]
    else:
        sample_indices = [
            round(index * (frame_count - 1) / (sample_count - 1))
            for index in range(sample_count)
        ]

    sampled_frames = []
    try:
        for frame_index in sample_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
            success, frame = cap.read()
            if not success:
                continue

            frame = cv2.resize(frame, (640, 360))
            success, buffer = cv2.imencode(".jpg", frame)
            if not success:
                continue

            frame_data = base64.b64encode(buffer).decode("utf-8")
            sampled_frames.append((frame_index / fps, f"data:image/jpeg;base64,{frame_data}"))
    finally:
        cap.release()

    if not sampled_frames:
        return {"error": "Could not extract frames from video"}

    client = OpenAI(
        base_url=os.getenv("NVIDIA_VLM_BASE_URL", "https://integrate.api.nvidia.com/v1"),
        api_key=os.getenv("NVIDIA_API_KEY", "not-used"),
    )

    try:
        frame_assessments = []
        for timestamp, frame_url in sampled_frames:
            response = client.chat.completions.create(
                model=os.getenv("NVIDIA_VLM_MODEL", "meta/llama-3.2-11b-vision-instruct"),
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": (
                                    f"{prompt}\nThis is one sampled frame at {timestamp:.1f} seconds. "
                                    "Describe only visible evidence and note any uncertainty."
                                ),
                            },
                            {"type": "image_url", "image_url": {"url": frame_url}},
                        ],
                    }
                ],
                max_tokens=250,
            )
            assessment = response.choices[0].message.content
            if assessment:
                frame_assessments.append(f"At {timestamp:.1f} seconds: {assessment.strip()}")

        if not frame_assessments:
            return {"error": "Video frames could not be analyzed"}

        return {
            "status": "success",
            "video_visual_assessment": "\n".join(frame_assessments),
        }
    except Exception as error:
        return {"status": "error", "message": str(error)}
