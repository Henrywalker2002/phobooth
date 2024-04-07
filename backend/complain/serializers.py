from rest_framework import serializers
from complain.models import Complain, ComplainPicture, ComplainStatusChoices
from user.serializers import UserSummarySerializer
from order.models import Order


class CompainPictureSerializer(serializers.ModelSerializer):
    
    picture = serializers.ImageField(use_url=True)
    
    class Meta:
        model = ComplainPicture
        fields = ['picture',]


class CreateComplainSerializer(serializers.ModelSerializer):
    
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())    
    pictures = serializers.ListField(
        child=serializers.ImageField(use_url=True), required=False, max_length=5)
    
    def validate_order(self, order):
        if order.customer != self.context['request'].user:
            raise serializers.ValidationError("Order does not belong to you")
        return order
    
    class Meta:
        model = Complain
        fields = ['order', 'title', 'type', 'description', 'pictures']


class ReadCompainSerializer(serializers.ModelSerializer):
    
    pictures = CompainPictureSerializer(many=True)
    user = UserSummarySerializer()
    staff_resolved = UserSummarySerializer()
    
    class Meta:
        model = Complain
        fields = ['id', 'staff_resolved', 'user', 'order', 'title', 'type', 'description', 'status', 'pictures', 'created_at', ]

class ComplainSummarySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Complain
        fields = ['id', 'title', 'status', 'type', 'description', 'created_at', ]


class UpdateComplainSerializer(serializers.ModelSerializer):
    
    def validate(self, attrs):
        if self.instance.status == ComplainStatusChoices.RESOLVED:
            raise serializers.ValidationError("Complain already resolved")
        return attrs
        
        
    class Meta:
        model = Complain
        fields = ['status', ]