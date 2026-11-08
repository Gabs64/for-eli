@echo off
echo ========================================================
echo   Starting Virtual Note Jar for Eli...
echo   Open your browser at: http://localhost:8080
echo   Press Ctrl+C to stop the server when done.
echo ========================================================
start http://localhost:8080
python -m http.server 8080
pause

