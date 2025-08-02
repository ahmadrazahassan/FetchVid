#!/bin/bash

echo "🎬 Starting FrameFetch Development Environment..."
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo ""
echo "🐍 Installing backend dependencies..."
cd backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

echo ""
echo "🚀 Starting development servers..."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Start frontend in background
npm run dev &
FRONTEND_PID=$!

# Start backend in background  
npm run backend &
BACKEND_PID=$!

echo "✅ Development servers started!"
echo "Check the browser at http://localhost:3000"

# Wait for both processes
wait $FRONTEND_PID $BACKEND_PID