from base.views import CustomModelViewSetBase
from cart.models import Cart
from cart.serializers import CartSerializer, CartListSerializer
from rest_framework import permissions


class CartViewSet(CustomModelViewSetBase):
    queryset = Cart.objects.all()
    serializer_class = {"default": CartSerializer, "list": CartListSerializer}
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.action == "list":
            return self.queryset.filter(customer=self.request.user)
        return super().get_queryset()

    