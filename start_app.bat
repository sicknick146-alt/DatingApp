@echo off
echo =========================================
echo       Starting Dating App Servers
echo =========================================

echo.
echo Starting Backend (NestJS)...
start "Backend Server" cmd /c "cd backend && npm run dev"

echo.
echo Starting Frontend (Next.js)...
start "Frontend Server" cmd /c "cd frontend && npm run dev"

echo.
echo Waiting 3 seconds for servers to initialize...
timeout /t 3 /nobreak > NUL

echo.
echo Opening default browser...
start http://localhost:3002

echo.
echo ==============================================================
echo Servers are running in the background.
echo When you are finished, press any key in THIS window to stop them.
echo ==============================================================
pause > NUL

echo.
echo Stopping servers...
taskkill /F /FI "WINDOWTITLE eq Backend Server*" /T > NUL 2>&1
taskkill /F /FI "WINDOWTITLE eq Frontend Server*" /T > NUL 2>&1
echo Servers stopped successfully.
pause
