from rest_framework.exceptions import APIException


class StudioDocumentAlreadyExistsException(APIException):
    """Studio document already exists or is pending."""
    status_code = 400
    default_detail = "Studio document already exists or is pending."
    default_code = "studio_document_already_exists"


class StudioDocumentUpdateException(APIException):
    """You can not updated a done request."""
    status_code = 400
    default_detail = "You can not updated a done request."
    default_code = "studio_document_update_exception"