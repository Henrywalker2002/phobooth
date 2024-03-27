from django_filters import rest_framework as filter
from order.models import OrderStatusChoice


class OrderFilter(filter.FilterSet):
    
    studio = filter.CharFilter(field_name="studio__code_name")
    customer = filter.CharFilter(field_name="customer__username")
    date_from = filter.DateFilter(field_name="created_at", lookup_expr="gte")
    date_end = filter.DateFilter(field_name="modified_at", lookup_expr="lte")
    status = filter.ChoiceFilter(field_name="status", choices=OrderStatusChoice.choices)