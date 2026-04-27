# 🛠️ UrbanLens: Extreme Backend Deep Dive (`main.py`)

This document provides a line-level technical explanation of the **UrbanLens Backend**. This is intended for those who need to explain the code's mathematical and architectural decisions.

---

## 🏗️ 1. Architecture: The "State" Pattern
The backend uses a global `state` dictionary (Lines 28-41) to manage persistence. 
*   **Why?** Machine Learning models are large (15MB+). If we re-loaded them for every user request, the server would crash. By using a global state, we load the model **once** on startup and reuse it forever.

---

## 📂 2. Data Loading & "Feature Fusion" (`load_data`)
The system performs a "warm-up" on startup (Lines 77-218):
1.  **Merging Data**: It merges a clean ML dataset with a "Raw" Airbnb dataset. This allows us to have host photos and long descriptions while keeping the ML features super-light.
2.  **Spatial Indexing (KD-Tree)**: (Line 58) It builds a `scipy.spatial.KDTree` of all London listings. This allows the backend to find the "nearest neighbor" to any user-clicked GPS coordinate in microseconds.

---

## 📏 3. The Neighborhood Scoring Algorithm (Lines 117-188)
This is the heart of the "Research Grade" label.
*   **SHAP Pipeline**: Instead of manual rules, the system looks at the **total spatial contribution** of a location's features.
*   **Z-Score Normalization**: Because London is highly concentrated, we calculate a Z-Score (how far from the city average a place is).
*   **The Sigmoid Wrap**: (Line 174) `normalized = 4.0 + 5.9 / (1 + np.exp(-z))`.
    *   *Mathematical Intuition:* This "squashes" the data into a professional 4.0 to 10.0 scale. It ensures that even "bad" areas don't get a 0 (which is unrealistic) and "great" areas don't go above 10.

---

## 🧭 4. Coordinate Synchronization (Lines 689-697)
When a user clicks a random spot on the map, we don't have BNG (British National Grid) or LSOA (census) data for that exact point.
*   **Solution:** The system uses the **KD-Tree** to find the nearest real listing. It "steals" that listing's Census and FID data to provide an accurate demographic context for the ML model.

---

## 📉 5. The Prediction Engine (`/predict` & `/analyze-listing`)
*   **Log-Space Conversion**: (Line 736) The model predicts in `log` space (to handle extreme outliers). We use `np.expm1` to turn it back into Pounds (£).
*   **SHAP Price Impact**: (Lines 745-770) To turn the abstract ML "influence numbers" into Pounds, we use:
    `GBP Impact = Predicted_Price * (exp(shap_log_impact) - 1)`
    *   *Why?* This ensures the breakdown values exactly sum up to the total price change.

---

## 🏢 6. Counterfactual Amenity Analysis (Lines 772-808)
This is the logic behind "Adding a Pool adds £20."
*   **Virtual World Simulation:** The system creates a "clone" of the property state, toggles one amenity bit (like `wifi = True`), and re-runs the XGBoost prediction.
*   **Dynamic Weighting:** (Line 655) Different amenities have different "spatial weights." A Pool has a weight of **2.0** (huge impact) while Fast WiFi is **0.5** (expected standard).

---

## 💹 7. Market Velocity Model (Lines 995-1038)
The "Booking Probability" isn't a random number. It uses a **Logistic Growth Curve**:
*   **Surplus Calculation:** We find the difference between the actual price and the "Fair Market Price" predicted by the AI.
*   **Exponential Decay:** If you price your property £20 above the AI's recommendation, your booking probability drops exponentially.
*   **ETTT (Expected Time-to-Transaction):** Calculated by taking the inverse of the probability shifted by a 4.5-day baseline.

---

## 📍 8. POI Search (Lines 503-542)
How do we find "Historic Landmarks"?
*   We use a separate POI database (`pois_database.csv`) and another **KD-Tree Radius Search**.
*   It searches for specific tags (Museum, Theatre, Subway) around the listing's GPS and calculates the Haversine distance to each.

---

## 🛡️ Teacher's "Code Check" Cheat Sheet
*   **SHAP Explosion:** Look for `state['explainer'].shap_values` (Line 739).
*   **KD-Tree Logic:** Search for `KDTree(coords)` (Line 58) and `kdtree.query` (Line 690).
*   **Pydantic Models:** Look at `class PredictionRequest` (Line 631). These ensure the frontend sends the EXACT type of data the backend expects.
