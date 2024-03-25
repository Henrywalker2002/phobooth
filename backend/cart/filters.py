from django_filters import rest_framework as filter 


class CartFilter(filter.FilterSet):
    
    studio = filter.CharFilter(field_name="item__studio__code_name")
    date_from = filter.DateFilter(field_name="created_at", lookup_expr="gte")
    date_end = filter.DateFilter(field_name="modified_at", lookup_expr="lte")
    
