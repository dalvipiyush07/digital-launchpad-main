@echo off
echo ========================================
echo   Starting Cloud Build Servers
echo ========================================
echo.

echo Starting Admin Server on port 8081...
start cmd /k "cd admin && node server.js"

timeout /t 3 /nobreak > nul

echo Starting Main Website on port 8080...
start cmd /k "npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo   Admin Panel: http://localhost:8081
echo   Main Website: http://localhost:8080
echo ========================================
echo.
pause
