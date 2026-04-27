# How to Host Your Airbnb Price Predictor

This project has two parts that need to be hosted separately:
1.  **Frontend (Next.js)** -> Host on **Vercel**
2.  **Backend (FastAPI)** -> Host on **Render**

## Prerequisites
- Push your code to a GitHub repository.

## Step 1: Deploy Backend (Render)
1.  Go to [dashboard.render.com](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  Select the repository `PROJECT-2` (or whatever you named it).
5.  **Important Settings**:
    -   **Root Directory**: `backend` (This is crucial!)
    -   **Runtime**: `Python 3`
    -   **Build Command**: `pip install -r requirements.txt`
    -   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6.  Click **Create Web Service**.
7.  Wait for it to deploy. Once done, copy the URL (e.g., `https://airbnb-backend.onrender.com`).

## Step 2: Deploy Frontend (Vercel)
1.  Go to [vercel.com](https://vercel.com/) and log in.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Important Settings**:
    -   **Framework Preset**: Next.js (Should auto-detect).
    -   **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**:
    -   You need to tell the frontend where the backend is.
    -   Add a variable named `NEXT_PUBLIC_API_URL`.
    -   Value: `https://airbnb-backend.onrender.com` (The URL from Step 1).
    -   *Note: Ensure there is no trailing slash `/` at the end of the URL.*
6.  Click **Deploy**.

## Troubleshooting
-   **Backend Logs**: If the backend fails, check the "Logs" tab in Render.
-   **CORS Error**: If the frontend can't talk to the backend, make sure your `main.py` allows the Vercel domain in `CORSMiddleware`. Currently, it allows `*` (all origins), which is fine for now but insecure for production.
