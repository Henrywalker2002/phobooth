from django_filters import rest_framework as filter 
from item.models import ItemTypeChoices


class ItemFilter(filter.FilterSet):
    
    category = filter.CharFilter(field_name="category__code_name")
    type = filter.MultipleChoiceFilter(field_name= "type", choices = ItemTypeChoices.choices)
    studio = filter.CharFilter(field_name="studio__code_name")
    min_price = filter.NumberFilter(field_name="min_price", lookup_expr='gte')
    max_price = filter.NumberFilter(field_name="max_price", lookup_expr='lte')
    star = filter.NumberFilter(field_name="star", lookup_expr='gte')