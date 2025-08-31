#!/bin/bash

echo ""
echo "========================================"
echo "    Demo Data Seeder for Analytics"
echo "========================================"
echo ""
echo "This script will generate realistic demo data"
echo "for testing your Business Analytics dashboard."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js and try again."
    exit 1
fi

# Check if MongoDB is running (optional check)
if ! command -v mongosh &> /dev/null; then
    echo "⚠️  Warning: MongoDB shell not found. Make sure MongoDB is running."
    echo ""
fi

echo "🚀 Starting demo data generation..."
echo ""

# Run the seeder
node runSeeder.js

echo ""
echo "✅ Demo data seeding completed!"
echo ""
