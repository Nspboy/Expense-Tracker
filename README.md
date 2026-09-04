# 💰 Expense Tracker

A full-stack personal finance web application built with **Django**, **SQLite**, **Bootstrap 5**, and **Vanilla JavaScript**.

---

## 🏗 Project Structure

```
Expense-Tracker/
│
├── backend/                          ← Python / Django source (server-side logic)
│   ├── core/                         ← Django project configuration
│   │   ├── settings.py               ← All Django settings (DB, auth, paths)
│   │   ├── urls.py                   ← Root URL dispatcher
│   │   ├── wsgi.py                   ← WSGI entry point
│   │   └── asgi.py                   ← ASGI entry point
│   │
│   ├── home/                         ← Main Django application
│   │   ├── models.py                 ← Database models (Expense, Income, Budget …)
│   │   ├── views.py                  ← Session-based page views + AJAX endpoints
│   │   ├── api_views.py              ← DRF REST API ViewSets (JWT-based)
│   │   ├── serializers.py            ← DRF serializers
│   │   ├── urls.py                   ← App URL patterns (pages + API)
│   │   ├── admin.py                  ← Django admin registrations
│   │   ├── apps.py                   ← App config
│   │   ├── tests.py                  ← Test suite
│   │   ├── migrations/               ← Database migration files
│   │   └── management/
│   │       └── commands/
│   │           └── seed_data.py      ← Seed categories + test accounts
│   │
│   ├── manage.py                     ← Django management CLI
│   ├── db.sqlite3                    ← SQLite database file
│   └── venv/                         ← Python virtual environment
│
├── frontend/                         ← All frontend / UI assets
│   ├── templates/                    ← Django HTML templates (server-rendered)
│   │   ├── base.html                 ← Sidebar layout, Bootstrap 5, Chart.js
│   │   ├── dashboard.html            ← Stat cards + Chart.js visualizations
│   │   ├── expenses.html             ← Filter bar + CRUD table
│   │   ├── income.html               ← Income list + CRUD
│   │   ├── budgets.html              ← Budget progress cards
│   │   ├── goals.html                ← SVG progress rings
│   │   ├── reminders.html            ← Recurring payment tracker
│   │   ├── analytics.html            ← 4-chart analytics dashboard
│   │   ├── profile.html              ← User settings page
│   │   └── auth/
│   │       ├── login.html            ← Session login form
│   │       └── register.html         ← Registration + password strength meter
│   │
│   ├── static/                       ← Static assets served by Django
│   │   ├── css/
│   │   │   └── style.css             ← Dark theme design system (CSS variables)
│   │   └── js/
│   │       └── app.js                ← AJAX CRUD, Chart.js init, modals, filters
│   │
│   └── react/                        ← Vite + React SPA (JWT-based, alternative UI)
│       ├── src/
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   ├── index.css
│       │   ├── api/                  ← Axios API client
│       │   ├── components/           ← Sidebar, Layout, ProtectedRoute …
│       │   ├── context/              ← AuthContext, ToastContext
│       │   ├── hooks/
│       │   └── pages/                ← Dashboard, Expenses, Income, Analytics …
│       ├── public/
│       ├── dist/                     ← Production build output
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
│
├── requirements.txt                  ← Python dependencies
├── pyrightconfig.json                ← Type-checking config
└── README.md                         ← This file
```

---

## 🚀 Quick Start (Django Template UI)

### 1. Set up the virtual environment

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # macOS / Linux
pip install -r ..\requirements.txt
```

### 2. Apply migrations & seed demo data

```bash
python manage.py migrate
python manage.py seed_data
```

### 3. Start the development server

```bash
python manage.py runserver
```

Open **http://127.0.0.1:8000/** in your browser.

---

## 🔑 Demo Accounts

| Username   | Password    | Data          |
|------------|-------------|---------------|
| `testuser` | `Test@1234` | 18 sample expenses, budgets, goals |
| `demo`     | `Demo@1234` | Fresh account |

---

## 📄 Pages

| Page        | URL           | Description                              |
|-------------|---------------|------------------------------------------|
| Dashboard   | `/`           | Stat cards + doughnut & line charts      |
| Expenses    | `/expenses/`  | Filter bar + AJAX CRUD table             |
| Income      | `/income/`    | Income records + CRUD                    |
| Budgets     | `/budgets/`   | Monthly budget progress cards            |
| Goals       | `/goals/`     | Savings goals with SVG progress rings    |
| Reminders   | `/reminders/` | Recurring bill tracker                   |
| Analytics   | `/analytics/` | 4 Chart.js charts (bar, doughnut, line)  |
| Profile     | `/profile/`   | Edit account settings                    |
| Admin       | `/admin/`     | Django admin panel                       |

---

## 🛠 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Backend     | Python 3.11, Django 5.0, SQLite     |
| REST API    | Django REST Framework + JWT         |
| Frontend    | Bootstrap 5, Vanilla JS, Chart.js   |
| React SPA   | Vite + React 18 (in `frontend/react/`) |

---

## 🔌 REST API (JWT)

```
POST  /api/token/          — Obtain JWT token pair
POST  /api/token/refresh/  — Refresh access token
POST  /api/register/       — Register new user

GET/POST   /api/expenses/
GET/POST   /api/income/
GET/POST   /api/budgets/
GET/POST   /api/goals/
GET/POST   /api/reminders/
GET/PATCH  /api/profile/me/
GET        /api/summary/
```

---

## ⚙️ Key Settings (`backend/core/settings.py`)

```python
BASE_DIR     = backend/               # Django project root
ROOT_DIR     = Expense-Tracker/       # Repository root
FRONTEND_DIR = Expense-Tracker/frontend/   # All UI assets

TEMPLATES DIRS      → frontend/templates/
STATICFILES_DIRS    → frontend/static/
DATABASE            → backend/db.sqlite3
```
