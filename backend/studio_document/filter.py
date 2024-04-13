from django_filters import rest_framework as filter
from studio_document.models import StudioDocumentStatusChoices
from django_filters.filters import OrderingFilter


class StudioDocumentFilter(filter.FilterSet):
    studio = filter.CharFilter(field_name="studio__code_name")
    status = filter.ChoiceFilter(field_name="status",
                                 choices=StudioDocumentStatusChoices.choices)
    min_number_attempts = filter.NumberFilter(
        field_name="number_attempts", lookup_expr="gte")
    max_number_attempts = filter.NumberFilter(
        field_name="number_attempts", lookup_expr="lte")
    date_from = filter.DateFilter(field_name="created_at", lookup_expr="gte")
    date_end = filter.DateFilter(field_name="created_at", lookup_expr="lte")
    ordering = OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
        )
    )
