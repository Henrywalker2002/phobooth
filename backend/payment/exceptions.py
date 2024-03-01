from rest_framework.exceptions import APIException


class UpdatePaidPaymentException(APIException):
    status_code = 400
    default_detail = 'You cannot update a paid payment'
    default_code = 'update_paid_payment'


class DeletePaidPaymentException(APIException):
    status_code = 400
    default_detail = 'You cannot delete a paid payment'
    default_code = 'delete_paid_payment'
    

class PassOrderIdException(APIException):
    status_code = 400
    default_detail = 'You must pass the order id'
    default_code = 'pass_order_id'


class AmountExceedException(APIException):
    status_code = 400
    default_detail = 'The amount exceed the remaining amount'
    default_code = 'amount_exceed'


class PaymentExpiredException(APIException):
    status_code = 400
    default_detail = 'The payment is expired'
    default_code = 'payment_expired'


class PaymentPaidException(APIException):
    status_code = 400
    default_detail = 'The payment is paid'
    default_code = 'payment_paid'
    

class PaymentExceedTimeException(APIException):
    status_code = 400
    default_detail = 'The payment is exceed the time in day - max 10 times in day'
    default_code = 'payment_exceed_time'


class AddPaymentOrderedOrderException(APIException):
    status_code = 400
    default_detail = 'You cannot add payment to ordered order'
    default_code = 'add_payment_ordered_order'