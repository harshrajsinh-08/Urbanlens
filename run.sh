#!/bin/bash



echo "🚀 Starting Full Stack Application..."
echo ""


cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    
    lsof -ti :8000 | xargs kill -9 2>/dev/null
    exit
}


trap cleanup SIGINT SIGTERM


echo "🧹 Cleaning up existing ports..."
lsof -ti :8000 | xargs kill -9 2>/dev/null
lsof -ti :3000 | xargs kill -9 2>/dev/null


echo "⚙️ Starting FastAPI backend server..."
cd backend

./venv/bin/python3 -m uvicorn main:app --reload --port 8000 > backend.log 2>&1 &
BACKEND_PID=$!
cd ..


sleep 2

echo "✅ Backend starting on http://localhost:8000"
echo ""


echo "🎨 Starting frontend Next.js server..."
echo "📍 Frontend will be available at: http://localhost:3000"
echo ""

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
npm run dev
