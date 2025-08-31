@echo off
echo.
echo ========================================
echo   Pelito Platform - One Year Seeder
echo ========================================
echo.
echo This script will generate comprehensive test data
echo for the entire platform including 365 days of data.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo Starting data generation...
echo.

node scripts/runOneYearSeeder.js

echo.
echo Press any key to exit...
pause >nul



