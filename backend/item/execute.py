from item.models import Item, ItemTypeChoices, ItemPicture
import os


def create_transport_service(studio):
    transport_service = Item.objects.create(
        name = "Dịch vụ vận chuyển",
        description = "Dịch vụ vận chuyển",
        type = ItemTypeChoices.ACCESSORY,
        studio = studio,
        min_price = 0,
        max_price = 500000,
    )
    
    if os.path.exists("assets/item/shipping.png"):
        ItemPicture.objects.create(item = transport_service,
                                   picture = "/item/shipping.png")
    