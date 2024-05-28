from django.core.management.base import BaseCommand, CommandError
import schedule
import time
from media.execute import MediaService


class Command(BaseCommand):
    help = 'Auto create email for user about order change'
    
    def handle(self, *args, **kwargs):
        print("Start create email schedule")
        MediaService.create_mail_for_add_item()
        schedule.every(5).minutes.do(MediaService.create_mail_for_add_item)
        
        while True:
            schedule.run_pending()
            time.sleep(1)