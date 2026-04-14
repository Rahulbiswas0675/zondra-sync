#!/bin/bash

# ZONDRA-WATCHER Deployment Script
echo "🚀 Starting deployment for Zondra-Watcher Dashboard..."

# 1. Navigate to dashboard
cd dashboard

# 2. Build for production
echo "📦 Building React app..."
npm install
npm run build

# 3. Deploy to Firebase
echo "🔥 Deploying to Firebase Hosting..."
firebase deploy --only hosting

# 4. Set up GitHub Actions (Interactive CLI prompt simulation)
echo "💡 To set up GitHub Actions, run: firebase init hosting:github"

echo "✅ Deployment complete!"
