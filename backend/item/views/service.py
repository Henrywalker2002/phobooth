from base.views import CustomModelViewSetBase
from item.models import Item, ItemTypeChoices, ItemPicture
from item.serializers.service import ItemServicesSerializer
from item.serializers.item import ItemDetailSerializer, ItemSummarySerializer
from item.permission import ItemPermission
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status


class ItemServicesViewset(CustomModelViewSetBase):
    queryset = Item.objects.all()
    serializer_class = {"default": ItemServicesSerializer,
                        "retrieve": ItemDetailSerializer, "list": ItemSummarySerializer}
    permission_classes = [ItemPermission]

    def get_queryset(self):
        return super().get_queryset().filter(type__in=[ItemTypeChoices.SERVICE, ItemTypeChoices.ACCESSORY], 
                                             studio=self.request.user.studio)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
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
