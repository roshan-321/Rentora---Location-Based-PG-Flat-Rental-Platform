from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .api_views import UserAPI, UserRegisterApi

urlpatterns = [
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),

    path("users", UserAPI.as_view(), name = "users_list_api"),
    path("users/<int:id>", UserAPI.as_view(), name = "users_list_api"),
    path("user/register", UserRegisterApi.as_view(), name = "user_register")

]