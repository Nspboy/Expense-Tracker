from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Sum
from .models import UserProfile, Category, Expense, Income, Budget, Reminder, Goal

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Allow updates to user fields

    class Meta:
        model = UserProfile
        fields = ['profession', 'Savings', 'income', 'currency', 'theme', 'user']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user = instance.user
            user.email = user_data.get('email', user.email)
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.save()
        
        return super().update(instance, validated_data)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']

class GoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = '__all__'

    def get_progress_percentage(self, obj):
        if obj.target_amount == 0:
            return 0
        return min(int((obj.current_amount / obj.target_amount) * 100), 100)

class ReminderSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    class Meta:
        model = Reminder
        fields = '__all__'

class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    consumed_amount = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = '__all__'

    def get_consumed_amount(self, obj):
        result = Expense.objects.filter(
            user=obj.user,
            category=obj.category,
            date__month=obj.month,
            date__year=obj.year
        ).aggregate(total=Sum('amount'))['total']
        return result or 0
