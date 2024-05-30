from media.models import Media, MediaContentTypeChoices, MediaSendMethodChoices, MediaStatusChoices
from django.template import loader
from django.conf import settings
from smtplib import SMTPException
from django.db import transaction
from django.db.models import Q
from django.core import mail
from django.conf import settings
from order_history.models import OrderHistory
from order.models import Order
from payment.models import Payment

class OrderItemChange:
    
    def __init__(self, item_name = None, variation_name = None, quantity = None, price = None):
        self.item_name = item_name
        self.variation_name = variation_name
        self.quantity = quantity
        self.price = price

class MediaService:
    
    @staticmethod
    @transaction.atomic
    def create_mail_for_add_item():
        tempalate = loader.get_template('order_history.html')
        order_history_lst = OrderHistory.objects.filter(is_created_mail = False, fields = "order_item")
        history_cluster = {}
        for history in order_history_lst:
            history.is_created_mail = True
            if history.order.id not in history_cluster:
                history_cluster[history.order.id] = []
            history_cluster[history.order.id].append(history)
        for order_id, history_lst in history_cluster.items():
            item_change_lst = []
            for history in history_lst:
                item_change = OrderItemChange(**history.new_value)
                item_change_lst.append(item_change)
            link = "http://localhost:5173/order/detail/" + str(order_id) + "/"
            context = {
                'list': item_change_lst,
                'user' : history.order.customer,
                'order' : history.order,
                'link' : link
            }
            content = tempalate.render(context)
            media_to = history.order.customer.email
            media_from = settings.EMAIL_HOST_USER
            media = Media.objects.create(media_from = media_from, media_to = media_to, 
                                         content = content, content_type = MediaContentTypeChoices.HTML,
                                         send_method = MediaSendMethodChoices.EMAIL, 
                                         title = f"Thay thay đổi về đơn hàng {history.order.id}")
        OrderHistory.objects.bulk_update(order_history_lst, ['is_created_mail'])
    
    @staticmethod
    def get_list_of_order_item_created(order: Order):
        lst = []
        for order_item in order.order_item.all():
            if order_item.item is not None:
                name = order_item.item.name
                if order_item.item.fixed_price is not None:
                    price = order_item.item.fixed_price
                else:
                    price = f"{order_item.item.min_price} - {order_item.item.max_price}"
            else:
                name = order_item.variation.product.name
                price = order_item.variation.price
            order_item_change = OrderItemChange(item_name=name, quantity= order_item.quantity, price= price)
            lst.append(order_item_change)
        return lst 
    
    @staticmethod
    @transaction.atomic
    def create_email_for_order(template_name: str, context: dict, email_to: str, title: str) -> Media:
        template = loader.get_template(template_name)
        content = template.render(context)
        media = Media.objects.create(media_from=settings.EMAIL_HOST_USER,
                                     media_to=email_to,
                                     content=content,
                                     content_type=MediaContentTypeChoices.HTML,
                                     send_method=MediaSendMethodChoices.EMAIL,
                                     title=title)
        return media
    
    @staticmethod
    @transaction.atomic
    def create_email_for_create_order(order : Order):
        lst = MediaService.get_list_of_order_item_created(order)
        customer_context = {
            'order': order,
            'user': order.customer,
            'list': lst,
            'studio': order.studio,
        }
        MediaService.create_email_for_order(template_name='create_order_customer.html',
                                            context=customer_context,
                                            email_to=order.customer.email,
                                            title=f"Xác nhận đơn hàng {order.id}")
        studio_context = {
            'order': order,
            'user': order.studio.owner,
            'list': lst,
            'customer': order.customer
        }
        MediaService.create_email_for_order(template_name='create_order_studio.html',
                                            context=studio_context,
                                            email_to=order.studio.email,
                                            title=f"Xác nhận đơn hàng {order.id}")
        
    @staticmethod
    def get_list_of_order_item(order: Order):
        lst = []
        for order_item in order.order_item.all():
            if order_item.item is not None:
                name = order_item.item.name
            else:
                name = order_item.variation.product.name
            price = order_item.price
            order_item_change = OrderItemChange(item_name=name, quantity= order_item.quantity, price= price)
            lst.append(order_item_change)
        return lst 
    
    @staticmethod
    def create_email_for_accept_order(order: Order):
        lst = MediaService.get_list_of_order_item(order)
        context = {
            'order' : order,
            'list' : lst,
            'user' : order.customer,
        }
        MediaService.create_email_for_order(template_name='accept_order.html',
                                            context=context,
                                            email_to=order.customer.email,
                                            title=f"Xác nhận đơn hàng {order.id}")
    
    @staticmethod
    def create_email_complete_order(order : Order):
        lst = MediaService.get_list_of_order_item(order)
        context = {
            'order': order,
            'list': lst,
            'user': order.customer,
        }
        MediaService.create_email_for_order(template_name='complete_order.html',
                                            context=context,
                                            email_to=order.customer.email,
                                            title=f"Xác nhận đơn hàng {order.id}")
    
    @staticmethod
    @transaction.atomic
    def create_email_for_cancel_order(order: Order): 
        context_customer = {
            'order': order,
            'user': order.customer,
        }
        template = loader.get_template('cancel_order.html')
        Media.objects.create(media_from=settings.EMAIL_HOST_USER,
                             media_to=order.customer.email,
                             content=template.render(context_customer),
                             content_type=MediaContentTypeChoices.HTML,
                             send_method=MediaSendMethodChoices.EMAIL,
                             title=f"Hủy đơn hàng {order.id}")

        context_studio = {
            'order': order,
            'user': order.studio.owner,
        }
        template = loader.get_template('cancel_order.html')
        Media.objects.create(media_from=settings.EMAIL_HOST_USER,
                                media_to=order.studio.email,
                                content=template.render(context_studio),
                                content_type=MediaContentTypeChoices.HTML,
                                send_method=MediaSendMethodChoices.EMAIL,
                                title=f"Hủy đơn hàng {order.id}")
        
    
    @staticmethod
    def create_email_for_create_payment(payment : Payment) :
        order = payment.order
        context = {
            'order': order,
            'payment': payment,
            'user': order.customer,
        }
        content = loader.get_template('create_payment.html').render(context)
        media = Media.objects.create(media_from=settings.EMAIL_HOST_USER,
                                    media_to=order.customer.email,
                                    content=content,
                                    content_type=MediaContentTypeChoices.HTML,
                                    send_method=MediaSendMethodChoices.EMAIL,
                                    title=f"Xác nhận thanh toán {payment.id}")
    
    @staticmethod
    def create_email_for_pay_payment(payment : Payment):
        order = payment.order
        context_customer = {
            'order': order,
            'payment': payment,
            'user': order.customer,
        }
        customer_content = loader.get_template('pay_payment_customer.html').render(context_customer)
        Media.objects.create(media_from=settings.EMAIL_HOST_USER,
                            media_to=order.customer.email,
                            content=customer_content,
                            content_type=MediaContentTypeChoices.HTML,
                            send_method=MediaSendMethodChoices.EMAIL,
                            title=f"Xác nhận thanh toán {payment.id}")
        context_studio = {
            'order': order,
            'payment': payment,
            'user': order.studio.owner,
        }
        studio_content = loader.get_template('pay_payment_studio.html').render(context_studio)
        Media.objects.create(media_from=settings.EMAIL_HOST_USER,
                            media_to=order.studio.email,
                            content=studio_content,
                            content_type=MediaContentTypeChoices.HTML,
                            send_method=MediaSendMethodChoices.EMAIL,
                            title=f"Xác nhận thanh toán {payment.id}")
    
    @staticmethod
    def send_mail():
        instance_lst = Media.objects.filter(Q(status = MediaStatusChoices.IN_QUEUE) | Q(status = MediaStatusChoices.FAIL)
                                            & Q(retry_count__lt = 5) & Q(send_method = MediaSendMethodChoices.EMAIL))
        connection = mail.get_connection()
        connection.open()
        
        for instance in instance_lst:
            if instance.media_from == "davisdavis448@gmail.com":
                instance.delete()
                continue
            instance.status = MediaStatusChoices.IN_PROCESS
            instance.save()

            email = mail.EmailMessage(subject= instance.title, body=instance.content,
                                from_email=instance.media_from, to=[instance.media_to])
            if instance.content_type == MediaContentTypeChoices.HTML:
                email.content_subtype = 'html'

            try:
                connection.send_messages([email])
                instance.status = MediaStatusChoices.SUCCESS
                instance.save()
            except SMTPException as e:
                instance.retry_count += 1
                instance.status = MediaStatusChoices.FAIL
                print(e)
                instance.save()
                
        connection.close()