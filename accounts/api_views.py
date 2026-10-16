from rest_framework.response import Response
from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.conf import settings
from urllib.parse import urljoin
from django.urls import reverse
import requests

from .models import User
from .serializers import UserSerializer



# Create your views here.

    
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_superuser
        )
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.GOOGLE_OAUTH_CALLBACK_URL
    client_class = OAuth2Client
    
class GoogleLoginCallback(APIView):
    def get(self, request, *args, **kwargs):
        error = request.GET.get("error")

        if error:
            return Response(
                {"error": error},
                status=status.HTTP_400_BAD_REQUEST
            )

        code = request.GET.get("code")

        if not code:
            return Response(
                {"error": "Authorization code is missing."},
                status=status.HTTP_400_BAD_REQUEST
            )

        token_endpoint_url = urljoin(
            "http://127.0.0.1:8000",
            reverse("google_login")
        )

        try:
            response = requests.post(
                url=token_endpoint_url,
                data={"code": code},
                timeout=15
            )

            print("Google login status:", response.status_code)
            print("Google login content type:",
                  response.headers.get("Content-Type"))
            print("Google login response:", response.text[:2000])

            try:
                data = response.json()
            except ValueError:
                return Response(
                    {
                        "error": "Google login returned a non-JSON response.",
                        "status_code": response.status_code
                    },
                    status=status.HTTP_502_BAD_GATEWAY
                )

            return Response(data, status=response.status_code)

        except requests.RequestException as exc:
            print("Google login request failed:", str(exc))
            return Response(
                {"error": "Unable to connect to Google login endpoint."},
                status=status.HTTP_502_BAD_GATEWAY
            )


class UserListAPI(APIView): 
    permission_classes = [IsAdmin]

    def get(self, request):

        query_params = request.query_params
        users = User.objects.all().order_by("id")

        user_id = query_params.get("id")
        role = query_params.get("role")
        gender = query_params.get("gender")
        name = query_params.get("name")
        email = query_params.get("email")
        is_active = query_params.get("is_active")


        if user_id:
            users = users.filter(id=user_id)

        if role:
            users = users.filter(role=role)

        if gender:
            users = users.filter(gender=gender)

        if name:
            users = users.filter(
                first_name__icontains=name
            ) | users.filter(
                last_name__icontains=name
            )

        if email:
            users = users.filter(email__icontains=email)

        if is_active is not None and is_active != "":
            users = users.filter(is_active=is_active.lower() == "true")

        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)


class UserByIDAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        if request.user.id != id and not request.user.is_superuser:
            return Response(
                {"message": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        user = User.objects.get(id=id)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def patch(self, request, id):
        if request.user.id != id and not request.user.is_superuser:
            return Response(
                {"message": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        user = User.objects.get(id=id)

        serializer = UserSerializer(
            user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Data updated",
                "data": serializer.data
            })

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, id):
        if not request.user.is_superuser:
            return Response(
                {"message": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        user = User.objects.get(id=id)
        user.delete()

        return Response({"message": "Deleted successfully"})

    
class UserRegisterApi(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message":"data saved",
                "data": serializer.data
             }, status=status.HTTP_201_CREATED
             )
            
            
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

#  AuthAPI

class AuthAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "Authenticate",
            "id": request.user.id,
            "role": request.user.role,
            "gender": request.user.gender,
            "is_superuser": request.user.is_superuser
        })


class UserRoleAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        role = request.data.get("role")
        gender = request.data.get("gender")

        if role not in ["tenant", "owner"]:
            return Response(
                {"error": "Invalid role."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if gender not in ["male", "female", "other"]:
            return Response(
                {"error": "Invalid gender."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if request.user.is_superuser:
            return Response(
                {"error": "Superuser does not need onboarding."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if request.user.role != "":
            return Response(
                {"error": "Role is already assigned."},
                status=status.HTTP_400_BAD_REQUEST
            )

        request.user.role = role
        request.user.gender = gender
        request.user.save(update_fields=["role", "gender"])

        return Response(
            {
                "message": "Profile completed successfully.",
                "role": role,
                "gender": gender
            },
            status=status.HTTP_200_OK
        )
