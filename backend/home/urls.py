from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import (
    ExpenseViewSet, CategoryViewSet, IncomeViewSet, 
    BudgetViewSet, FinanceSummaryViewSet, register_user,
    GoalViewSet, ReminderViewSet, UserProfileViewSet
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'income', IncomeViewSet, basename='income')
router.register(r'budgets', BudgetViewSet, basename='budget')
router.register(r'goals', GoalViewSet, basename='goal')
router.register(r'reminders', ReminderViewSet, basename='reminder')
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'summary', FinanceSummaryViewSet, basename='summary')

urlpatterns = [
    # REST API Endpoints
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', register_user, name='api_register'),
]
