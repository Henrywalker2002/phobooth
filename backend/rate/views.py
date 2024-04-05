from base.views import BaseGenericViewSet
from rate.models import Rate, RatePicture
from rate.serializers import CreateRateSerializer, ReadRateSerializer
from rate.permission import RatePermission
from rate.exceptions import RateException
from rest_framework.mixins import CreateModelMixin
from rest_framework.response import Response
from rest_framework import status
from functools import reduce
from item.models import Item
from django.db.models import Avg
from django.db import transaction   


class RateViewSet(BaseGenericViewSet, CreateModelMixin):
    serializer_class = {'default' : CreateRateSerializer, 'retrieve' : ReadRateSerializer}
    queryset = Rate.objects.all()
    permission_classes = (RatePermission,)
    
    def update_star(self, item: Item):
        item.star = item.rates.aggregate(Avg('star'))['star__avg']
        item.save()
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        
        pictures = serializer.validated_data.pop('pictures', [])
        serializer.validated_data['user'] = request.user
        serializer.validated_data['item'] = serializer.validated_data['order_item'].item
        self.perform_create(serializer)
        rate = serializer.instance
        pic_lst = []
        for pic in pictures:
            pic_obj = RatePicture(rate = rate, picture = pic)
            pic_lst.append(pic_obj)
        if pic_lst:
            RatePicture.objects.bulk_create(pic_lst)
        
        self.update_star(rate.item)
        data = self.get_serializer(rate, is_get = True).data
        headers = self.get_success_headers(data)
        return Response(data, status = status.HTTP_201_CREATED, headers = headers)