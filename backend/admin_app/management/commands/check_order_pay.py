from django.core.management.base import BaseCommand, CommandError
import schedule
from order.execute import check_order_and_pay
import time


class Command(BaseCommand):
    help = 'Check order and pay for studio'
    
    
    def handle(self, *args, **kwargs):
        print("Start check order and pay schedule")
        check_order_and_pay()
        
        schedule.every().day.at("00:00").do(check_order_and_pay)
        
        while True:
            schedule.run_pending()
            time.sleep(1)