from media.models import Media, MediaContentTypeChoices, MediaSendMethodChoices, MediaStatusChoices
from django.template import loader
from django.conf import settings
from smtplib import SMTPException
from django.db.models import Q
from django.core import mail
from django.conf import settings


class MediaService:
    
    @staticmethod
    def create_email_for_order_change(order_history):
        tempalate = loader.get_template('order_history.html')
        context = {
            'new_value': dict(order_history.new_value),
        }
        content = tempalate.render(context)
        
        media_to = order_history.order.customer.email
        media_from = settings.EMAIL_HOST_USER
        media = Media.objects.create(media_from = media_from, media_to = media_to, 
                                     content = content, content_type = MediaContentTypeChoices.HTML,
                                     send_method = MediaSendMethodChoices.EMAIL)
    
    
    @staticmethod
    def send_mail():
        instance_lst = Media.objects.filter(Q(status = MediaStatusChoices.IN_QUEUE) | Q(status = MediaStatusChoices.FAIL)
                                            & Q(retry_count__lt = 3) & Q(send_method = MediaSendMethodChoices.EMAIL))
        connection = mail.get_connection()
        connection.open()
        
        for instance in instance_lst:
            instance.status = MediaStatusChoices.IN_PROCESS
            instance.save()

            email = mail.EmailMessage(subject="notification", body=instance.content,
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
                instance.save()
                
        connection.close()