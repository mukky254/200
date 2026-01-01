#!/bin/bash

echo "🚀 FIXING DEPLOYMENT ERRORS..."
echo "================================"

# Fix frontend
cd frontend
echo "1. Cleaning frontend..."
rm -rf node_modules package-lock.json

echo "2. Installing with legacy peer deps..."
npm install --legacy-peer-deps

echo "3. Creating vercel config..."
cat > vercel.json << 'EOF'
{
  "buildCommand": "CI=false npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "create-react-app"
}
EOF

cd ..

# Fix backend
cd backend
echo "4. Cleaning backend..."
rm -rf node_modules package-lock.json

echo "5. Installing backend packages..."
npm install

cd ..

echo "6. Creating production env files..."

# Backend env
cat > backend/.env.production << 'EOF'
MONGODB_URI=mongodb+srv://kaziuser:securepassword123@cluster0.bneqb6q.mongodb.net/attendance?retryWrites=true&w=majority
JWT_SECRET=your_strong_jwt_secret_here_12345
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://in-attendance.vercel.app
EOF

# Frontend env
cat > frontend/.env.production << 'EOF'
REACT_APP_API_URL=https://in-attendance-backend.onrender.com/api
REACT_APP_APP_NAME=IN Attendance System
EOF

echo "✅ ALL FIXES APPLIED!"
echo ""
echo "NEXT STEPS:"
echo "1. Run: git add ."
echo "2. Run: git commit -m 'Fixed deployment errors'"
echo "3. Run: git push origin main"
echo "4. Deploy on Render (backend) and Vercel (frontend)"
