from user.serializers import UserSerializer, LoginSerializer, UserSignUpSerializer, UserDetailSerializer
from user.models import User 
from base.views import CustomModelViewSetBase
from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import authenticate
from django.contrib.auth import login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from role.models import Role 
from user.permission import UserPermission

class UserViewSet(CustomModelViewSetBase):
    
    serializer_class = {"default" : UserSerializer, "sign_up" : UserSignUpSerializer, "retrieve" : UserDetailSerializer}
    queryset = User.objects.all() 
    permission_classes = [UserPermission]

    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        
        serializer.save()
        user = serializer.instance
        user.set_password(user.password)
        user.save()        
        return Response(data = serializer.data, status = status.HTTP_201_CREATED)
    
    @action(methods=['post'], detail=False, url_path="sign-up") 
    @transaction.atomic
    def sign_up(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        role = Role.objects.get(code_name = "customer")
        if not role: 
            return Response(data = {"message" : "something went wrong"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer.save(role = [role.id])
        user = serializer.instance
        user.set_password(user.password)
        user.save()
        
        return Response(data = self.get_serializer(user, is_get = True).data, status = status.HTTP_201_CREATED)
    
    
class AuthenticationViewSet(viewsets.GenericViewSet):
    serializer_class = {"default": LoginSerializer, "retrieve": UserDetailSerializer}
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action in self.serializer_class.keys():
            return self.serializer_class[self.action]
        return self.serializer_class['default']
    
    def get_serializer(self, *args, **kwargs):
        is_get = kwargs.pop('is_get', False)
        if is_get:
            serializer_class = self.serializer_class.get('retrieve', self.get_serializer_class())
        else :
            serializer_class = self.get_serializer_class()
        kwargs.setdefault('context', self.get_serializer_context())
        return serializer_class(*args, **kwargs)

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
            token = RefreshToken.for_user(user)
            user_data = self.get_serializer(user, is_get = True).data
            user_data["access"] = str(token.access_token)
            user_data["refresh"] = str(token)
            return Response(user_data, status= status.HTTP_200_OK)
        return Response({"messsage" : "wrong username or password"}, status= status.HTTP_401_UNAUTHORIZED)

    @action(methods=['post'], detail=False, url_path="logout")
    def logout(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)