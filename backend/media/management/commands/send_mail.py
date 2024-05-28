import schedule
from django.core.management.base import BaseCommand
from media.execute import MediaService  
import time 


class Command(BaseCommand):
    help = "schedule send mail per 5 minutes"
    
    def handle(self, *args, **kwargs):
        print("Start send mail schedule")
        MediaService.send_mail()
        
        schedule.every(5).minutes.do(MediaService.send_mail)
        
        while True:
            schedule.run_pending()
            time.sleep(1)