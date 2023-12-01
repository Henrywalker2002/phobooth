from base.views import CustomModelViewSetBase
from cart.models import Cart
from cart.serializers import CartSerializer


class CartViewSet(CustomModelViewSetBase):
    queryset = Cart.objects.all()
    serializer_class = {"default": CartSerializer}

    def get_queryset(self):
        if self.action == "list":
            return self.queryset.filter(customer=self.request.user)
        return super().get_queryset()
