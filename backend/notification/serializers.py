from notification.models import Notification
from rest_framework import serializers  


class ReadNotificationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Notification
        fields = ['id', 'subject', 'verb', 'direct_object', 'indirect_object', 
                  'prepositional_object', 'context', 'is_read', 'redirect_type', 
                  'redirect_id', 'created_at', ]