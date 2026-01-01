#!/bin/bash

# Deployment Script for IN Attendance System
echo "🚀 Starting Deployment Process..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Update package.json files
echo -e "\n${YELLOW}Step 1: Updating package.json files...${NC}"
cd frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
cd ..

cd backend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
cd ..

echo -e "${GREEN}✓ Packages updated successfully${NC}"

# Step 2: Create production environment files
echo -e "\n${YELLOW}Step 2: Creating production environment files...${NC}"

# Backend .env.production
cat > backend/.env.production << EOF
MONGODB_URI=mongodb+srv://kaziuser:securepassword123@cluster0.bneqb6q.mongodb.net/attendance?retryWrites=true&w=majority
JWT_SECRET=your_production_jwt_secret_change_this_12345
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://in-attendance-frontend.vercel.app
ADMIN_EMAIL=admin@in.com
ADMIN_PASSWORD=Admin@123
ADMIN_PHONE=+254700000000
QR_CODE_DURATION=60
QR_CODE_SIZE=300
EOF

# Frontend .env.production
cat > frontend/.env.production << EOF
REACT_APP_API_URL=https://in-attendance-backend.onrender.com/api
REACT_APP_APP_NAME=IN Attendance System
REACT_APP_VERSION=1.0.0
REACT_APP_QR_CODE_SIZE=300
REACT_APP_DEFAULT_PAGE_SIZE=20
EOF

echo -e "${GREEN}✓ Environment files created${NC}"

# Step 3: Create deployment configuration files
echo -e "\n${YELLOW}Step 3: Creating deployment configs...${NC}"

# Render config
cat > backend/render.yaml << 'EOF'
services:
  - type: web
    name: in-attendance-backend
    env: node
    region: oregon
    plan: free
    buildCommand: npm install
    startCommand: node server.js
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    autoDeploy: true
EOF

# Vercel config
cat > frontend/vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "devCommand": "npm start",
  "installCommand": "npm install",
  "framework": "create-react-app",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
EOF

echo -e "${GREEN}✓ Deployment configs created${NC}"

# Step 4: Commit changes
echo -e "\n${YELLOW}Step 4: Committing changes to Git...${NC}"
git add .
git commit -m "Deployment ready: Updated packages and configs"
git push origin main

echo -e "${GREEN}✓ Changes committed${NC}"

# Step 5: Display deployment instructions
echo -e "\n${GREEN}✨ DEPLOYMENT INSTRUCTIONS ✨${NC}"
echo "========================================"
echo ""
echo "1. ${YELLOW}BACKEND DEPLOYMENT (Render):${NC}"
echo "   - Go to: https://render.com"
echo "   - Sign up/login with GitHub"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Connect your GitHub repository"
echo "   - Select the backend folder"
echo "   - Configure:"
echo "     • Name: in-attendance-backend"
echo "     • Environment: Node"
echo "     • Build Command: npm install"
echo "     • Start Command: node server.js"
echo "   - Add these environment variables:"
echo "     • MONGODB_URI: mongodb+srv://kaziuser:securepassword123@cluster0.bneqb6q.mongodb.net/attendance?retryWrites=true&w=majority"
echo "     • JWT_SECRET: your_production_jwt_secret_change_this_12345"
echo "     • NODE_ENV: production"
echo "     • FRONTEND_URL: https://in-attendance-frontend.vercel.app"
echo "   - Click 'Create Web Service'"
echo ""
echo "2. ${YELLOW}FRONTEND DEPLOYMENT (Vercel):${NC}"
echo "   - Go to: https://vercel.com"
echo "   - Sign up/login with GitHub"
echo "   - Click 'New Project'"
echo "   - Import your GitHub repository"
echo "   - Configure:"
echo "     • Framework: Create React App"
echo "     • Build Command: npm run build"
echo "     • Output Directory: build"
echo "   - Add these environment variables:"
echo "     • REACT_APP_API_URL: https://your-backend-url.onrender.com/api"
echo "     • REACT_APP_APP_NAME: IN Attendance System"
echo "   - Click 'Deploy'"
echo ""
echo "3. ${YELLOW}TEST THE DEPLOYMENT:${NC}"
echo "   - Backend URL: https://in-attendance-backend.onrender.com"
echo "   - Frontend URL: https://in-attendance-frontend.vercel.app"
echo "   - Test login with:"
echo "     • Admin: admin@in.com / Admin@123"
echo "     • Lecturer: lecturer@in.com / Lecturer@123"
echo "     • Student: student@in.com / Student@123"
echo ""
echo "========================================"
echo -e "${GREEN}✅ Deployment setup complete!${NC}"
