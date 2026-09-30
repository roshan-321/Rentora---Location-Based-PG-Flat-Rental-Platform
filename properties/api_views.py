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

        query_params = request.query_params
        properties = Property.objects.all()

        property_type = query_params.get("property_type")
        min_rent = query_params.get("min_rent")
        max_rent = query_params.get("max_rent")
        location = query_params.get("location")
        suitable_for = query_params.get("suitable_for")

        if property_type:
            properties = properties.filter(property_type=property_type)

        if min_rent is not None and min_rent != "":
            properties = properties.filter(rent__gte=min_rent)

        if max_rent:
            properties = properties.filter(rent__lte=max_rent)

        if location:
            properties = properties.filter(address__icontains=location)

        if suitable_for:
            properties = properties.filter(suitable_for=suitable_for)


        serializer = PropertySerializer(properties, many=True)
        return Response({
            "properties": serializer.data,
            "user_id": ( request.user.id
                 if request.user.is_authenticated
                  else None),
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

        if property.owner != request.user:
            return Response(
        {"message": "Permission denied"},
        status=403
    )


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

        if property.owner != request.user:
            return Response(
                {"message": "Permission denied"},
                status=403
            )

        property.delete()

        return Response({
            "msg": "deleted"
        })
