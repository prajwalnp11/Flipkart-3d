#!/usr/bin/env bash
# Flipkart 3D Virtual Mall - Startup Script

echo "=========================================="
echo " Starting Flipkart 3D Virtual Shopping Mall"
echo "=========================================="

# Check and activate backend
cd "$(dirname "$0")"

echo "1. Checking Backend Django Server..."
if [ -d "backend/venv" ]; then
    PYTHON_BIN="backend/venv/bin/python"
else
    PYTHON_BIN="python3"
fi

# Apply migrations and seed data
$PYTHON_BIN backend/manage.py migrate --noinput
$PYTHON_BIN backend/seed_data.py

# Start Django in background
echo "Starting Django API server on http://127.0.0.1:8000 ..."
$PYTHON_BIN backend/manage.py runserver 8000 &
DJANGO_PID=$!

# Trap exit to cleanup background processes
trap "kill $DJANGO_PID 2>/dev/null; exit" SIGINT SIGTERM EXIT

# Start Frontend Vite Dev Server
echo "2. Starting Frontend Vite Server on http://localhost:5173 ..."
cd frontend && npm run dev
