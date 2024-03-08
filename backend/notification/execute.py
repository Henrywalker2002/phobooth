from notification.models import (
    Notification, NotificationVerbChoices, 
    NotificationRedirectTypeChoices, NotificationPrepositionalObjectChoices)
from order.models import Order, OrderItem
from payment.models import Payment


class NotificationService:
    
    @staticmethod
    def user_create_order(order: Order):
        user = order.studio.owner 
        subject = order.customer.full_name
        verb = NotificationVerbChoices.CREATED
        direct_object = f"order {order.id}"
        redirect_type = NotificationRedirectTypeChoices.ORDER
        redirect_id = order.id
        
        Notification.objects.create(
            user=user,
            subject=subject,
            verb=verb,
            direct_object=direct_object,
            redirect_type=redirect_type,
            redirect_id=redirect_id
        )
        
    @staticmethod    
    def user_pay(payment : Payment):
        user = payment.order.studio.owner
        subject = payment.order.customer.full_name
        verb = NotificationVerbChoices.PAID
        direct_object = f"payment {payment.id}"
        prepositional_object = NotificationPrepositionalObjectChoices.FOR
        context = f"order {payment.order.id}"
        redirect_type = NotificationRedirectTypeChoices.ORDER
        redirect_id = payment.order.id
        
        Notification.objects.create(
            user=user,
            subject=subject,
            verb=verb,
            direct_object=direct_object,
            prepositional_object=prepositional_object,
            context=context,
            redirect_type=redirect_type,
            redirect_id=redirect_id
        )
    
    @staticmethod
    def studio_completed_order(order : Order):
        user = order.customer
        subject = order.studio.friendly_name
        verb = NotificationVerbChoices.COMPLETED
        direct_object = f"order {order.id}"
        redirect_type = NotificationRedirectTypeChoices.ORDER
        redirect_id = order.id
        
        Notification.objects.create(
            user=user,
            subject=subject,
            verb=verb,
            direct_object=direct_object,
            redirect_type=redirect_type,
            redirect_id=redirect_id
        )
        
    @staticmethod
    def studio_create_payment(payment: Payment):
        user = payment.order.customer
        subject = payment.order.studio.friendly_name
        verb = NotificationVerbChoices.CREATED
        direct_object = f"payment {payment.id}"
        prepositional_object = NotificationPrepositionalObjectChoices.FOR
        context = f"order {payment.order.id}"
        redirect_type = NotificationRedirectTypeChoices.ORDER
        redirect_id = payment.order.id  
        
        Notification.objects.create(
            user=user,
            subject=subject,
            verb=verb,
            direct_object=direct_object,
            prepositional_object=prepositional_object,
            context=context,
            redirect_type=redirect_type,
            redirect_id=redirect_id
        )
    
    @staticmethod
    def studio_add_item_to_order(order_item : OrderItem):
        user = order_item.order.customer
        subject = order_item.order.studio.friendly_name
        verb = NotificationVerbChoices.ADD
        direct_object = f"item {order_item.item.name}"
        prepositional_object = NotificationPrepositionalObjectChoices.TO
        context = f"order {order_item.order.id}"
        redirect_type = NotificationRedirectTypeChoices.ORDER
        redirect_id = order_item.order.id
        
        Notification.objects.create(
            user=user,
            subject=subject,
            verb=verb,
            direct_object=direct_object,
            prepositional_object=prepositional_object,
            context=context,
            redirect_type=redirect_type,
            redirect_id=redirect_id
        ) 
    
    @staticmethod
    def studio_accept_order(order : Order):
        user = order.customer
        subject = order.studio.friendly_name
        verb = NotificationVerbChoices.ACCEPTED
        direct_object = f"order {order.id}"
        prepositional_object = NotificationPrepositionalObjectChoices.WITH
        context = f"price {order.total_price}"
        redirect_type = NotificationRedirectTypeChoices.ORDER
        redirect_id = order.id
        
        Notification.objects.create(
            user=user,
            subject=subject,
            verb=verb,
            direct_object=direct_object,
            prepositional_object=prepositional_object,
            context=context,
            redirect_type=redirect_type,
            redirect_id=redirect_id
        )
    
    @staticmethod
    def studio_deny_order(order : Order):
        user = order.customer 
        subject = order.studio.friendly_name
        verb = NotificationVerbChoices.DENIED
        direct_object = f"order {order.id}"
        redirect_type = NotificationRedirectTypeChoices.ORDER
        redirect_id = order.id
        
        Notification.objects.create(
            user=user,
            subject=subject,
            verb=verb,
            direct_object=direct_object,
            redirect_type=redirect_type,
            redirect_id=redirect_id
        )

    @staticmethod
    def user_cancel_order(order : Order):
        user = order.studio.owner
        subject = order.customer.full_name
        verb = NotificationVerbChoices.CANCELED
        direct_object = f"order {order.id}"
        redirect_type = NotificationRedirectTypeChoices.ORDER
        redirect_id = order.id
        
        Notification.objects.create(
            user=user,
            subject=subject,
            verb=verb,
            direct_object=direct_object,
            redirect_type=redirect_type,
            redirect_id=redirect_id
        )