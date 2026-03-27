#!/bin/bash

# PreNeuro Deployment Verification Script

echo "🚀 PreNeuro Deployment Verification"
echo "===================================="
echo ""

# Check if URLs are provided
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./verify-deployment.sh <BACKEND_URL> <FRONTEND_URL>"
    echo "Example: ./verify-deployment.sh https://api.railway.app https://app.vercel.app"
    exit 1
fi

BACKEND_URL=$1
FRONTEND_URL=$2

echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Test backend health
echo "1. Testing backend health..."
HEALTH=$(curl -s "$BACKEND_URL/api/health" | grep -o "healthy" || echo "failed")
if [ "$HEALTH" = "healthy" ]; then
    echo "   ✅ Backend is healthy"
else
    echo "   ❌ Backend health check failed"
    exit 1
fi

# Test backend API docs
echo "2. Testing API documentation..."
DOCS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/docs")
if [ "$DOCS" = "200" ]; then
    echo "   ✅ API docs accessible"
else
    echo "   ❌ API docs not accessible (status: $DOCS)"
fi

# Test patients endpoint
echo "3. Testing patients endpoint..."
PATIENTS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/patients")
if [ "$PATIENTS" = "200" ]; then
    echo "   ✅ Patients endpoint working"
else
    echo "   ❌ Patients endpoint failed (status: $PATIENTS)"
fi

# Test frontend
echo "4. Testing frontend..."
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$FRONTEND" = "200" ]; then
    echo "   ✅ Frontend is accessible"
else
    echo "   ❌ Frontend not accessible (status: $FRONTEND)"
fi

echo ""
echo "===================================="
echo "🎉 Deployment verification complete!"
echo ""
echo "Next steps:"
echo "1. Visit your frontend: $FRONTEND_URL"
echo "2. Try creating a patient"
echo "3. Check API docs: $BACKEND_URL/docs"
