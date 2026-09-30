from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission

from .models import User
from .serializers import UserSerializer

# Create your views here.

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_superuser
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
            "message": "Authenticated",
            "role": request.user.role,
            "id":request.user.id,
            "is_superuser": request.user.is_superuser
        })
