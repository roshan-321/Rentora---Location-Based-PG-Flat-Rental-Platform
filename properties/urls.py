from django.urls import path
from . views import *

urlpatterns = [
    path("properties", PropertyAPI.as_view(), name = "properties"),
    path("properties/<int:id>", PropertyAPI.as_view(), name = "properties")
]
