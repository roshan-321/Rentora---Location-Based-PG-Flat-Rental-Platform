from django.db import models
from django.conf import settings


# Create your models here.

class Property(models.Model):

    PROPERTY_CHOICES = (
        ("pg","PG"),
        ("flat","FLAT")
    )
    
    name = models.CharField(max_length=100)
    property_type = models.CharField(choices=PROPERTY_CHOICES)
    description = models.TextField()
    rent = models.PositiveIntegerField()
    features = models.JSONField(default=dict)
    address = models.CharField(max_length=100, null = True, blank= True)

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
       return self.name