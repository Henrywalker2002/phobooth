from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin
from base.views import BaseGenericViewSet
from complain.models import Complain, ComplainPicture, ComplainStatusChoices
from complain.serializers import CreateComplainSerializer, ReadCompainSerializer, UpdateComplainSerializer
from complain.permission import CompainPermission
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from complain_forum.serializers import ReadReplySerializer


class ComplainViewSet(BaseGenericViewSet, ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin):
    queryset = Complain.objects.all()
    serializer_class = {
        "default": UpdateComplainSerializer,
        "create": CreateComplainSerializer,
        "list": ReadCompainSerializer,
        "retrieve": ReadCompainSerializer
    }
    permission_classes = (CompainPermission,)
    
    def get_queryset(self):
        if self.action == "list":
            return self.queryset.order_by('status', 'created_at')
        return self.queryset
        
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        pictures = serializer.validated_data.pop('pictures', [])
        serializer.validated_data['user'] = request.user    
        self.perform_create(serializer)
        conplain = serializer.instance
        pic_lst = []
        for pic in pictures:
            pic_obj = ComplainPicture(complain=conplain, picture=pic)
            pic_lst.append(pic_obj)
        
        if pic_lst:
            ComplainPicture.objects.bulk_create(pic_lst)
        
        data = self.get_serializer(conplain, is_get = True).data
        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        if serializer.validated_data.get('status') == ComplainStatusChoices.RESOLVED:
            serializer.validated_data['staff_resolved'] = request.user
        
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        data = self.get_serializer(instance, is_get=True).data
        return Response(data)
    
    @action(methods=['GET'], detail=True, url_path='replies')
    def get_replies(self, request, *args, **kwargs):
        queryset = self.get_object().replies.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = ReadReplySerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ReadReplySerializer(queryset, many=True)
        return Response(serializer.data)