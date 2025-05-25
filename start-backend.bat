@echo off
echo Starting WealthSage Backend Server...
echo.
echo Make sure you have:
echo 1. Python installed
echo 2. Required packages installed (pip install -r backend/requirements.txt)
echo 3. TAVILY_API_KEY set in .env file
echo.
echo Backend will run on: http://localhost:8000
echo API endpoints: http://localhost:8000/api/opportunities/{category}
echo.
python -m uvicorn backend.app.main:app --reload --port 8000
pause
