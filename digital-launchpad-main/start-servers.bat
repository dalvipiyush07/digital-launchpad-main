@echo off
echo ========================================
echo   Cloud Build - Starting Servers
echo ========================================
echo.
echo Main Website: http://localhost:8080
echo Admin Panel:  http://localhost:8081
echo.
echo ========================================
echo.

REM Start main app on port 8080
start "Cloud Build Main App" cmd /k "npm run dev"

REM Wait 3 seconds
timeout /t 3 /nobreak > nul

REM Start admin panel on port 8081
start "Cloud Build Admin Panel" cmd /k "cd admin && npm start"

echo.
echo Both servers are starting...
echo.
echo Press any key to exit this window (servers will keep running)
pause > nul
