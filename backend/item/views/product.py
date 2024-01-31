from base.views import CustomModelViewSetBase
from item.models import Item, Option, OptionValue, Variation, ItemTypeChoices, ItemPicture
from item.serializers.product import (ItemProductSerializer, ItemProductDetailSerializer, 
                                      VariationUpdateSerializer, ItemProductUpdateSerializer)
from item.serializers.item import ItemSummarySerializer
from item.permission import ItemPermission, VariationPermission
from rest_framework import status
from rest_framework.response import Response
from django.db import transaction   
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import UpdateModelMixin


class ProductViewSet(CustomModelViewSetBase):

    queryset = Item.objects.all()
    serializer_class = {'default': ItemProductSerializer, "retrieve": ItemProductDetailSerializer, 
                        "update" : ItemProductUpdateSerializer, "partial_update": ItemProductUpdateSerializer, 
                        "list": ItemSummarySerializer}
    permission_classes = [ItemPermission]
    
    def get_queryset(self):
        return super().get_queryset().filter(type=ItemTypeChoices.PRODUCT, studio=self.request.user.studio)

    @transaction.atomic
    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        pictures = serializer.validated_data.pop('pictures', [])
        serializer.validated_data['type'] = ItemTypeChoices.PRODUCT
        option = serializer.validated_data.pop('option', None)
        serializer.save()
        
        item = serializer.instance
        
        for picture in pictures:
            ItemPicture.objects.create(item = item, picture = picture)

        instance = serializer.instance
        if option:
            option_lst = []
            for option_name in option.get("option_names"):
                option_obj = Option.objects.create(
                    name=option_name, product=serializer.instance)
                option_lst.append(option_obj)

            option_value_dict = {}
            for variation in option.get("variation"):
                option_values = []
                for i in range(0, len(variation.get("option_values"))):
                    option_value = variation.get("option_values")[i]
                    if option_value not in option_value_dict.keys():
                        option_value_dict[option_value] = OptionValue.objects.create(
                            name=option_value, option=option_lst[i])
                    option_values.append(option_value_dict[option_value])
                variation_obj = Variation.objects.create(
                    price=variation.get("price"), stock=variation.get("stock"), product=instance)
                variation_obj.value.set(option_values)
        
        data = self.get_serializer(instance, is_get = True).data
        header = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=header)
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        parial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial= parial)
        serializer.is_valid(raise_exception=True)
        pictures = serializer.validated_data.pop('pictures', [])
        
        if pictures:
            for picture in instance.pictures.all(): 
                picture.delete()
        
            for picture in pictures:
                image_obj = ItemPicture()
                image_obj.item = instance
                image_obj.picture = picture
                image_obj.save()
        
        self.perform_update(serializer)
        
        return Response(self.get_serializer(instance, is_get = True).data)
    

class VariationViewSet(GenericViewSet, UpdateModelMixin):
    
    queryset = Variation.objects.all()
    serializer_class = VariationUpdateSerializer
    permission_classes = [VariationPermission]