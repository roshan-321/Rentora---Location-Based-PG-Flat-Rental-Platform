from django.urls import path
from accounts.views import GoogleCallbackRenderView, UserRegisterRenderView, UserLoginRenderView, UserProfileRenderView, EditProfileRenderView, UserListRenderView,UserViewRenderView, UserEditRenderView, UserRoleRenderView
from properties.views import PropertyListRenderView, AddPropertyRenderView, PropertyEditRenderView, PropertyViewRenderView
from .views import HomeRenderView, AboutRenderView



ACCOUNTS_PREFIX = "accounts"
PROPERTY_PREFIX = "properties"

urlpatterns = [
    # Dashboard
    path("", HomeRenderView.as_view(), name="home"),
    path("about", AboutRenderView.as_view(), name="about_retora"),

    # Accounts
    path(f"{ACCOUNTS_PREFIX}/google/callback", GoogleCallbackRenderView.as_view(), name="google_callback_render"),
    path(f"{ACCOUNTS_PREFIX}/user/signup", UserRegisterRenderView.as_view(), name="user_register"),
    path(f"{ACCOUNTS_PREFIX}/user/signin", UserLoginRenderView.as_view(), name="user_login"),
    path(f"{ACCOUNTS_PREFIX}/user/profile", UserProfileRenderView.as_view(), name="user_profile"),
    path(f"{ACCOUNTS_PREFIX}/user/profile/edit", EditProfileRenderView.as_view(), name="user_profile"),
    path(f"{ACCOUNTS_PREFIX}/user/list", UserListRenderView.as_view(), name="user_list"),
    path(f"{ACCOUNTS_PREFIX}/user/view/<int:id>", UserViewRenderView.as_view(), name="user_view"),
    path(f"{ACCOUNTS_PREFIX}/user/edit/<int:id>", UserEditRenderView.as_view(), name="user_view"),
    path(f"{ACCOUNTS_PREFIX}/user/role", UserRoleRenderView.as_view(), name="user_role"),
    
    
    # Properties
    path(f"{PROPERTY_PREFIX}/list", PropertyListRenderView.as_view(), name="property_list"),
    path(f"{PROPERTY_PREFIX}/add", AddPropertyRenderView.as_view(), name="property_list"),
    path(f"{PROPERTY_PREFIX}/edit/<int:id>", PropertyEditRenderView.as_view(), name="property_list"),
    path(f"{PROPERTY_PREFIX}/view/<int:id>", PropertyViewRenderView.as_view(), name="property_list")
]