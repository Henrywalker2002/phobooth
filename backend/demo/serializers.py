from rest_framework import serializers
from demo.models import ImageDemo, ImageDemoComment
from versatileimagefield.serializers import VersatileImageFieldSerializer
from user.serializers import UserSummarySerializer
from order.models import Order


class ReadDemoImageCommentSerializer(serializers.ModelSerializer):

    user = UserSummarySerializer()

    class Meta:
        model = ImageDemoComment
        fields = ['id', 'user', 'text', ]


class CreateDemoImageCommentSerializer(serializers.ModelSerializer):
    image_demo = serializers.PrimaryKeyRelatedField(
        queryset=ImageDemo.objects.all(), required=True)

    class Meta:
        model = ImageDemoComment
        fields = ['image_demo', 'text', ]


class CreateDemoImageSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(
        queryset=Order.objects.all(), required=True)
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = ImageDemo
        fields = ['image', 'title', 'description', 'order']


class ReadDemoImageSerializer(serializers.ModelSerializer):
    image = VersatileImageFieldSerializer(
        sizes='demo_image'
    )
    comment = ReadDemoImageCommentSerializer(many=True)

    class Meta:
        model = ImageDemo
        fields = ['id', 'image', 'title', 'description', 'size',
                  'format', 'height', 'width', 'created_at', 'modified_at', 'comment',]
