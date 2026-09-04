from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from home.models import UserProfile, Category, Expense, Income, Budget, Goal, Reminder
import datetime
import random


CATEGORIES = [
    {'name': 'Food & Dining',    'icon': 'restaurant-outline',   'color': '#FF6B6B', 'type': 'Expense'},
    {'name': 'Transport',        'icon': 'car-outline',           'color': '#4ECDC4', 'type': 'Expense'},
    {'name': 'Housing',          'icon': 'home-outline',          'color': '#7F56D9', 'type': 'Expense'},
    {'name': 'Health',           'icon': 'medkit-outline',        'color': '#45B7D1', 'type': 'Expense'},
    {'name': 'Entertainment',    'icon': 'game-controller-outline','color': '#F7B731', 'type': 'Expense'},
    {'name': 'Shopping',         'icon': 'bag-outline',           'color': '#FD9644', 'type': 'Expense'},
    {'name': 'Education',        'icon': 'book-outline',          'color': '#26DE81', 'type': 'Expense'},
    {'name': 'Utilities',        'icon': 'flash-outline',         'color': '#FC5C65', 'type': 'Expense'},
    {'name': 'Salary',           'icon': 'cash-outline',          'color': '#26DE81', 'type': 'Income'},
    {'name': 'Freelance',        'icon': 'laptop-outline',        'color': '#45B7D1', 'type': 'Income'},
    {'name': 'Investment',       'icon': 'trending-up-outline',   'color': '#F7B731', 'type': 'Income'},
    {'name': 'Business',         'icon': 'briefcase-outline',     'color': '#7F56D9', 'type': 'Income'},
]


class Command(BaseCommand):
    help = 'Seeds the database with default categories and test accounts'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.MIGRATE_HEADING('Seeding categories...'))
        cat_objs = {}
        for c in CATEGORIES:
            obj, created = Category.objects.get_or_create(
                name=c['name'], type=c['type'],
                defaults={'icon': c['icon'], 'color': c['color']}
            )
            cat_objs[c['name']] = obj
            if created:
                self.stdout.write(f"  Created category: {c['name']}")

        self.stdout.write(self.style.MIGRATE_HEADING('Creating test accounts...'))

        # Test user 1: testuser
        user1, created = User.objects.get_or_create(username='testuser', defaults={
            'email': 'testuser@example.com', 'first_name': 'Alex', 'last_name': 'Johnson'
        })
        if created:
            user1.set_password('Test@1234')
            user1.save()
            UserProfile.objects.create(user=user1, profession='Employee', income=75000, Savings=15000, currency='USD')
            self.stdout.write(f"  Created user: testuser / Test@1234")
        else:
            self.stdout.write(f"  User testuser already exists")

        # Test user 2: admin
        user2, created = User.objects.get_or_create(username='demo', defaults={
            'email': 'demo@example.com', 'first_name': 'Sam', 'last_name': 'Rivera'
        })
        if created:
            user2.set_password('Demo@1234')
            user2.save()
            UserProfile.objects.create(user=user2, profession='Business', income=120000, Savings=30000, currency='USD')
            self.stdout.write(f"  Created user: demo / Demo@1234")
        else:
            self.stdout.write(f"  User demo already exists")

        # Seed sample data for testuser
        if not Expense.objects.filter(user=user1).exists():
            self.stdout.write(self.style.MIGRATE_HEADING('Seeding sample expenses for testuser...'))
            today = datetime.date.today()
            expense_cats = [c for c in CATEGORIES if c['type'] == 'Expense']
            payments = ['Cash', 'Card', 'Online', 'UPI']
            sample_expenses = [
                ('Morning Coffee',   12.50,  'Food & Dining',  0),
                ('Uber Ride',        25.00,  'Transport',      1),
                ('Netflix',          15.99,  'Entertainment',  2),
                ('Grocery Store',    89.40,  'Food & Dining',  3),
                ('Electric Bill',   120.00,  'Utilities',      4),
                ('Gym Membership',   45.00,  'Health',         5),
                ('Amazon Order',     67.80,  'Shopping',       6),
                ('Restaurant Lunch', 34.00,  'Food & Dining',  7),
                ('Bus Pass',         40.00,  'Transport',      8),
                ('Online Course',    29.99,  'Education',      9),
                ('Rent Payment',   1200.00,  'Housing',        10),
                ('Pharmacy',         18.50,  'Health',         11),
                ('Movie Tickets',    24.00,  'Entertainment',  15),
                ('Supermarket',     110.00,  'Food & Dining',  18),
                ('Fuel',             55.00,  'Transport',      20),
                ('Internet Bill',    49.99,  'Utilities',      22),
                ('Clothing Store',   75.00,  'Shopping',       25),
                ('Doctor Visit',     80.00,  'Health',         28),
            ]
            for title, amount, cat_name, days_ago in sample_expenses:
                Expense.objects.create(
                    user=user1,
                    title=title,
                    amount=amount,
                    category=cat_objs.get(cat_name),
                    date=today - datetime.timedelta(days=days_ago),
                    payment_method=random.choice(payments),
                )

            # Sample income
            Income.objects.create(user=user1, source='Monthly Salary', amount=6250.00,
                                  date=today.replace(day=1))
            Income.objects.create(user=user1, source='Freelance Project', amount=850.00,
                                  date=today - datetime.timedelta(days=10))

            # Sample budgets
            Budget.objects.get_or_create(user=user1, category=cat_objs['Food & Dining'],
                month=today.month, year=today.year, defaults={'limit_amount': 500})
            Budget.objects.get_or_create(user=user1, category=cat_objs['Transport'],
                month=today.month, year=today.year, defaults={'limit_amount': 200})
            Budget.objects.get_or_create(user=user1, category=cat_objs['Entertainment'],
                month=today.month, year=today.year, defaults={'limit_amount': 100})

            # Sample goals
            Goal.objects.create(user=user1, name='Emergency Fund', target_amount=10000,
                current_amount=3500, end_date=today + datetime.timedelta(days=180))
            Goal.objects.create(user=user1, name='Vacation to Europe', target_amount=5000,
                current_amount=1200, end_date=today + datetime.timedelta(days=270))

            # Sample reminders
            Reminder.objects.create(user=user1, title='Rent Payment', category=cat_objs['Housing'],
                amount=1200, date=today.replace(day=1) + datetime.timedelta(days=32),
                frequency='Monthly', status='Pending')
            Reminder.objects.create(user=user1, title='Netflix Subscription', category=cat_objs['Entertainment'],
                amount=16, date=today + datetime.timedelta(days=5),
                frequency='Monthly', status='Pending')

        self.stdout.write(self.style.SUCCESS('\nOK Seed data loaded successfully!'))
        self.stdout.write(self.style.SUCCESS('  testuser / Test@1234'))
        self.stdout.write(self.style.SUCCESS('  demo     / Demo@1234'))
