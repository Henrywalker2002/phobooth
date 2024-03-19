from base.views import BaseGenericViewSet
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
from demo.models import ImageDemo, ImageDemoComment
from demo.serializers import (CreateDemoImageSerializer, ReadDemoImageSerializer, 
                              CreateDemoImageCommentSerializer, ReadDemoImageCommentSerializer)
from demo.permisson import ImageDemoPermission, ImageDemoCommentPermission
from rest_framework import status
from rest_framework.response import Response    
from demo.exceptions import QueryParamDemoImageException, QueryParamDemoImageCommentException


class ImageDemoViewSet(BaseGenericViewSet, CreateModelMixin, ListModelMixin, RetrieveModelMixin):
    queryset = ImageDemo.objects.all()
    serializer_class = {"default" : ReadDemoImageSerializer, "create" : CreateDemoImageSerializer, 
                        "retrieve" : ReadDemoImageSerializer,}
    permission_classes = (ImageDemoPermission,)

    def get_queryset(self):
        if self.action == "list":
            order = self.request.GET.get('order')
            return super().get_queryset().filter(order = order)
        return super().get_queryset()
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        serializer.validated_data['size'] = serializer.validated_data['image'].size
        serializer.validated_data['format'] = serializer.validated_data['image'].content_type
        self.perform_create(serializer)
        instance = serializer.instance
        
        serializer_return = self.get_serializer(instance = instance, is_get = True)
        headers = self.get_success_headers(serializer_return.data)
        return Response(data = serializer_return.data, status= status.HTTP_201_CREATED, headers= headers)
    
    def list(self, request, *args, **kwargs):
        param = request.GET
        if not param.get('order'):
            raise QueryParamDemoImageException()
        return super().list(request, *args, **kwargs)
    

class ImageDemoCommentViewSet(BaseGenericViewSet, CreateModelMixin, ListModelMixin):
    
    queryset = ImageDemoComment.objects.all()
    serializer_class = {"default" : ReadDemoImageCommentSerializer, "create" : CreateDemoImageCommentSerializer,
                        "retrieve" : ReadDemoImageCommentSerializer,}
    permission_classes = (ImageDemoCommentPermission,)
    
    def get_queryset(self):
        if self.action == "list":
            image_demo = self.request.GET.get('image_demo')
            return super().get_queryset().filter(image_demo = image_demo)
        return super().get_queryset()
        
    def list(self, request, *args, **kwargs):
        param = request.GET
        if not param.get('image_demo'):
            raise QueryParamDemoImageCommentException()
        
        return super().list(request, *args, **kwargs)
    