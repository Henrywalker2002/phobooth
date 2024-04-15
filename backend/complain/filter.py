from django_filters import rest_framework as filters
from complain.models import ComplainStatusChoices


class ComplainFilter(filters.FilterSet):
    studio = filters.CharFilter(field_name="order__studio__code_name")
    status = filters.ChoiceFilter(field_name="status", choices = ComplainStatusChoices.choices)
    user = filters.CharFilter(field_name="user__username")
    order = filters.CharFilter(field_name="order__id")
    ordering = filters.OrderingFilter(
        fields = (
            ('created_at', 'created_at'),
            ('modified_at', 'modified_at'),
        )
    )
    