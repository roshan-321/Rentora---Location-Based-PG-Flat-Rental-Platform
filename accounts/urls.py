from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .api_views import UserListAPI, UserRegisterApi, UserByIDAPI, AuthAPI

urlpatterns = [
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path("auth/", AuthAPI.as_view(), name="auth"),

    path("users", UserListAPI.as_view(), name = "users_list_api"),
    path("users/<int:id>", UserByIDAPI.as_view(), name = "users_by_id_api"),
    path("user/register", UserRegisterApi.as_view(), name = "user_register")

]