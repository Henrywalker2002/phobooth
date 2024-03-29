from django_filters import rest_framework as filter 
from category.models import CategoryTypeChoices

class CategoryFilter(filter.FilterSet):
    
    type = filter.ChoiceFilter(field_name="type", choices=CategoryTypeChoices.choices)
    code_name = filter.CharFilter(field_name="code_name", lookup_expr="icontains")
