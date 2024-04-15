from base.views import BaseModelViewSet
from studio.models import Studio
from studio.serializers import StudioSerializer, StudioUpdateSerializer, StudioSummarySerializer, StudioDetailSerializer, AddEmployeeSerializer
from rest_framework import status
from rest_framework.response import Response
from studio.permission import StudioPermission
from django.db import transaction
from role.models import Role
import json
from address.models import Address
from rest_framework.decorators import action
from user.models import User
from user.serializers import UserSummarySerializer


class StudioViewSet(BaseModelViewSet):
    queryset = Studio.objects.all()
    serializer_class = {'default': StudioSerializer, 'update': StudioUpdateSerializer,
                        'partial_update': StudioUpdateSerializer, "retrieve": StudioDetailSerializer, 
                        "list": StudioSummarySerializer, "add_employee": AddEmployeeSerializer,
                        "remove_employee": AddEmployeeSerializer}
    permission_classes = [StudioPermission]
    lookup_field = 'code_name'
    

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        if request.user.studio:
            return Response(data={"detail": "You already have a studio"}, status=status.HTTP_400_BAD_REQUEST)
        data = request.data['data'] if 'data' in request.data else request.data
        if type(data) == str:
            data = json.loads(data)
        if request.FILES:
            data['avatar'] = request.FILES['avatar']
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            serializer.save()
        except Role.DoesNotExist:
            return Response(data={"detail": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            data=self.get_serializer(serializer.instance, is_get = True).data, 
            status=status.HTTP_201_CREATED
        )

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        studio = self.get_object()
        user = request.user
        role = Role.objects.filter(code_name="studio")
        if role:
            user.role.remove(role.first())
        studio.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data['data'] if 'data' in request.data else request.data
        if type(data) == str:
            data = json.loads(data)
        if request.FILES:
            data['avatar'] = request.FILES['avatar']

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)

        if 'address' in serializer.validated_data :
            address_data = serializer.validated_data.pop('address')
            address = instance.address
            if address:
                address.delete()
            address = Address.objects.create(**address_data)
            instance.address = address

        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        data = self.get_serializer(instance, is_get=True).data
        return Response(data)

    @action(detail = True, methods = ['POST'], url_path='employee')
    def add_employee(self, request, *args, **kwargs):
        studio = self.get_object()
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)   
        email = request.data.get('email')
        user = User.objects.filter(email = email)
        if user:
            user = user.first()
            if user.studio:
                return Response(data = {"detail": "User already has a studio"}, status = status.HTTP_400_BAD_REQUEST)
            user.word_for_studio = studio
            user.role.add(Role.objects.get(code_name = "studio"))
            user.save()
            data = UserSummarySerializer(studio.employee.all(), many = True).data
            return Response(data = data, status = status.HTTP_200_OK)
        return Response(data = {"detail": "User not found"}, status = status.HTTP_404_NOT_FOUND)

    @action(detail = True, methods = ['DELETE'], url_path='remove-employee')
    def remove_employee(self, request, *args, **kwargs):
        studio = self.get_object()
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        email = request.data.get('email')
        user = User.objects.filter(email = email)
        if user:
            user = user.first()
            if user.studio == studio:
                user.word_for_studio = None
                user.role.remove(Role.objects.get(code_name = "studio"))
                user.save()
                data = UserSummarySerializer(studio.employee.all(), many = True).data
                return Response(data = data, status = status.HTTP_200_OK)
            return Response(data = {"detail": "User is not in this studio"}, status = status.HTTP_400_BAD_REQUEST)
        return Response(data = {"detail": "User not found"}, status = status.HTTP_404_NOT_FOUND)
    
    @action(detail = True, methods = ['GET'], url_path='get-employee')
    def get_employee(self, request, *args, **kwargs):
        studio = self.get_object()
        data = UserSummarySerializer(studio.employee.all(), many = True).data
        return Response(data = data, status = status.HTTP_200_OK)