from base.views import BaseGenericViewSet
from complain_forum.models import Reply, ReplyPicture
from complain.models import ComplainStatusChoices
from complain_forum.serializers import CreateReplySerializer, ReadReplySerializer
from rest_framework.mixins import CreateModelMixin, ListModelMixin
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction


class ReplyViewSet(BaseGenericViewSet, CreateModelMixin, ListModelMixin):
    queryset = Reply.objects.all()
    serializer_class = {
        "default": ReadReplySerializer,
        "create": CreateReplySerializer,
        "list": ReadReplySerializer,
        "retrieve": ReadReplySerializer
    }
    filterset_fields = ['complain']
    
    def get_queryset(self):
        if self.action == "list":
            return self.queryset.order_by('created_at')
        return self.queryset
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        pictures = serializer.validated_data.pop('pictures', [])
        serializer.validated_data['user'] = request.user    
        self.perform_create(serializer)
        reply = serializer.instance
        img_lst = []
        for img in pictures:
            img_obj = ReplyPicture(reply=reply, picture= img)
            img_lst.append(img_obj)
            
        if img_lst:
            ReplyPicture.objects.bulk_create(img_lst)
        
        if reply.complain.status == ComplainStatusChoices.PENDING:
            reply.complain.status = ComplainStatusChoices.IN_PROGRESS
            reply.complain.save()
        data = self.get_serializer(reply, is_get = True).data
        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)