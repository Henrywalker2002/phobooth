import uuid
from user.serializers import UserSerializer, LoginSerializer
from user.models import User 
from base.views import CustomModelViewSetBase
from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import authenticate
from django.contrib.auth import login, logout

class UserViewSet(CustomModelViewSetBase):
    
    serializer_class = {"default" : UserSerializer}
    queryset = User.objects.all() 
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        
        serializer.save()
        user = serializer.instance
        user.set_password(user.password)
        user.save()        
        return Response(data = serializer.data, status = status.HTTP_201_CREATED)
    
class AuthenticationViewSet(viewsets.GenericViewSet):
    serializer_class = {"default": LoginSerializer}
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action in self.serializer_class.keys():
            return self.serializer_class[self.action]
        return self.serializer_class['default']

    def get_permissions(self):
        if self.action == "logout":
            return [permissions.IsAuthenticated()]
        return super().get_permissions()
    
    @action(methods=['post'], detail=False, url_path="login")
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = authenticate(
            request, username=serializer.validated_data['username'], password=serializer.validated_data['password'])
        if user:
            if not user.is_active:
                return Response("user is not active", status= status.HTTP_401_UNAUTHORIZED)
            login(request, user)
            user_data = self.get_serializer(user).data 
            return Response(user_data)
        return Response({"messsage" : "wrong username or password"}, status= status.HTTP_401_UNAUTHORIZED)

    @action(methods=['post'], detail=False, url_path="logout")
    def logout(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)