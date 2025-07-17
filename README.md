# Expense Tracker

A Django-based web application for tracking personal expenses and income, designed to help users manage their finances, analyze spending habits, and visualize financial statistics.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication:** Register, login, and manage user profiles.
- **Expense & Income Tracking:** Add, edit, and delete financial records categorized by type (Expense/Income) and category (Food, Travel, Shopping, Necessities, Entertainment, Other).
- **Categories:** Customizable categories for organizing expenses.
- **Statistics & Reports:** View weekly, monthly, and yearly summaries of spending and savings, including category-wise breakdowns.
- **Visualizations:** Chart views to help visualize income and expense trends.
- **Savings Tracking:** Track user savings and get warnings if expenses exceed savings.
- **Admin Panel:** Manage users and financial records through Django admin.

## Tech Stack

- **Backend:** Python, Django 5.x
- **Database:** SQLite3 (default, configurable)
- **Frontend:** HTML, CSS, JavaScript (custom templates)
- **Other:** Django messages framework, SMTP email support

## Installation

### Prerequisites

- Python 3.8+
- pip
- virtualenv (recommended)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Nspboy/Expense-Tracker.git
   cd Expense-Tracker
   ```

2. **Set Up Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install django
   ```

4. **Apply Migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create Superuser (for admin)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the Development Server**
   ```bash
   python manage.py runserver
   ```

7. **Access the Application**
   - Visit `http://127.0.0.1:8000/` in your browser.

## Usage

- Register as a new user or log in with your credentials.
- Add expenses or income records, selecting appropriate categories.
- View weekly, monthly, or yearly statistics and charts.
- Edit or delete records as needed.
- Visit `/admin` for admin management (login required).

## Screenshots

*Add screenshots of the dashboard, charts, and forms here.*

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License

*Specify license here if applicable.*

---

### Notes

- Static files and templates are configured via Django settings (`settings.py`). Place your static assets and templates in their respective directories as per the configuration.
- Default database is SQLite. You may configure another backend in `settings.py`.
- SMTP settings are available for email; configure your credentials in `settings.py` to enable email features..
