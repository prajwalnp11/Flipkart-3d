#!/usr/bin/env bash
# Render deployment build script for Flipkart 3D Backend
set -o errexit

echo "==> Installing Python dependencies..."
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt

echo "==> Running Django database migrations..."
python backend/manage.py migrate --noinput

echo "==> Seeding Flipkart 3D mall data..."
python backend/manage.py seed_demo

echo "==> Collecting static assets for Whitenoise..."
python backend/manage.py collectstatic --noinput

echo "==> Backend build completed successfully!"
