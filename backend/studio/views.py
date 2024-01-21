from base.views import CustomModelViewSetBase
from studio.models import Studio
from studio.serializers import StudioSerializer, StudioUpdateSerializer
from rest_framework import status
from rest_framework.response import Response
from studio.permission import StudioPermission
from django.db import transaction
from role.models import Role
import json


class StudioViewSet(CustomModelViewSetBase):
    queryset = Studio.objects.all()
    serializer_class = {'default': StudioSerializer}
    permission_classes = [StudioPermission]
    
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
        
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)
    
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
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        data = self.get_serializer(instance, is_get = True).data
        return Response(data)
    