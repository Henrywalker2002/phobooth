from rest_framework.exceptions import APIException


class MethodNotAllowed(APIException):
    status_code = 405
    default_detail = 'Method Not Allowed'
    default_code = 'method_not_allowed'