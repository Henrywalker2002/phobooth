from order_history.models import OrderHistory
from media.execute import MediaService
from order.models import OrderStatusChoice

class OrderItemChange:
    
    def __init__(self, item_name = None, variation_name = None, quantity = None, price = None):
        self.item_name = item_name
        self.variation_name = variation_name
        self.quantity = quantity
        self.price = price
    
    def __dict__(self):
        dict = {}
        lst = ["item_name", "variation_name", "quantity", "price"]
        for attr in lst:
            if not attr.startswith("__") and not callable(getattr(self, attr)):
                if getattr(self, attr) is not None:
                    dict[attr] = getattr(self, attr)
        return dict
    
def create_order_price_history(order, old_price, new_price):

    if order.status == OrderStatusChoice.ORDERED:
        return
    
    OrderHistory.objects.create(
        order = order,
        fields = "total_price",
        old_value = old_price,
        new_value = new_price
    )
    # send mail and add notification
    
def create_order_item_history(new_instance, type, old_instance=None):
    
    order_history = None
    if new_instance.order.status == OrderStatusChoice.ORDERED:
        return
    if type == "add": 
        new_value = OrderItemChange()
        if new_instance.item:
            new_value.item_name = new_instance.item.name
        else:
            new_value.variation_name = new_instance.variation.product.name
        new_value.quantity = new_instance.quantity
        new_value.price = new_instance.price

        order_history = OrderHistory.objects.create(order = new_instance.order, order_item = new_instance, 
                                    fields = "order_item", new_value = new_value.__dict__())

    else:
        old_value = OrderItemChange()
        new_value = OrderItemChange()
        change_fields = ['quantity', 'price']
        for field in change_fields:
            if getattr(new_instance, field) != getattr(old_instance, field):
                setattr(old_value, field, getattr(old_instance, field))
                setattr(new_value, field, getattr(new_instance, field))
        if old_value.__dict__():
            order_history = OrderHistory.objects.create(order = new_instance.order, order_item = new_instance, 
                                    fields = "order_item", old_value = old_value.__dict__(), new_value = new_value.__dict__())
    if order_history:
        MediaService.create_email_for_order_change(order_history)
                       