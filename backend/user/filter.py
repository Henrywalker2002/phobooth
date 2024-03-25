from django_filters import rest_framework as filter


class StaffFilter(filter.FilterSet):
    
    username = filter.CharFilter(field_name="username")
    email = filter.CharFilter(field_name="email")
    phone = filter.CharFilter(field_name="phone")
    role = filter.CharFilter(field_name="role__code_name")
    is_active = filter.BooleanFilter(field_name="is_active")