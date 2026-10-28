
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    list_display = (
        "id",
        "username",
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "gender",
        "role",
        "is_active",
        "is_staff",
        "is_superuser",
    )