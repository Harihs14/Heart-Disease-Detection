# Heart Disease Detection System

This application uses a YOLOv8 classification model to detect heart disease from medical images. The system classifies images into four categories: Abnormal, HMI (Hypertrophic Myocardial Infarction), MI (Myocardial Infarction), and Normal.

## Features

- Modern UI built with React and Tailwind CSS
- Real-time image preview
- Detailed analysis with confidence scores
- FastAPI backend with YOLOv8 model integration
- Responsive design for desktop and mobile devices

# Dataset

This project uses a labeled dataset of heart images from Roboflow to train and validate the model. The dataset includes categorized images of Abnormal, HMI (Hypertrophic Myocardial Infarction), MI (Myocardial Infarction), and Normal heart conditions.

👉 View the dataset on Roboflow
https://universe.roboflow.com/heat-disease-detection/heart-disease-detection-kczqi/dataset/1

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Installation

### Backend Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Make sure you have the YOLOv8 model file (`best.pt`) in the root directory.

### Frontend Setup

1. Navigate to the React application directory:
   ```bash
   cd heart-disease
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Start the Backend Server

1. From the root directory, run:
   ```bash
   python main.py
   ```
   This will start the FastAPI server at `http://localhost:8000`.

### Start the Frontend Development Server

1. In a separate terminal, navigate to the React application directory:
   ```bash
   cd heart-disease
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   This will start the React development server at `http://localhost:5173`.

3. Open your browser and navigate to `http://localhost:5173`.

## Using the Application

1. Upload a heart image using the upload area.
2. Click "Analyze Image" to process the image.
3. View the results in the right panel, including the classification and confidence scores.

## Model Information

- The model is trained on heart images to classify them into four categories.
- YOLOv8 is used as the base architecture for the classification task.
- The model file `best.pt` contains the weights and architecture information.

## Acknowledgments

- YOLOv8 by Ultralytics
- FastAPI
- React
- Tailwind CSS 