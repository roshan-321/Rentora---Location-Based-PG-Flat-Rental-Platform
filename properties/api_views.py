from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Property
from .serializers import PropertySerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.permissions import BasePermission
# Create your views here.

# permission
class IsOwner(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "owner"
        )


class PropertyAPI(APIView):
   
    def get_permissions(self):

        if self.request.method == "GET":
            return [AllowAny()]

        if self.request.method == "POST":
            return [IsAuthenticated(), IsOwner()]

        return [IsAuthenticated()]

    def get(self, request):
        properties = Property.objects.all()
        serializer = PropertySerializer(properties, many=True)
        return Response({
            "properties": serializer.data,
            "user_id": request.user.id
            })
    
    def post(self, request):
        serializer = PropertySerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response({
                "message":"data saved",
                "data": serializer.data
                })
        return Response(
            serializer.errors
        )


class PropertByIdAPI(APIView):

    def get_permissions(self):

        if self.request.method == "GET":
            return [AllowAny()]

        if self.request.method in ["PATCH", "DELETE"]:
            return [IsAuthenticated(), IsOwner()]

        return [IsAuthenticated()]

    def get(self, request, id):
        property = Property.objects.get(id=id)
        serializer = PropertySerializer(property)
        return Response(serializer.data)

    def patch(self, request, id):
        property = Property.objects.get(id=id)

        serializer = PropertySerializer(
            property,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "message": "data updated",
                "data": serializer.data
            })

        return Response(serializer.errors)

    def delete(self, request, id):
        property = Property.objects.get(id=id)
        property.delete()

        return Response({
            "msg": "deleted"
        })