from base.views import BaseModelViewSet
from category.models import Category
from category.serializers import CategorySerializer, CategoryDetailSerializer, CategorySummarySerializer
from category.filter import CategoryFilter
from category.permission import CategoryPermission


class CategoryViewSet(BaseModelViewSet):
    queryset = Category.objects.all()
    serializer_class = {"default": CategorySerializer,
                        "retrieve": CategoryDetailSerializer, "list": CategorySummarySerializer,}
    filterset_class = CategoryFilter
    search_fields = ["@title", "@description"]
    lookup_field = "code_name"
    permission_classes = [CategoryPermission]