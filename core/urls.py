from django.urls import path
from accounts.views import UserRegisterRenderView, UserLoginRenderView, UserListView
from .views import HomeRenderView

ACCOUNTS_PREFIX = "accounts"

urlpatterns = [
    # Dashboard
    path("users", UserListView.as_view(), name="user_list"),
    path("", HomeRenderView.as_view(), name="home"),
     
    # Accounts
    path(f"{ACCOUNTS_PREFIX}/user/signup", UserRegisterRenderView.as_view(), name="user_register"),
    path(f"{ACCOUNTS_PREFIX}/user/signin", UserLoginRenderView.as_view(), name="user_login")

    # Properties
]