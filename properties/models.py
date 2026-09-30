from django.db import models
from django.conf import settings


# Create your models here.

class Property(models.Model):

    PROPERTY_CHOICES = (
        ("pg","PG"),
        ("flat","FLAT")
    )

    SUITABLE_FOR_CHOICES = [
        ("boys", "Only for Boys"),
        ("girls", "Only for Girls"),
        ("families", "Only for Families"),
        ("students", "Students"),
        ("professionals", "Working Professionals"),
        ("all", "Suitable for All"),
    ]

    
    name = models.CharField(max_length=100)
    property_type = models.CharField(choices=PROPERTY_CHOICES)
    suitable_for = models.CharField(max_length=20,choices=SUITABLE_FOR_CHOICES,default="all")
    description = models.TextField()
    rent = models.PositiveIntegerField()
    features = models.JSONField(default=dict)
    address = models.CharField(max_length=100, null = True, blank= True)
    contact_no = models.CharField(max_length=15, null = True, blank= True)
    alternate_contact_no = models.CharField(max_length=15,blank=True,null=True)

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
       return self.name