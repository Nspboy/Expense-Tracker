from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import (
    ExpenseViewSet, CategoryViewSet, IncomeViewSet,
    BudgetViewSet, FinanceSummaryViewSet, register_user,
    GoalViewSet, ReminderViewSet, UserProfileViewSet
)
from .views import (
    # Auth
    register_view, login_view, logout_view,
    # Pages
    dashboard_view, expenses_view, income_view,
    budgets_view, goals_view, reminders_view,
    analytics_view, profile_view,
    # Expense AJAX
    expense_add, expense_edit, expense_delete, expense_detail,
    # Income AJAX
    income_add, income_edit, income_delete, income_detail,
    # Budget AJAX
    budget_add, budget_delete,
    # Goal AJAX
    goal_add, goal_update, goal_delete, goal_detail,
    # Reminder AJAX
    reminder_add, reminder_toggle, reminder_delete,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# ── REST API Router ───────────────────────────
router = DefaultRouter()
router.register(r'expenses',   ExpenseViewSet,        basename='expense')
router.register(r'categories', CategoryViewSet,       basename='category')
router.register(r'income',     IncomeViewSet,         basename='income')
router.register(r'budgets',    BudgetViewSet,         basename='budget')
router.register(r'goals',      GoalViewSet,           basename='goal')
router.register(r'reminders',  ReminderViewSet,       basename='reminder')
router.register(r'profile',    UserProfileViewSet,    basename='profile')
router.register(r'summary',    FinanceSummaryViewSet, basename='summary')

urlpatterns = [
    # ── Auth ──────────────────────────────────
    path('register/',  register_view, name='register'),
    path('login/',     login_view,    name='login'),
    path('logout/',    logout_view,   name='logout'),

    # ── Template Pages ────────────────────────
    path('',           dashboard_view, name='dashboard'),
    path('expenses/',  expenses_view,  name='expenses'),
    path('income/',    income_view,    name='income'),
    path('budgets/',   budgets_view,   name='budgets'),
    path('goals/',     goals_view,     name='goals'),
    path('reminders/', reminders_view, name='reminders'),
    path('analytics/', analytics_view, name='analytics'),
    path('profile/',   profile_view,   name='profile'),

    # ── Expense AJAX ─────────────────────────
    path('expenses/add/',           expense_add,    name='expense_add'),
    path('expenses/<int:pk>/',      expense_detail, name='expense_detail'),
    path('expenses/<int:pk>/edit/', expense_edit,   name='expense_edit'),
    path('expenses/<int:pk>/delete/', expense_delete, name='expense_delete'),

    # ── Income AJAX ──────────────────────────
    path('income/add/',             income_add,    name='income_add'),
    path('income/<int:pk>/',        income_detail, name='income_detail'),
    path('income/<int:pk>/edit/',   income_edit,   name='income_edit'),
    path('income/<int:pk>/delete/', income_delete, name='income_delete'),

    # ── Budget AJAX ──────────────────────────
    path('budgets/add/',              budget_add,    name='budget_add'),
    path('budgets/<int:pk>/delete/',  budget_delete, name='budget_delete'),

    # ── Goal AJAX ────────────────────────────
    path('goals/add/',              goal_add,    name='goal_add'),
    path('goals/<int:pk>/',         goal_detail, name='goal_detail'),
    path('goals/<int:pk>/update/',  goal_update, name='goal_update'),
    path('goals/<int:pk>/delete/',  goal_delete, name='goal_delete'),

    # ── Reminder AJAX ────────────────────────
    path('reminders/add/',               reminder_add,    name='reminder_add'),
    path('reminders/<int:pk>/toggle/',   reminder_toggle, name='reminder_toggle'),
    path('reminders/<int:pk>/delete/',   reminder_delete, name='reminder_delete'),

    # ── REST API Endpoints ────────────────────
    path('api/',                include(router.urls)),
    path('api/token/',          TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/',  TokenRefreshView.as_view(),    name='token_refresh'),
    path('api/register/',       register_user,                 name='api_register'),
]
