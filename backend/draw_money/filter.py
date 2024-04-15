from django_filters import rest_framework as filter
from draw_money.models import DrawMoneyStatusChoices

class DrawMoneyFilter(filter.FilterSet):
    status = filter.ChoiceFilter(choices=DrawMoneyStatusChoices.choices)
    studio = filter.CharFilter(field_name="studio__code_name")
    ordering = filter.OrderingFilter(
        fields = (
            ('modified_at', 'modified_at'),
            ('created_at', 'created_at')
        )
    )
    