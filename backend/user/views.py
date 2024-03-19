from user.serializers import (
    UserSerializer, LoginSerializer, UserSignUpSerializer, UserDetailSerializer,
    CreateStaffSerilizer, UpdateUserSerializer, StaffSummarySerializer, 
    UpdateStaffSerializer, UserSummarySerializer)
from user.models import User
from base.views import BaseModelViewSet, BaseGenericViewSet
from django.db import transaction
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import authenticate
from django.contrib.auth import login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from role.models import Role
from user.permission import UserPermission, StaffPermission
from django.db import transaction
from address.models import Address
import json
from django.http.request import QueryDict


class UserViewSet(BaseModelViewSet):

    serializer_class = {"default": UserSerializer, "sign_up": UserSignUpSerializer,
                        "retrieve": UserDetailSerializer, "update": UpdateUserSerializer, 
                        "partial_update": UpdateUserSerializer, "list": UserSummarySerializer}
    queryset = User.objects.all()
    permission_classes = [UserPermission]
    lookup_field = "id"
    lookup_url_kwarg = "id"
    
    def get_queryset(self):
        return self.queryset.filter(role__code_name__in=["customer", "studio"]).distinct()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()
        user = serializer.instance
        user.set_password(user.password)
        user.save()
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=False, url_path="sign-up")
    @transaction.atomic
    def sign_up(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role = Role.objects.get(code_name="customer")
        if not role:
            return Response(data={"message": "something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer.save(role=[role.id])
        user = serializer.instance
        user.set_password(user.password)
        user.save()

        return Response(data=self.get_serializer(user, is_get=True).data, status=status.HTTP_201_CREATED)       

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        if isinstance(request.data, QueryDict):
            data = request.data.dict()
        else:
            data = request.data
        address = data.get("address", None)
        if isinstance(address, str):
            try:
                address = json.loads(address)
                data['address'] = address
            except Exception as e:
                return Response(data = {"error": "Invalid address format"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        save_flag = False
        if 'password' in serializer.validated_data:
            instance.set_password(serializer.validated_data.pop("password"))
            save_flag = True
        
        if 'address' in serializer.validated_data:
            address = serializer.validated_data.pop("address", None)
            if address:
                address = Address.objects.create(**address)
                instance.address = address
                save_flag = True
                    
        if save_flag:
            instance.save()
        self.perform_update(serializer)
            
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}
            
        data = self.get_serializer(instance, is_get=True).data
        return Response(data)

class StaffViewSet(BaseModelViewSet):
    serializer_class = {"default": UserSerializer, "create": CreateStaffSerilizer, 
                        "retrieve": UserDetailSerializer, "list" : StaffSummarySerializer,
                        "update": UpdateStaffSerializer, "partial_update": UpdateStaffSerializer,}
    queryset = User.objects.all()
    permission_classes = [StaffPermission]
    
    def get_queryset(self):
        return self.queryset.filter(role__code_name__in=["staff", "admin"])
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role = serializer.validated_data.pop("role")
        role = Role.objects.filter(code_name=role)
        if not role:
            return Response(data={"message": "something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        role = role.first()
        user = User(**serializer.validated_data)
        user.set_password(user.password)
        user.save()
        user.role.set([role])
        return Response(data=self.get_serializer(user, is_get=True).data, status=status.HTTP_201_CREATED)
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        if 'role' in serializer.validated_data:
            role = serializer.validated_data.pop("role")
            if not self.request.user.role.filter(code_name= role).exists():
                self.permission_denied(request, message="You don't have permission to change role", code=403)
            role = Role.objects.filter(code_name=role)
            if not role:
                return Response(data={"message": "something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            role = role.first()
            instance.role.set([role])
        if 'password' in serializer.validated_data:
           password = serializer.validated_data.pop("password") 
           instance.set_password(password)
           instance.save() 
        
        self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        data = self.get_serializer(instance, is_get=True).data
        return Response(data)


class AuthenticationViewSet(BaseGenericViewSet):
    serializer_class = {"default": LoginSerializer,
                        "retrieve": UserDetailSerializer}
    permission_classes = [permissions.AllowAny]

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
                return Response("user is not active", status=status.HTTP_401_UNAUTHORIZED)
            token = RefreshToken.for_user(user)
            user_data = self.get_serializer(user, is_get=True).data
            user_data["access"] = str(token.access_token)
            user_data["refresh"] = str(token)
            return Response(user_data, status=status.HTTP_200_OK)
        return Response({"message": "wrong username or password"}, status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=['post'], detail=False, url_path="logout")
    def logout(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
