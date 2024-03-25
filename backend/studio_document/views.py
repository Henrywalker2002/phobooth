from base.views import BaseGenericViewSet
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin, ListModelMixin, RetrieveModelMixin
from studio_document.models import StudioDocument, StudioDocumentStatusChoices
from studio_document.serializers import CreateStudioDocumentSerializer, StudioDocumentDetailSerializer, StudioDocumentUpdateSerializer, StudioDocumentSummarySerializer
from studio_document.permissions import StudioDocumentPermission
from studio_document.exceptions import StudioDocumentAlreadyExistsException
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from studio_document.filter import StudioDocumentFilter


class StudioDocumentViewSet(BaseGenericViewSet, CreateModelMixin, UpdateModelMixin, ListModelMixin, RetrieveModelMixin):
    queryset = StudioDocument.objects.all()
    serializer_class = {"create": CreateStudioDocumentSerializer, "retrieve": StudioDocumentDetailSerializer, 
                        "list" : StudioDocumentSummarySerializer, "default": StudioDocumentUpdateSerializer}    
    permission_classes = (StudioDocumentPermission,)
    filterset_class = StudioDocumentFilter
    
    def get_queryset(self):
        if self.action == 'list':
            return self.queryset.order_by('-created_at', 'status')
        return super().get_queryset()
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if self.queryset.filter(studio=request.user.studio, 
                                status__in= [StudioDocumentStatusChoices.ACCEPTED, StudioDocumentStatusChoices.PENDING]).exists():
            raise StudioDocumentAlreadyExistsException()
        serializer.validated_data['studio'] = request.user.studio
        
        number_attempts = self.queryset.filter(studio=request.user.studio).count()
        serializer.validated_data['number_attempts'] = number_attempts + 1
        
        self.perform_create(serializer)
        data = self.get_serializer(serializer.instance, is_get = True).data
        header = self.get_success_headers(data)
        
        return Response(data, status=status.HTTP_201_CREATED, headers=header)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        if serializer.validated_data['status'] == StudioDocumentStatusChoices.ACCEPTED:
            studio = instance.studio
            studio.is_verified = True
            studio.save()
        
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}
        
        data = self.get_serializer(instance, is_get = True).data
        
        return Response(data= data, status=status.HTTP_200_OK)