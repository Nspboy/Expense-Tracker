# Expense Tracker Pro 🚀

A premium, full-stack financial management system built with a **Decoupled Architecture**. This project features a high-performance **React** frontend and a robust **Django REST Framework** backend.

---

## 🏗️ Technical Architecture

This project follows industrial standards with a strict separation of concerns:

- **Frontend**: A modern Single Page Application (SPA) built with Vite, React, and TanStack Query.
- **Backend**: A stateless REST API powered by Django and JWT Authentication.
- **Database**: SQLite3 (Production-ready for small to medium scale).

---

## ✨ Key Features

- **Dashboard**: Real-time financial summaries and recent transaction insights.
- **Expense/Income Management**: Advanced CRUD operations with searchable and filterable tables.
- **Budget Tracking**: Visual progress bars and automated budget vs. actuals analysis.
- **Financial Reports**: Monthly trend analysis with dynamic Chart.js visualizations.
- **Premium UI**: Dark mode support, glassmorphic elements, and smooth Framer Motion animations.
- **JWT Security**: Professional authentication flow with access and refresh tokens.

---

## 🚀 Getting Started

### 1. Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies: `pip install -r ../requirements.txt`.
3. Run migrations: `python manage.py migrate`.
4. Start the server: `python manage.py runserver`.

### 2. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.

---n

## 📁 Repository Structure

```text
root/
├── backend/            # Django REST API (Stateless)
│   ├── core/           # Main project configuration
│   ├── home/           # Financial business logic & models
│   └── manage.py       # Django CLI
├── frontend/           # React SPA (Vite)
│   ├── src/            # Components, Pages, and Logic
│   └── public/         # Static assets
├── requirements.txt    # Unified Python dependencies
└── .gitignore          # Professional exclusion patterns
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Framer Motion, Chart.js, Lucide Icons |
| **Backend** | Django 5.x, Django REST Framework, JWT |
| **Data** | SQLite3, TanStack Query |
| **Styling** | Modern Vanilla CSS (Global Design System) |

---

## 🛡️ License

*Standard MIT License*
