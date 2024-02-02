from base.views import BaseModelViewSet
from category.models import Category
from category.serializers import CategorySerializer, CategoryDetailSerializer, CategorySummarySerializer


class CategoryViewSet(BaseModelViewSet):
    queryset = Category.objects.all()
    serializer_class = {"default": CategorySerializer,
                        "retrieve": CategoryDetailSerializer, "list": CategorySummarySerializer}
