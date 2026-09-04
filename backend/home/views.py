from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum, Count, Q
from django.utils import timezone
from .models import UserProfile, Category, Expense, Income, Budget, Goal, Reminder
import json
import datetime


# ──────────────────────────────────────────────
# AUTH VIEWS
# ──────────────────────────────────────────────

def register_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    if request.method == 'POST':
        username   = request.POST.get('username', '').strip()
        email      = request.POST.get('email', '').strip()
        first_name = request.POST.get('first_name', '').strip()
        last_name  = request.POST.get('last_name', '').strip()
        password1  = request.POST.get('password1', '')
        password2  = request.POST.get('password2', '')
        profession = request.POST.get('profession', 'Other')

        if password1 != password2:
            messages.error(request, 'Passwords do not match.')
        elif User.objects.filter(username=username).exists():
            messages.error(request, 'Username already taken.')
        elif len(password1) < 8:
            messages.error(request, 'Password must be at least 8 characters.')
        else:
            user = User.objects.create_user(
                username=username, email=email, password=password1,
                first_name=first_name, last_name=last_name
            )
            UserProfile.objects.create(user=user, profession=profession)
            login(request, user)
            messages.success(request, f'Welcome, {first_name or username}!')
            return redirect('dashboard')
    return render(request, 'auth/register.html')


def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            next_url = request.GET.get('next', '/')
            return redirect(next_url)
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'auth/login.html')


def logout_view(request):
    logout(request)
    return redirect('login')


# ──────────────────────────────────────────────
# DASHBOARD
# ──────────────────────────────────────────────

@login_required
def dashboard_view(request):
    user = request.user
    today = datetime.date.today()
    month_start = today.replace(day=1)

    total_income  = Income.objects.filter(user=user).aggregate(s=Sum('amount'))['s'] or 0
    total_expense = Expense.objects.filter(user=user).aggregate(s=Sum('amount'))['s'] or 0
    balance       = total_income - total_expense

    month_income  = Income.objects.filter(user=user, date__gte=month_start).aggregate(s=Sum('amount'))['s'] or 0
    month_expense = Expense.objects.filter(user=user, date__gte=month_start).aggregate(s=Sum('amount'))['s'] or 0

    profile, _ = UserProfile.objects.get_or_create(user=user)

    # Recent transactions (last 8)
    recent_expenses = Expense.objects.filter(user=user).select_related('category').order_by('-date', '-created_at')[:8]

    # Expenses by category for doughnut chart
    cat_data = (
        Expense.objects.filter(user=user)
        .values('category__name', 'category__color')
        .annotate(total=Sum('amount'))
        .order_by('-total')[:8]
    )

    # Monthly trend (last 6 months)
    months_labels, income_data, expense_data = [], [], []
    for i in range(5, -1, -1):
        d = (today.replace(day=1) - datetime.timedelta(days=i * 28)).replace(day=1)
        label = d.strftime('%b %Y')
        inc = Income.objects.filter(user=user, date__year=d.year, date__month=d.month).aggregate(s=Sum('amount'))['s'] or 0
        exp = Expense.objects.filter(user=user, date__year=d.year, date__month=d.month).aggregate(s=Sum('amount'))['s'] or 0
        months_labels.append(label)
        income_data.append(float(inc))
        expense_data.append(float(exp))

    context = {
        'total_income': total_income,
        'total_expense': total_expense,
        'balance': balance,
        'savings': profile.Savings or 0,
        'month_income': month_income,
        'month_expense': month_expense,
        'recent_expenses': recent_expenses,
        'profile': profile,
        'cat_labels': json.dumps([c['category__name'] for c in cat_data]),
        'cat_values': json.dumps([float(c['total']) for c in cat_data]),
        'cat_colors': json.dumps([c['category__color'] or '#7F56D9' for c in cat_data]),
        'months_labels': json.dumps(months_labels),
        'income_data': json.dumps(income_data),
        'expense_data': json.dumps(expense_data),
    }
    return render(request, 'dashboard.html', context)


# ──────────────────────────────────────────────
# EXPENSES
# ──────────────────────────────────────────────

@login_required
def expenses_view(request):
    user = request.user
    qs = Expense.objects.filter(user=user).select_related('category').order_by('-date', '-created_at')

    # Filters
    category_id   = request.GET.get('category')
    payment       = request.GET.get('payment')
    date_from     = request.GET.get('date_from')
    date_to       = request.GET.get('date_to')
    amount_min    = request.GET.get('amount_min')
    amount_max    = request.GET.get('amount_max')
    search        = request.GET.get('search', '').strip()

    if category_id:
        qs = qs.filter(category_id=category_id)
    if payment:
        qs = qs.filter(payment_method=payment)
    if date_from:
        qs = qs.filter(date__gte=date_from)
    if date_to:
        qs = qs.filter(date__lte=date_to)
    if amount_min:
        qs = qs.filter(amount__gte=amount_min)
    if amount_max:
        qs = qs.filter(amount__lte=amount_max)
    if search:
        qs = qs.filter(Q(title__icontains=search) | Q(notes__icontains=search))

    categories = Category.objects.filter(type='Expense')
    total = qs.aggregate(s=Sum('amount'))['s'] or 0

    context = {
        'expenses': qs,
        'categories': categories,
        'total': total,
        'filters': request.GET,
        'payment_methods': ['Cash', 'Card', 'Online', 'Bank Transfer', 'UPI'],
    }
    return render(request, 'expenses.html', context)


@login_required
@require_POST
def expense_add(request):
    try:
        data = json.loads(request.body)
        expense = Expense.objects.create(
            user=request.user,
            title=data['title'],
            amount=data['amount'],
            category_id=data.get('category') or None,
            date=data.get('date') or datetime.date.today(),
            payment_method=data.get('payment_method', 'Cash'),
            notes=data.get('notes', ''),
        )
        return JsonResponse({'success': True, 'id': expense.id, 'message': 'Expense added!'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@login_required
@require_http_methods(['POST'])
def expense_edit(request, pk):
    expense = get_object_or_404(Expense, pk=pk, user=request.user)
    try:
        data = json.loads(request.body)
        expense.title          = data.get('title', expense.title)
        expense.amount         = data.get('amount', expense.amount)
        expense.category_id    = data.get('category') or expense.category_id
        expense.date           = data.get('date', expense.date)
        expense.payment_method = data.get('payment_method', expense.payment_method)
        expense.notes          = data.get('notes', expense.notes)
        expense.save()
        return JsonResponse({'success': True, 'message': 'Expense updated!'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@login_required
@require_POST
def expense_delete(request, pk):
    expense = get_object_or_404(Expense, pk=pk, user=request.user)
    expense.delete()
    return JsonResponse({'success': True, 'message': 'Expense deleted!'})


@login_required
def expense_detail(request, pk):
    expense = get_object_or_404(Expense, pk=pk, user=request.user)
    return JsonResponse({
        'id': expense.id,
        'title': expense.title,
        'amount': str(expense.amount),
        'category': expense.category_id,
        'category_name': expense.category.name if expense.category else '',
        'date': str(expense.date),
        'payment_method': expense.payment_method,
        'notes': expense.notes or '',
    })


# ──────────────────────────────────────────────
# INCOME
# ──────────────────────────────────────────────

@login_required
def income_view(request):
    user = request.user
    qs = Income.objects.filter(user=user).order_by('-date', '-created_at')

    date_from  = request.GET.get('date_from')
    date_to    = request.GET.get('date_to')
    search     = request.GET.get('search', '').strip()

    if date_from:
        qs = qs.filter(date__gte=date_from)
    if date_to:
        qs = qs.filter(date__lte=date_to)
    if search:
        qs = qs.filter(Q(source__icontains=search) | Q(notes__icontains=search))

    total = qs.aggregate(s=Sum('amount'))['s'] or 0
    context = {'incomes': qs, 'total': total, 'filters': request.GET}
    return render(request, 'income.html', context)


@login_required
@require_POST
def income_add(request):
    try:
        data = json.loads(request.body)
        inc = Income.objects.create(
            user=request.user,
            source=data['source'],
            amount=data['amount'],
            date=data.get('date') or datetime.date.today(),
            notes=data.get('notes', ''),
        )
        return JsonResponse({'success': True, 'id': inc.id, 'message': 'Income added!'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@login_required
@require_http_methods(['POST'])
def income_edit(request, pk):
    inc = get_object_or_404(Income, pk=pk, user=request.user)
    try:
        data = json.loads(request.body)
        inc.source = data.get('source', inc.source)
        inc.amount = data.get('amount', inc.amount)
        inc.date   = data.get('date', inc.date)
        inc.notes  = data.get('notes', inc.notes)
        inc.save()
        return JsonResponse({'success': True, 'message': 'Income updated!'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@login_required
@require_POST
def income_delete(request, pk):
    inc = get_object_or_404(Income, pk=pk, user=request.user)
    inc.delete()
    return JsonResponse({'success': True, 'message': 'Income deleted!'})


@login_required
def income_detail(request, pk):
    inc = get_object_or_404(Income, pk=pk, user=request.user)
    return JsonResponse({
        'id': inc.id,
        'source': inc.source,
        'amount': str(inc.amount),
        'date': str(inc.date),
        'notes': inc.notes or '',
    })


# ──────────────────────────────────────────────
# BUDGETS
# ──────────────────────────────────────────────

@login_required
def budgets_view(request):
    user = request.user
    today = datetime.date.today()
    budgets = Budget.objects.filter(user=user).select_related('category').order_by('-year', '-month')

    budget_list = []
    for b in budgets:
        spent = Expense.objects.filter(
            user=user, category=b.category,
            date__month=b.month, date__year=b.year
        ).aggregate(s=Sum('amount'))['s'] or 0
        pct = min(int((float(spent) / float(b.limit_amount)) * 100), 100) if b.limit_amount else 0
        budget_list.append({'budget': b, 'spent': spent, 'pct': pct, 'remaining': max(float(b.limit_amount) - float(spent), 0)})

    categories = Category.objects.filter(type='Expense')
    context = {
        'budget_list': budget_list,
        'categories': categories,
        'months': [(i, datetime.date(2000, i, 1).strftime('%B')) for i in range(1, 13)],
        'years': range(today.year - 2, today.year + 2),
        'current_month': today.month,
        'current_year': today.year,
    }
    return render(request, 'budgets.html', context)


@login_required
@require_POST
def budget_add(request):
    try:
        data = json.loads(request.body)
        b, created = Budget.objects.update_or_create(
            user=request.user,
            category_id=data['category'],
            month=int(data['month']),
            year=int(data['year']),
            defaults={'limit_amount': data['limit_amount']}
        )
        return JsonResponse({'success': True, 'id': b.id, 'message': 'Budget saved!'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@login_required
@require_POST
def budget_delete(request, pk):
    b = get_object_or_404(Budget, pk=pk, user=request.user)
    b.delete()
    return JsonResponse({'success': True, 'message': 'Budget deleted!'})


# ──────────────────────────────────────────────
# GOALS
# ──────────────────────────────────────────────

@login_required
def goals_view(request):
    goals = Goal.objects.filter(user=request.user).order_by('end_date')
    context = {'goals': goals}
    return render(request, 'goals.html', context)


@login_required
@require_POST
def goal_add(request):
    try:
        data = json.loads(request.body)
        g = Goal.objects.create(
            user=request.user,
            name=data['name'],
            target_amount=data['target_amount'],
            current_amount=data.get('current_amount', 0),
            end_date=data['end_date'],
        )
        return JsonResponse({'success': True, 'id': g.id, 'message': 'Goal created!'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@login_required
@require_POST
def goal_update(request, pk):
    g = get_object_or_404(Goal, pk=pk, user=request.user)
    try:
        data = json.loads(request.body)
        g.name           = data.get('name', g.name)
        g.target_amount  = data.get('target_amount', g.target_amount)
        g.current_amount = data.get('current_amount', g.current_amount)
        g.end_date       = data.get('end_date', g.end_date)
        g.save()
        return JsonResponse({'success': True, 'message': 'Goal updated!'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@login_required
@require_POST
def goal_delete(request, pk):
    g = get_object_or_404(Goal, pk=pk, user=request.user)
    g.delete()
    return JsonResponse({'success': True, 'message': 'Goal deleted!'})


@login_required
def goal_detail(request, pk):
    g = get_object_or_404(Goal, pk=pk, user=request.user)
    return JsonResponse({
        'id': g.id, 'name': g.name,
        'target_amount': str(g.target_amount),
        'current_amount': str(g.current_amount),
        'end_date': str(g.end_date),
    })


# ──────────────────────────────────────────────
# REMINDERS
# ──────────────────────────────────────────────

@login_required
def reminders_view(request):
    reminders = Reminder.objects.filter(user=request.user).select_related('category').order_by('date')
    categories = Category.objects.all()
    context = {'reminders': reminders, 'categories': categories}
    return render(request, 'reminders.html', context)


@login_required
@require_POST
def reminder_add(request):
    try:
        data = json.loads(request.body)
        r = Reminder.objects.create(
            user=request.user,
            title=data['title'],
            category_id=data.get('category') or None,
            amount=data['amount'],
            date=data['date'],
            frequency=data.get('frequency', 'Monthly'),
        )
        return JsonResponse({'success': True, 'id': r.id, 'message': 'Reminder added!'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@login_required
@require_POST
def reminder_toggle(request, pk):
    r = get_object_or_404(Reminder, pk=pk, user=request.user)
    r.status = 'Paid' if r.status == 'Pending' else 'Pending'
    r.save()
    return JsonResponse({'success': True, 'status': r.status})


@login_required
@require_POST
def reminder_delete(request, pk):
    r = get_object_or_404(Reminder, pk=pk, user=request.user)
    r.delete()
    return JsonResponse({'success': True, 'message': 'Reminder deleted!'})


# ──────────────────────────────────────────────
# ANALYTICS
# ──────────────────────────────────────────────

@login_required
def analytics_view(request):
    user = request.user
    today = datetime.date.today()

    # Last 12 months monthly data
    months_labels, income_data, expense_data = [], [], []
    for i in range(11, -1, -1):
        d = (today.replace(day=1) - datetime.timedelta(days=i * 28)).replace(day=1)
        label = d.strftime('%b %Y')
        inc = Income.objects.filter(user=user, date__year=d.year, date__month=d.month).aggregate(s=Sum('amount'))['s'] or 0
        exp = Expense.objects.filter(user=user, date__year=d.year, date__month=d.month).aggregate(s=Sum('amount'))['s'] or 0
        months_labels.append(label)
        income_data.append(float(inc))
        expense_data.append(float(exp))

    # Expenses by category (all time)
    cat_data = (
        Expense.objects.filter(user=user)
        .values('category__name', 'category__color')
        .annotate(total=Sum('amount'))
        .order_by('-total')
    )

    # Top payment methods
    pay_data = (
        Expense.objects.filter(user=user)
        .values('payment_method')
        .annotate(total=Sum('amount'), count=Count('id'))
        .order_by('-total')
    )

    # Daily spending (last 30 days)
    thirty_ago = today - datetime.timedelta(days=30)
    daily_qs = (
        Expense.objects.filter(user=user, date__gte=thirty_ago)
        .values('date')
        .annotate(total=Sum('amount'))
        .order_by('date')
    )
    daily_labels = [str(d['date']) for d in daily_qs]
    daily_values = [float(d['total']) for d in daily_qs]

    context = {
        'months_labels': json.dumps(months_labels),
        'income_data': json.dumps(income_data),
        'expense_data': json.dumps(expense_data),
        'cat_labels': json.dumps([c['category__name'] for c in cat_data]),
        'cat_values': json.dumps([float(c['total']) for c in cat_data]),
        'cat_colors': json.dumps([c['category__color'] or '#7F56D9' for c in cat_data]),
        'pay_labels': json.dumps([p['payment_method'] for p in pay_data]),
        'pay_values': json.dumps([float(p['total']) for p in pay_data]),
        'daily_labels': json.dumps(daily_labels),
        'daily_values': json.dumps(daily_values),
        'total_expense': Expense.objects.filter(user=user).aggregate(s=Sum('amount'))['s'] or 0,
        'total_income': Income.objects.filter(user=user).aggregate(s=Sum('amount'))['s'] or 0,
    }
    return render(request, 'analytics.html', context)


# ──────────────────────────────────────────────
# PROFILE
# ──────────────────────────────────────────────

@login_required
def profile_view(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        user = request.user
        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name  = request.POST.get('last_name', user.last_name)
        user.email      = request.POST.get('email', user.email)
        user.save()
        profile.profession = request.POST.get('profession', profile.profession)
        profile.currency   = request.POST.get('currency', profile.currency)
        profile.income     = request.POST.get('income', profile.income) or 0
        profile.Savings    = request.POST.get('savings', profile.Savings) or 0
        profile.save()
        messages.success(request, 'Profile updated successfully!')
        return redirect('profile')
    context = {
        'profile': profile,
        'profession_choices': ['Employee', 'Business', 'Student', 'Other'],
        'currency_choices': ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'],
    }
    return render(request, 'profile.html', context)