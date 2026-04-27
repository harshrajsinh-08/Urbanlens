# 🧠 UrbanLens: Master Technical Guide (Presentation Ready)

This guide provides a "deep dive" into every system in UrbanLens. Use this if your teacher asks for specific code-level logic or mathematical details.

---

## 1. Data Architecture: How is data loaded?
The system doesn't use a hit-and-miss database during the demo; it uses a high-performance **In-Memory Data Store** for speed.

*   **File:** `backend/main.py`
*   **Logic:** When the backend starts, it loads a pre-processed CSV (`listings_with_scores.csv`) into a **Pandas DataFrame**. 
*   **Artifacts:** It also loads pre-trained ML models (`regressor.pkl`), a Scaler (`scaler.pkl`), and a **KD-Tree** (for fast spatial searching) using the `joblib` library.
*   **Why?** Browsing 10,000+ listings would be slow with a traditional SQL database. Loading them into RAM (Memory) makes the search instant.

---

## 2. The Map Engine: How is it working?
The map isn't just a static image; it's a dynamic **React-Leaflet** implementation.

*   **Frontend File:** `components/Map.tsx`
*   **Mechanism:** 
    1.  We use **OpenStreetMap (OSM)** tiles (the "skin" of the map).
    2.  `MarkerClusterer`: Since there are thousands of listings, we group them into "clusters" (showing numbers like 50, 100) and only show individual pins when you zoom in. This prevents the browser from crashing.
    3.  **Cross-Filtering:** When you move the map, the listing list on the home page updates. This is done by checking if the property coordinates (`lat`, `lng`) are within the current map "Bounds" (the visible box).

---

## 3. The Neighborhood Score: How is it calculated?
This is the most "scientific" part of your project. It’s calculated using **Point-in-Polygon** and **Radius Search** logic.

*   **Logic:** For every listing, the engine looks at all nearby amenities within a **1km walking radius**.
*   **The Formula:** 
    `Score = (Transport_Weight * Stops) + (Dining_Weight * Restaurants) + (Green_Weight * Parks)`
*   **Weights:**
    *   **Public Transit (35%):** Highest weight because London traffic makes tube/bus access vital for rental value.
    *   **Safety & Residential (30%):** Derived from area crime stats and street lighting density.
    *   **Amenities (35%):** Number of cafes, supermarkets, and gyms within a 10-minute walk.
*   **Normalization:** We take the raw counts and turn them into a **0–10 scale** using a Min-Max Scaler, so a "9.5/10" means that area is in the top 5% of all London for that category.

---

## 4. AI Insights: How are they calculated?
When you see "Fast WiFi +£14.20", the AI is running a **Counterfactual Simulation**.

*   **The Method:** 
    1.  The system takes the real property data.
    2.  It runs a prediction **without** the amenity (e.g., WiFi = False).
    3.  It runs a second prediction **with** the amenity (e.g., WiFi = True).
    4.  The difference between the two prices is the **Marginal Contribution** of that amenity.
*   **Why it's smart:** It knows that a Pool in a luxury Chelsea mansion adds more value than a Pool in a tiny studio in Croydon. The ML model understands the "context."

---

## 5. Price Prediction Page (SHAP Logic)
The "Factors" you see (like *Distance to Center*) are generated using **SHAP Values**.

*   **Scientific Name:** SHapley Additive exPlanations.
*   **How it works:** It’s based on **Game Theory**. It treats every feature as a "player" in a game and calculates how much each player helped "score" the final price.
*   **Calculation:**
    `Final Price = Base Value (Average London Price) + Effect_1 + Effect_2 + ... + Effect_N`
*   If "Oxford Street Distance" has a SHAP value of +£45, it means being that close to the shopping district boosted the price by exactly £45.

---

## 6. Host Estimator: Revenue & ROI
This tool helps owners make business decisions.

*   **Monthly Revenue:** We calculate this using a **60% Occupancy Assumption**. 
    `Monthly = Predicted_Price * 30 * 0.60`
*   **Uplift Tips:** The system compares the user's property against the **"Top Performers"** in that specific borough. If the top 10% of Westminster properties all have "Air Conditioning" and your input doesn't, the AI flags it as a **"High Value Opportunity."**

---

## 🚀 Presentation Cheat Sheet (Code Locations)
If the teacher says "Show me the code for...", go here:

*   **ML Model & Training:** `ML/final_codes/` (The actual intelligence).
*   **API Logic:** `backend/main.py`.
*   **Smart Predictions:** Look for the `@app.post("/predict")` function in `main.py`.
*   **Amenity Logic:** Look for `apply_amenity_weights` in `main.py`.
*   **Frontend UI:** `app/host/page.jsx` or `app/rooms/[id]/page.jsx`.
