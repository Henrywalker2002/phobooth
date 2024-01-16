from rest_framework import serializers
from cart.models import Cart
from item.serializers import ItemSerializer
from user.models import User


class CartSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    class Meta:
        model = Cart
        fields = ['id', 'customer', 'item', 'number']
        

class CartListSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    class Meta:
        model = Cart
        fields = ['id', 'item', 'number']