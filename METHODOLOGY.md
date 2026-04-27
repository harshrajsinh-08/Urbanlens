# 🎓 AirML: Scientific Methodology & System Architecture

This document provides a comprehensive technical explanation of every metric, insight, and interactive component within the AirML platform. 

---

## 1. 🏗️ Core ML Foundation: The Pricing Engine
At the heart of the system is a **High-Performance Gradient Boosted Tree (XGBoost)** trained on over 15,000 London properties.

*   **Prediction Target**: The model predicts the `Log(Price)` of a listing to handle the high variance of London's real estate market (Hedonic Pricing).
*   **Optimal Price**: Calculated as `exp(prediction) - 1`. This value represents the **Market Equilibrium Price** based on over 50 features (amenities, location, capacity).
*   **Feature Importance (SHAP)**: We use **SHAP (SHapley Additive exPlanations)** values to break down exactly *why* a price was predicted. 
    *   *Calculation*: Each SHAP value represents the marginal contribution of a feature (e.g., "Full Kitchen") to the base price in GBP.

---

## 2. 📍 Neighborhood Intelligence (Hedonic + SHAP)
The "Location Score" (e.g., 8.5/10) is a research-grade metric derived from spatial econometrics.

*   **Isolating Location**: We fix all non-spatial features (bedrooms, room type) to their regional medians and vary *only* the geographical attributes (distance to landmarks, amenity density).
*   **The Calculation**:
    1.  **Spatial Impact**: Sum of SHAP values for all `spatial_*` features.
    2.  **Normalization**: We compute a Z-score relative to 10,000 random London points.
    3.  **UI Mapping**: The Z-score is passed through a **Sigmoid Floor Function**:
        $$Score = 4.0 + \frac{5.9}{1 + e^{-Z}}$$
        This ensures even remote areas (like Enfield) get a "fair" score (~4.0) while prime areas (Westminster) hit 9.9.

---

## 3. 📈 Market Absorption Model: Booking Insights
These features use a **Behavioral Economics** approach to predict how travelers will react to your price.

### A. Likelihood to Book (%)
We use a **Price Elasticity Curve**.
*   **Logic**: As the distance between your *Actual Price* and the *AI-Predicted Optimal Price* increases, the probability of a booking decays logistically.
*   **Formula**: $$P = \frac{1}{1 + e^{-(k \cdot Z + \alpha)}}$$
    *   $Z$ = Z-score of your price vs the local market mean.
    *   $\alpha$ = Quality bonus (based on your Neighborhood Score).

### B. Est. Days to Book (ETTT)
Defined as the **Expected Time-to-Transaction**.
*   **Calculation**: We take a baseline of 4.5 days (for a perfectly priced property) and divide it by the probability raised to the power of 0.7 ($P^{0.7}$). Overpriced properties are mathematically "clamped" at 45 days to reflect market stagnation.

---

## 4. 🏘️ Comparative Analysis: Peer Benchmarking
How we compare a property to its neighbors.

*   **Market Position**: We use `scipy.stats.percentileofscore` to rank the listing's price and quality against every other active listing in its specific neighborhood.
*   **Direct Competitors**: The system uses a **KD-Tree (Spatial Index)** to perform a 3-dimensional search (Lat, Lon, Room Type) to find the 100 most relevant direct competitors.

---

## 5. 🏥 Market Data & Trends
*   **Demand Level**: Calculated using the **Inverse Absorption Ratio**. High views + Low Time-to-Book = High Demand.
*   **Occupancy Rate**: Derived mathematically from the `availability_365` metric:
    $$Rate = \frac{365 - \text{Available Days}}{365}$$
*   **Market Trend**: Determined by comparing the **Neighborhood Mean** vs. the **Neighborhood Median**. A mean significantly higher than the median identifies a "rising" luxury segment.

---

## 6. 📍 Spatial Snapshot (Nearby Places)
Instead of relying on slow external APIs, the system uses a **Synchronized POI Database**.
*   **KD-Tree Search**: Performs microscopic spatial queries (within 500m to 2km) across categories (Restaurants, Cafes, Transit, Culture).
*   **Distance calculation**: Uses the **Haversine Formula** to provide precise distance measurements between the property and local landmarks.

---

## 7. 🚀 System Performance: The "Silent" Tech
*   **Startup Scoring**: The system calculates 15,000 location scores once at startup (using **Vectorized Numpy**) and caches them. This provides sub-millisecond response times for the UI.
*   **Async Processing**: All heavy calculations run in background threads to ensure the dashboard remains interactive even during high-load periods.
