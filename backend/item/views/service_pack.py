from base.views import CustomModelViewSetBase
from item.models import Item, Option, OptionValue, Variation, ItemTypeChoices, ItemPicture
from item.permission import ItemPermission
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status
from item.serializers.service_pack import ServicePackSerializer, ServicePackDetailSerializer
from item.serializers.item import ItemDetailSerializer


class ServicePackItemViewSet(CustomModelViewSetBase):
    queryset = Item.objects.all()
    serializer_class = {"default": ServicePackSerializer, "retrieve": ServicePackDetailSerializer}
    permission_classes = [ItemPermission]
    
    
    def get_queryset(self):
        return super().get_queryset().filter(type=ItemTypeChoices.SERVICE_PACK, studio=self.request.user.studio)
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['type'] = ItemTypeChoices.SERVICE_PACK
        pictures = serializer.validated_data.pop('pictures', [])
        self.perform_create(serializer)

        item = serializer.instance

        for picture in pictures:
            ItemPicture.objects.create(item=item, picture=picture)

        data = self.get_serializer(item, is_get=True).data
        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        parial = kwargs.pop('partial', False)
        serializer = self.get_serializer(
            instance, data=request.data, partial=parial)
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

        return Response(self.get_serializer(instance, is_get=True).data)

    
