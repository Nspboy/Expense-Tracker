from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import Sum
#Create your models here.
SELECT_CATEGORY_CHOICES = [
    ("Food","Food"),
    ("Travel","Travel"),
    ("Shopping","Shopping"),
    ("Necessities","Necessities"),
    ("Entertainment","Entertainment"),
    ("Other","Other")
 ]
ADD_EXPENSE_CHOICES = [
     ("Expense","Expense"),
     ("Income","Income")
 ]
PROFESSION_CHOICES =[
    ("Employee","Employee"),
    ("Business","Business"),
    ("Student","Student"),
    ("Other","Other")
]
class Addmoney_info(models.Model):
    user = models.ForeignKey(User,default = 1, on_delete=models.CASCADE)
    add_money = models.CharField(max_length = 10 , choices = ADD_EXPENSE_CHOICES )
    quantity = models.BigIntegerField()
    Date = models.DateField(default = now)
    Category = models.CharField( max_length = 20, choices = SELECT_CATEGORY_CHOICES , default ='Food')
    payment_method = models.CharField(max_length=20, choices=[('Google Pay', 'Google Pay'), ('Cash', 'Cash'), ('Paytm', 'Paytm'), ('Bank Transfer', 'Bank Transfer')], default='Cash')
    vat_percentage = models.FloatField(default=0.0)
    class Meta:
        db_table = 'addmoney'
        
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profession = models.CharField(max_length=10, choices=PROFESSION_CHOICES, default='Other')
    Savings = models.IntegerField(default=0, null=True, blank=True)
    income = models.BigIntegerField(default=0, null=True, blank=True)
    image = models.ImageField(upload_to='profile_pics', default='default.jpg')
    currency = models.CharField(max_length=5, default='USD')
    theme = models.CharField(max_length=10, default='light')

    def __str__(self):
        return self.user.username

class Category(models.Model):
    TYPE_CHOICES = [('Income', 'Income'), ('Expense', 'Expense')]
    name = models.CharField(max_length=50)
    icon = models.CharField(max_length=50, default='wallet-outline')
    color = models.CharField(max_length=20, default='#7F56D9')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.type})"

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    date = models.DateField(default=now)
    payment_method = models.CharField(max_length=50, default='Cash')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Income(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    source = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField(default=now)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    limit_amount = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.IntegerField()
    year = models.IntegerField()

    class Meta:
        unique_together = ('user', 'category', 'month', 'year')

@receiver(post_save, sender=Expense)
def check_budget_alert(sender, instance, created, **kwargs):
    if created:
        month = instance.date.month
        year = instance.date.year
        budget = Budget.objects.filter(
            user=instance.user,
            category=instance.category,
            month=month,
            year=year
        ).first()

        if budget:
            total_spent = Expense.objects.filter(
                user=instance.user,
                category=instance.category,
                date__month=month,
                date__year=year
            ).aggregate(total=Sum('amount'))['total'] or 0

            if total_spent > budget.limit_amount:
                # In a real app, this would trigger an email or push notification
                print(f"ALERT: Budget exceeded for {instance.category.name}! Limit: {budget.limit_amount}, Spent: {total_spent}")

class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=SELECT_CATEGORY_CHOICES, default='Other')
    amount = models.BigIntegerField()
    date = models.DateField(default=now)
    frequency = models.CharField(max_length=20, choices=[('Daily', 'Daily'), ('Weekly', 'Weekly'), ('Monthly', 'Monthly')], default='Monthly')
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Paid', 'Paid')], default='Pending')

class Goal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    target_amount = models.BigIntegerField()
    current_amount = models.BigIntegerField(default=0)
    end_date = models.DateField()
   

