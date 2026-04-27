# Airbnb Listing Price Prediction - ML Backend

This project implements a machine learning pipeline to predict Airbnb listing prices in Greater London. It includes data preprocessing, geospatial feature engineering (using LSOA data and POI distances), feature selection, and model training/comparison (XGBoost, LightGBM, Random Forest).

## Project Structure

- `ML_backend.ipynb`: The main Jupyter Notebook containing the entire ML pipeline (Data Loading -> Preprocessing -> Feature Engineering -> Modeling -> Evaluation).
- `requirements.txt`: Python dependencies required to run the project.
- `content/`: Directory to store the input datasets (ignored by git).
- `cache/`: Directory for cached files (ignored by git).
- `model_comparison_results.pkl` & `best_model_xgboost_with_distance.pkl`: Saved model artifacts (stored in `content/` or root, assumed to be generated).

## Reproducibility

To reproduce the results, follow these steps:

### 1. Environment Setup

Ensure you have Python installed (tested with Python 3.10+).

Create and activate a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  
# On Windows use: venv\Scripts\activate
```

Install the required dependencies:
```bash
pip install -r requirements.txt
```

### 2. Data Setup

The project relies on external datasets that are **not included in this repository** due to size constraints. You need to download/acquire the following files and place them in a `content/` directory at the project root:

1.  **`listings.csv`**: Airbnb listings data (e.g., from Inside Airbnb).
2.  **`LSOA.geojson`**: Geospatial data for Lower Layer Super Output Areas (LSOA).
3.  **`LSOA.csv`**: (Optional) Additional LSOA statistics.

**Directory Structure:**
```
/proj2_ml
  ├── ML_backend.ipynb
  ├── requirements.txt
  ├── README.md
  └── content/
      ├── listings.csv
      ├── LSOA.geojson
      └── LSOA.csv
```

### 3. Dataset Download Links

You can download the required datasets from the following sources:

*   **`listings.csv`**:
    *   Source: [Inside Airbnb](http://insideairbnb.com/get-the-data/)
    *   Instructions: Scroll down to "London, United Kingdom", click on "listings.csv" (Detailed Listings data).
*   **`LSOA.geojson` (and `LSOA.csv`)**:
    *   Source: [London Datastore - Statistical GIS Boundary Files](https://data.london.gov.uk/dataset/statistical-gis-boundary-files-london) or [Open Geography Portal](https://geoportal.statistics.gov.uk/)
    *   Instructions: Look for "LSOA" boundaries (e.g., 2011 or 2021 depending on preference, usually "Lower Layer Super Output Areas"). For the GeoJSON, you may need to convert shapefiles provided by London Datastore or download directly from the ONS Geoportal API.
    *   For `LSOA.csv`, you can often find "LSOA Atlas" or similar census data on the [London Datastore](https://data.london.gov.uk/) that maps LSOA codes to names or other statistics.

### 4. Running the Pipeline

Open `ML_backend.ipynb` in Jupyter Notebook or VS Code.

Run all cells in order. The notebook is structured as follows:
1.  **Dependencies**: Installs/Imports necessary libraries.
2.  **Load Data**: Reads files from the `content/` directory.
3.  **Data Preprocessing**: Cleans data, handles missing values, and removes outliers.
4.  **Geospatial Feature Engineering**:
    - Creates geometry from lat/lon.
    - Performs spatial joins with LSOA boundaries.
    - Calculates distances to key London landmarks (Haversine).
    - Fetches live Point of Interest (POI) data using `osmnx` (or uses fallback if API fails).
5.  **Feature Selection**: Prepares the feature matrix (handling categorical encoding).
6.  **Model Training**: Trains XGBoost, LightGBM, and Random Forest models (performing an ablation study on distance features).
7.  **Evaluation**: Compares models based on R², MAE, and RMSE.

### 4. Random Seed

For reproducibility, a `random_state=42` is used across train/test splits and model initialization (XGBoost, LightGBM, Random Forest).
