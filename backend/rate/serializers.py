from rest_framework import serializers
from rate.models import Rate, RatePicture
from user.serializers import UserSummarySerializer
from order.models import OrderStatusChoice


class RatePictureSerializer(serializers.ModelSerializer):
    
    picture = serializers.ImageField(use_url=True)
    
    class Meta:
        model = RatePicture
        fields = ['picture']


class CreateRateSerializer(serializers.ModelSerializer):
    
    pictures = serializers.ListField(child = serializers.ImageField(), required = False
                                     , max_length = 5) 
    star = serializers.IntegerField(min_value = 1, max_value = 5)  
    
    def validate_star(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Star must be between 1 and 5")
        return value
    
    def validate_order_item(self, order_item):
        if order_item.order.status != OrderStatusChoice.COMPLETED:
            raise serializers.ValidationError("Order is not completed yet")
        if Rate.objects.filter(user = self.context['request'].user, order_item = order_item).exists():
            raise serializers.ValidationError("You already rated this item")
        if order_item.order.customer != self.context['request'].user:
            raise serializers.ValidationError("You can only rate your own orders")
        
        return order_item
    
    class Meta:
        model = Rate 
        fields = ['order_item', 'star', 'comment', 'pictures']


class ReadRateSerializer(serializers.ModelSerializer):
    pictures = RatePictureSerializer(many=True)
    user = UserSummarySerializer()
    
    class Meta:
        model = Rate 
        fields = ['id', 'item', 'user', 'star', 'comment', 'pictures', ]