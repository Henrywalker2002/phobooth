from rest_framework import serializers
from order_history.models import OrderHistory

class OrderHistorySummarySerializer(serializers.ModelSerializer):
    
    class Meta: 
        model = OrderHistory
        fields = ['id', 'fields', 'old_value', 'new_value', 'status', 'created_at', 'denied_reason',]


class UpdateOrderHistorySerializer(serializers.ModelSerializer):
    
    class Meta: 
        model = OrderHistory
        fields = ['status', 'denied_reason', ]
        