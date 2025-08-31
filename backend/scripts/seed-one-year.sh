#!/bin/bash

echo ""
echo "========================================"
echo "  Pelito Platform - One Year Seeder"
echo "========================================"
echo ""
echo "This script will generate comprehensive test data"
echo "for the entire platform including 365 days of data."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js and try again."
    exit 1
fi

# Check if MongoDB is running (optional check)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  Warning: MongoDB daemon not found in PATH"
    echo "Make sure MongoDB is running before proceeding."
    echo ""
fi

echo "Press Enter to continue or Ctrl+C to cancel..."
read -r

echo ""
echo "Starting data generation..."
echo ""

# Run the seeder
node scripts/runOneYearSeeder.js

echo ""
echo "Press Enter to exit..."
read -r



