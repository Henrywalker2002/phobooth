from django_filters import rest_framework as filter
from payment.models import PaymentStatusChoices


class PaymentFilter(filter.FilterSet):
    status = filter.MultipleChoiceFilter(field_name="status", choices = PaymentStatusChoices.choices)
    order = filter.NumberFilter(field_name="order__id") 