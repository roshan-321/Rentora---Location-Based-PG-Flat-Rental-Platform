from django.urls import path
from .api_views import *

urlpatterns = [
    path("list", PropertyAPI.as_view(), name = "properties"),
    path("list/<int:id>", PropertByIdAPI.as_view(), name = "property_by_id"),

]
