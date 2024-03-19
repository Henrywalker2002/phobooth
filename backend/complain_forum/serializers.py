from rest_framework import serializers
from complain_forum.models import Reply, ReplyPicture
from user.serializers import UserSummarySerializer
from complain.models import Complain


class CreateReplySerializer(serializers.ModelSerializer):
    
    pictures = serializers.ListField(
        child=serializers.ImageField(use_url=True), required=False, max_length=5)
    complain = serializers.PrimaryKeyRelatedField(queryset = Complain.objects.all())
    
    class Meta:
        model = Reply
        fields = ['complain', 'text', 'pictures']
        

class ReplyImageSerializer(serializers.ModelSerializer):
    
    picture = serializers.ImageField(use_url=True)
    
    class Meta:
        model = ReplyPicture
        fields = ['picture', ]


class ReadReplySerializer(serializers.ModelSerializer):
    
    pictures = ReplyImageSerializer(many=True)
    user = UserSummarySerializer()
    
    class Meta:
        model = Reply
        fields = ['id', 'user', 'complain', 'text', 'pictures']