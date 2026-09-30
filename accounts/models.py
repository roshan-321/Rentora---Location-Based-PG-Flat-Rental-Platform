from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):

    ROLE_CHOICES = (
        ("admin","Admin"),
        ("tenant","Tenant"),
        ("owner","Owner")
    )

    GENDER_CHOICES = (
    ("male", "Male"),
    ("female", "Female"),
    ("other", "Other"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    gender = models.CharField(choices=GENDER_CHOICES,null=True,blank=True)
    email = models.EmailField(unique=True, null=False, blank=False)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email


    