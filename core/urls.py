from django.urls import path
from accounts.views import UserRegisterRenderView, UserLoginRenderView
from properties.views import PropertyListRenderView, AddPropertyRenderView
from .views import HomeRenderView


ACCOUNTS_PREFIX = "accounts"
PROPERTY_PREFIX = "properties"

urlpatterns = [
    # Dashboard
    path("", HomeRenderView.as_view(), name="home"),
     
    # Accounts
    path(f"{ACCOUNTS_PREFIX}/user/signup", UserRegisterRenderView.as_view(), name="user_register"),
    path(f"{ACCOUNTS_PREFIX}/user/signin", UserLoginRenderView.as_view(), name="user_login"),

    # Properties
    path(f"{PROPERTY_PREFIX}/list", PropertyListRenderView.as_view(), name="property_list"),
    path(f"{PROPERTY_PREFIX}/add", AddPropertyRenderView.as_view(), name="property_list")
]