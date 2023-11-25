from base.views import CustomModelViewSetBase
from category.models import Category
from category.serializers import CategorySerializer


class CategoryViewSet(CustomModelViewSetBase):
    queryset = Category.objects.all()
    serializer_class = {"default": CategorySerializer}