#!/bin/bash

# LegalEase AI Startup Script
echo "🚀 Starting LegalEase AI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir uploads
fi

# Create .env files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo "⚙️ Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "📝 Please edit backend/.env and add your OpenAI API key"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚙️ Creating frontend .env file..."
    cp frontend/.env.example frontend/.env
fi

echo "✅ Setup complete!"
echo ""
echo "🔧 To start the application:"
echo "1. Edit backend/.env and add your OpenAI API key (optional but recommended)"
echo "2. Run: npm run dev (from backend directory)"
echo "3. Run: npm start (from frontend directory, in a new terminal)"
echo ""
echo "🌐 Application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo ""
echo "📖 See README.md for detailed instructions"
