from django.core.management.base import BaseCommand, CommandError
import schedule
from order.execute import check_order_item
import time


class Command(BaseCommand):
    help = 'Check order_item and update order total_price'
    
    
    def handle(self, *args, **kwargs):
        check_order_item()
        
        schedule.every().day.at("00:00").do(check_order_item)
        
        while True:
            schedule.run_pending()
            time.sleep(1)