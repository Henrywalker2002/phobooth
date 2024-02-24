from rest_framework.exceptions import APIException


class UpdateCompletedOrderException(APIException):
    status_code = 400
    default_detail = 'You cannot update a completed order'
    default_code = 'update_completed_order'
    

class DeleteLastOrderItemException(APIException):
    status_code = 400
    default_detail = 'Order must have at least 1 item'
    default_code = 'delete_last_order_item'