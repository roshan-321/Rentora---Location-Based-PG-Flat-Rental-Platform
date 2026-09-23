from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import UserSerializer

# Create your views here.

class UserListAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class UserByIDAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
            user = User.objects.get(id=id)
            serializer = UserSerializer(user)
            return Response(serializer.data) 
    
    
    def patch(self, request, id):
        users = User.objects.get(id = id)
        serializer = UserSerializer(users, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message":"data updated",
                "data": serializer.data
                })
        return Response(
            serializer.errors
        )
    

    def delete(self, request, id):
        users = User.objects.get(id=id)
        users.delete()
        return Response({"msg":"deleted"})

class UserRegisterApi(APIView):
    
    def post(self, request):
        serializer = UserSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message":"data saved",
                "data": serializer.data
                })
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class AuthAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "Authenticated"
        })