"""
serve.py — Production WSGI server using Waitress (Windows-compatible).

Usage:
    cd backend
    ..\backend\venv\Scripts\python.exe serve.py

Waitress replaces Django's built-in dev server and produces NO warnings.
It is safe for production use on Windows.
"""

import os
import sys

# Ensure Django settings are configured
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Add backend/ to sys.path so imports work correctly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from waitress import serve
from core.wsgi import application

HOST = '0.0.0.0'
PORT = 8000
THREADS = 4

if __name__ == '__main__':
    print(f"[Waitress] Starting production server at http://{HOST}:{PORT}/")
    print(f"[Waitress] Threads: {THREADS}")
    print(f"[Waitress] Press Ctrl+C to stop.\n")
    serve(
        application,
        host=HOST,
        port=PORT,
        threads=THREADS,
        channel_timeout=60,
        cleanup_interval=30,
        connection_limit=1000,
    )
