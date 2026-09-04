#!/usr/bin/env bash
# build_files.sh — Vercel build script for Django
# Runs during Vercel's build phase to collect static files

set -e

echo "==> Installing Python dependencies..."
pip install -r requirements.txt --break-system-packages

echo "==> Setting up Django for collectstatic..."
cd backend
python manage.py collectstatic --noinput --settings=core.settings
cd ..

echo "==> Copying static files to staticfiles_build/ for Vercel..."
mkdir -p staticfiles_build
cp -r backend/staticfiles/. staticfiles_build/

echo "==> Build complete."
