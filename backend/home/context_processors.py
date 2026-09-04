"""
Context processor that injects currency_symbol into every template context.
Reads the authenticated user's profile currency setting.
"""

CURRENCY_SYMBOLS = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'JPY': '¥',
    'CAD': 'CA$',
    'AUD': 'A$',
}


def currency(request):
    """Add currency_symbol to every template context."""
    symbol = '₹'  # Default: Indian Rupee
    if request.user.is_authenticated:
        try:
            from home.models import UserProfile
            profile = UserProfile.objects.filter(user=request.user).first()
            if profile:
                symbol = CURRENCY_SYMBOLS.get(profile.currency, '₹')
        except Exception:
            pass
    return {'currency_symbol': symbol}
