from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Property
from .serializers import PropertySerializer
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class PropertyAPI(APIView):
    permission_classes  = [IsAuthenticated]

    def get(self, request):
            properties = Property.objects.all()
            serializer = PropertySerializer(properties, many = True)
            return Response(serializer.data)
    
    def post(self, request):
            serializer = PropertySerializer(data = request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message":"data saved",
                    "data": serializer.data
                    })
            return Response(
                serializer.errors
            )

    def patch(self, request, id):
            properties = Property.objects.get(id = id)
            serializer = PropertySerializer(properties, data = request.data, partial = True)
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
            users = Property.objects.get(id=id)
            users.delete()
            return Response({"msg":"deleted"})
