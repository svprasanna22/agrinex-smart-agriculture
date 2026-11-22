# PowerShell Launcher for Hybrid AI Framework for Smart Agriculture
Write-Host "===============================================================================" -ForegroundColor Green
Write-Host "  AGRINEX SMART AGRICULTURE DECISION PLATFORM" -ForegroundColor Cyan
Write-Host "  Using Explainable AI, Federated Learning, and Edge Computing" -ForegroundColor Cyan
Write-Host "===============================================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Launching Backend Server (FastAPI on http://127.0.0.1:8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\agri\backend; python run_backend.py"

Start-Sleep -Seconds 3

Write-Host "Launching Frontend Server (Vite on http://localhost:5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\agri\frontend; npm run dev"

Write-Host ""
Write-Host "===============================================================================" -ForegroundColor Green
Write-Host "  Both services launched in background windows." -ForegroundColor White
Write-Host "  Dashboard: http://localhost:5173" -ForegroundColor Green
Write-Host "  API Docs:  http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host "===============================================================================" -ForegroundColor Green

