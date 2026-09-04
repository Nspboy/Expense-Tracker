"""
WSGI config for ExpenseTracker project.

Vercel runs this file from the project root, not from backend/.
We add backend/ to sys.path so 'core.settings' can be imported correctly.
"""

import os
import sys
import shutil

# Ensure backend/ is on the Python path (needed when run from project root on Vercel)
_backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

# Vercel's filesystem is read-only except for /tmp.
# We copy the bundled SQLite database to /tmp so Django can read/write it.
if os.environ.get('VERCEL') == '1':
    db_source = os.path.join(_backend_dir, 'db.sqlite3')
    db_dest = '/tmp/db.sqlite3'
    if os.path.exists(db_source) and not os.path.exists(db_dest):
        shutil.copy2(db_source, db_dest)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
