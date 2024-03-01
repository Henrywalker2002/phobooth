from rest_framework.exceptions import APIException


class UpdateCompletedOrderException(APIException):
    status_code = 400
    default_detail = 'You cannot update a completed order'
    default_code = 'update_completed_order'
    

class DeleteLastOrderItemException(APIException):
    status_code = 400
    default_detail = 'Order must have at least 1 item'
    default_code = 'delete_last_order_item'


class UpdateCompletedOrderPaidException(APIException):
    """
    Exception for updating completed order when it is not completed paid 
    """
    status_code = 400
    default_detail = 'You cannot complete order if that order have not been paid completed yet'
    default_code = 'update_paid_order_item'


class UpdateCompletedOrderOrderItemException(APIException):
    status_code = 400
    default_detail = 'You cannot complete order if have any order item is not completed'
    default_code = 'update_completed_order_order_item'
    

class UpdateOrderItemException(APIException):
    """You cannot update this item in order"""
    status_code = 400
    default_detail = 'You cannot update this item in order'
    default_code = 'update_order_item'