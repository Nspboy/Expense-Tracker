"""
Django settings for ExpenseTracker project.

Environment-aware: works locally (dev) and on Vercel (production).
Set DJANGO_ENV=production in Vercel environment variables.
"""

import os
from pathlib import Path
from django.contrib.messages import constants as messages

# ─────────────────────────────────────────────
# Directory layout
#   BASE_DIR  = backend/
#   ROOT_DIR  = Expense-Tracker/       (project root)
#   FRONTEND_DIR = Expense-Tracker/frontend/
# ─────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BASE_DIR)
_frontend_candidate = os.path.join(ROOT_DIR, 'frontend')

# On Vercel the repo is checked out at /var/task — frontend/ is right next to backend/
# Fall back to a relative path from BASE_DIR if somehow the join is wrong
FRONTEND_DIR = _frontend_candidate if os.path.isdir(_frontend_candidate) else BASE_DIR


# ─────────────────────────────────────────────
# Environment detection
# ─────────────────────────────────────────────
IS_PRODUCTION = os.environ.get('DJANGO_ENV', 'development') == 'production'
ON_VERCEL = os.environ.get('VERCEL', '') == '1'

# ─────────────────────────────────────────────
# Security
# ─────────────────────────────────────────────
SECRET_KEY = os.environ.get(
    'SECRET_KEY',
    '4--(d0^o%3vqt#-c(hf+8)a$95z8gbo57xol5pft!%xpve9_zd'  # override in production!
)

DEBUG = not IS_PRODUCTION

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.vercel.app',           # all *.vercel.app domains
    '.now.sh',
]
# Allow any additional host set via environment variable (e.g. custom domain)
_extra_host = os.environ.get('ALLOWED_HOST', '')
if _extra_host:
    ALLOWED_HOSTS.append(_extra_host)

# ─────────────────────────────────────────────
# Application definition
# ─────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'home.apps.HomeConfig',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',   # serve static files in production
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # Templates live in frontend/templates/
        'DIRS': [os.path.join(FRONTEND_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                # Injects currency_symbol (₹ by default) into every template
                'home.context_processors.currency',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# ─────────────────────────────────────────────
# Database
# ─────────────────────────────────────────────
if ON_VERCEL:
    # Vercel's filesystem is read-only except /tmp
    # Use /tmp for SQLite so Django can migrate and write
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': '/tmp/db.sqlite3',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }

# ─────────────────────────────────────────────
# Password validation
# ─────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ─────────────────────────────────────────────
# Internationalisation
# ─────────────────────────────────────────────
LANGUAGE_CODE = 'en-in'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# ─────────────────────────────────────────────
# Static files
# ─────────────────────────────────────────────
STATIC_URL = '/static/'

# Source directory for development static files
STATICFILES_DIRS = [
    os.path.join(FRONTEND_DIR, 'static'),
]

# Output directory for collectstatic (used in production / Vercel build)
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# In development, tell WhiteNoise to serve directly from STATICFILES_DIRS and auto-refresh
if not IS_PRODUCTION:
    WHITENOISE_USE_FINDERS = True
    WHITENOISE_AUTOREFRESH = True

# WhiteNoise: compress & cache static files forever in production
STATICFILES_STORAGE = (
    'whitenoise.storage.CompressedManifestStaticFilesStorage'
    if IS_PRODUCTION
    else 'django.contrib.staticfiles.storage.StaticFilesStorage'
)

# ─────────────────────────────────────────────
# Media files
# ─────────────────────────────────────────────
MEDIA_ROOT = os.path.join(FRONTEND_DIR, 'static', 'img')
MEDIA_URL = '/img/'

# ─────────────────────────────────────────────
# Auth redirect URLs
# ─────────────────────────────────────────────
LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/login/'

# ─────────────────────────────────────────────
# Messages
# ─────────────────────────────────────────────
MESSAGE_TAGS = {
    messages.ERROR: 'danger',
}

# ─────────────────────────────────────────────
# Email (configure via environment variables)
# ─────────────────────────────────────────────
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')

# ─────────────────────────────────────────────
# Django REST Framework + JWT
# ─────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ─────────────────────────────────────────────
# CORS
# ─────────────────────────────────────────────
CORS_ALLOW_ALL_ORIGINS = True  # Tighten in production by listing origins

# ─────────────────────────────────────────────
# CSRF trusted origins (required on Vercel)
# ─────────────────────────────────────────────
CSRF_TRUSTED_ORIGINS = [
    'https://*.vercel.app',
    'https://*.now.sh',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]
