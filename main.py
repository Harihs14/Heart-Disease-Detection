from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
import cv2
from ultralytics import YOLO
import io
from PIL import Image

app = FastAPI()

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained YOLOv8 model
model = YOLO("best.pt")

# Define class names
class_names = ["Abnormal", "HMI", "MI", "Normal"]

@app.get("/")
def read_root():
    return {"message": "Heart Disease Detection API"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    
    # Convert the uploaded image to format suitable for prediction
    image = Image.open(io.BytesIO(contents))
    
    # Make a prediction with the model
    results = model(image)[0]
    
    # Extract classification results
    class_id = results.probs.top1
    confidence = float(results.probs.top1conf)
    predicted_class = class_names[class_id]
    
    return {
        "class": predicted_class,
        "confidence": confidence,
        "predictions": {
            class_names[i]: float(results.probs.data[i]) 
            for i in range(len(class_names))
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
