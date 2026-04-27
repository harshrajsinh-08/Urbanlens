# UrbanLens | London Real Estate AI

> [!TIP]
> **Preparing for a presentation or exam?** Check out the [VIVA_GUIDE.md](file:///Users/harsh/Projects/PROJECT-2/VIVA_GUIDE.md) for a complete explanation of the ML model, data flow, and potential examiner questions.

A research-grade Machine Learning application that predicts Airbnb rental prices in London by fusing property specifications with **Hyper-Local Context** (OpenStreetMap & Census data).

---

## 🚀 The Core Concept: "Feature Fusion"
Unlike standard predictors that only look at "Bedrooms" and "WiFi," this project uses **Feature Fusion** to understand the neighborhood. It combines:
1.  **Airbnb Data:** Property specs (Beds, Room Type).
2.  **OpenStreetMap (OSM):** Live counts of nearby restaurants, shops, and tube stations.
3.  **UK Census Data:** Local area affluence (Median Income) and population density.

---

## 🏗️ Project Architecture

### 1. The Frontend (React/Next.js)
*   **Host Dashboard:** A "What-If" simulator for owners to see how adding amenities or changing locations affects their value.
*   **Explainable UI:** Uses the backend's SHAP analysis to show a **Price Breakdown** (e.g., *"Why is my price £150? Because the area income adds £30 but being far from the tube subtracts £10"*).

### 2. The Backend (Python/FastAPI)
*   **Feature Engineering Engine:** Takes a latitude/longitude and "enriches" it with live map data.
*   **Expert Pipeline:** A high-performance wrapper that handles data preprocessing, model prediction, and XAI (Explainable AI) generation.

### 3. The ML Engine (XGBoost)
*   **Gradient Boosting:** Uses a forest of 1,000 trees that learn from each other's mistakes during training.
*   **Uncertainty Estimation:** Runs three models (Quantile Regression) to provide a "Fair Range" (Lower/Upper bounds) instead of just one number.
*   **Target Transformation:** Operates in `log-space` to handle the wide range of London property prices accurately.

---

## 📂 Key Files & Folders

### 🧠 Machine Learning (`/ML/final_codes/`)
*   `data_fusion.py`: The script that "fuses" Airbnb data with OSM and Census data.
*   `train_fused_model.py`: The high-performance training script for the expert model.
*   `preprocessing.py`: Handles data cleaning and dummy variable creation.

### 🔧 Backend (`/backend/ml/`)
*   `feature_engineering.py`: The live engine that calls OpenStreetMap APIs.
*   `expert_pipeline.py`: The logic that loads the `.pkl` models and generates SHAP explanations.
*   `main.py`: The FastAPI server that connects the ML logic to the web.

---

## 🛠️ How it Runs
1.  **User Input:** You select a location and property specs in the UI.
2.  **Enrichment:** The Backend calculates the "Vibe" (Income, Restaurant density) for that GPS point.
3.  **Prediction:** The XGBoost model votes on the price based on fused features.
4.  **Explanation:** SHAP calculates the "Dollar Impact" of every feature.
5.  **Display:** You see the final estimated price and a transparent list of reasons why.

---

## 📊 Performance
*   **Algorithm:** XGBoost Regressor
*   **R² Score:** ~0.76 (76% variance explained)
*   **MAE:** ~£18 (Mean Absolute Error)
*   **Key Drivers:** Area Affluence (Income), Room Type, and Transit Proximity.


