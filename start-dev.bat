@echo off
echo 🎬 Starting FrameFetch Development Environment...
echo.

echo 📦 Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo 🐍 Installing backend dependencies...
cd backend
call pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo 🚀 Starting development servers...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start both servers
start "FrameFetch Frontend" cmd /k "npm run dev"
start "FrameFetch Backend" cmd /k "npm run backend"

echo ✅ Development servers started!
echo Check the browser at http://localhost:3000
pause