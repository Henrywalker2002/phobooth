from rest_framework import serializers
from cart.models import Cart
from item.serializers import ItemSerializer


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['id', 'customer', 'item', 'number']
        

class CartListSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    class Meta:
        model = Cart
        fields = ['id', 'item', 'number']