from django.contrib import admin
from .models import UserProfile, Category, Expense, Income, Budget, Goal, Reminder


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'profession', 'income', 'Savings', 'currency']
    search_fields = ['user__username', 'user__email']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'icon', 'color']
    list_filter = ['type']


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'amount', 'category', 'date', 'payment_method']
    list_filter  = ['category', 'payment_method', 'date']
    search_fields = ['title', 'user__username']
    date_hierarchy = 'date'


@admin.register(Income)
class IncomeAdmin(admin.ModelAdmin):
    list_display  = ['user', 'source', 'amount', 'date']
    search_fields = ['source', 'user__username']
    date_hierarchy = 'date'


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ['user', 'category', 'limit_amount', 'month', 'year']
    list_filter  = ['month', 'year']


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'target_amount', 'current_amount', 'end_date']


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'amount', 'date', 'frequency', 'status']
    list_filter  = ['status', 'frequency']
