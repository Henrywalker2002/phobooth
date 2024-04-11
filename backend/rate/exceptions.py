from rest_framework.exceptions import APIException


class RateException(APIException):
    status_code = 400
    default_detail = "You already rated this item"
    default_code = "rate_exception"