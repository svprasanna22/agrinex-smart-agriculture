@echo off
title Hybrid AI Framework for Smart Agriculture
echo ===============================================================================
echo   AGRINEX SMART AGRICULTURE DECISION PLATFORM
echo   Using Explainable AI, Federated Learning, and Edge Computing
echo ===============================================================================
echo.
echo Starting FastAPI Backend Server on port 8000...
start "Agri-AI Backend" cmd /k "cd /d C:\agri\backend && python run_backend.py"

timeout /t 3 /nobreak >nul

echo Starting React Vite Frontend Server on port 5173...
start "Agri-AI Frontend" cmd /k "cd /d C:\agri\frontend && npm run dev"

echo.
echo ===============================================================================
echo   Servers launched successfully!
echo   Frontend Dashboard: http://localhost:5173
echo   Backend REST API:   http://localhost:8000/docs
echo ===============================================================================
echo.
pause

