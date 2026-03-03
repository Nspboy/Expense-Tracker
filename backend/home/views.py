from django.shortcuts import render
from django.http import JsonResponse

# This file is kept for standard Django structure. 
# All business logic has been migrated to api_views.py for a Decoupled Architecture.

def home(request):
    return JsonResponse({
        "status": "ready",
        "message": "Expense Tracker API is running.",
        "api_root": "/api/",
        "docs": "/admin/"
    })