@echo off
title FreelanceHub Launcher
echo ================================================================
echo           FreelanceHub - Starting Full-Stack Application
echo ================================================================
echo.

echo [1/3] Starting Backend API Server (Port 5000)...
start "FreelanceHub Backend (Port 5000)" cmd /k "cd /d %~dp0server && npm start"

echo [2/3] Starting Frontend React App (Port 5173)...
start "FreelanceHub Frontend (Port 5173)" cmd /k "cd /d %~dp0client && npm run dev"

echo [3/3] Waiting 4 seconds for servers to initialize...
timeout /t 4 /nobreak >nul

echo.
echo Opening Web Browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ================================================================
echo   Both Servers are now running!
echo   - Backend API:  http://localhost:5000
echo   - Frontend App: http://localhost:5173
echo.
echo   To STOP the application, simply close the two command windows.
echo ================================================================
pause
