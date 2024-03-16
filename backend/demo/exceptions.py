from rest_framework.exceptions import APIException


class QueryParamDemoImageException(APIException):
    status_code = 400
    default_detail = "You must provide order id in query param for image demo"
    default_code = "invalid_query_param"


class QueryParamDemoImageCommentException(APIException):
    status_code = 400
    default_detail = "You must provide image demo id in query param for image demo comment"
    default_code = "invalid_query_param"