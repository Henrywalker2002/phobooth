from rest_framework import serializers
from media.models import Media  


class MediaSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Media 
        fields = ['id', 'media_from', 'media_to', 'content', 'content_type', 'send_method', 'status', 'retry_count']        