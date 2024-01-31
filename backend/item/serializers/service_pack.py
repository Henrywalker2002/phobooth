from rest_framework import serializers
from item.models import Item, ItemPicture
from item.serializers.item import ItemPictureSerializer, ItemDetailSerializer
from category.models import Category, CategoryTypeChoices



class ServicePackSerializer(serializers.ModelSerializer):

    item = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all().exclude(type="SERVICE_PACK"), many=True)
    pictures = serializers.ListField(
        child=serializers.ImageField(use_url=True), required=False, max_length=5)
    category = serializers.PrimaryKeyRelatedField(queryset = Category.objects.filter(type=CategoryTypeChoices.SERVICE))

    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'category', 'pictures', 'status',
                  'min_price', 'max_price', 'item']
        

class ServicePackDetailSerializer(serializers.ModelSerializer):

    pictures = ItemPictureSerializer(read_only=True, many=True)
    item = ItemDetailSerializer(read_only=True, many=True)

    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'category', 'pictures', 'status',
                  'min_price', 'max_price', 'item']
