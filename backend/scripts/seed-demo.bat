@echo off
echo.
echo ========================================
echo    Demo Data Seeder for Analytics
echo ========================================
echo.
echo This script will generate realistic demo data
echo for testing your Business Analytics dashboard.
echo.
echo Press any key to continue...
pause >nul

echo.
echo Starting demo data generation...
echo.

node runSeeder.js

echo.
echo Press any key to exit...
pause >nul
