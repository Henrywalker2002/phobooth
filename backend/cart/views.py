from base.views import BaseGenericViewSet
from rest_framework.mixins import CreateModelMixin, ListModelMixin, DestroyModelMixin
from cart.models import Cart
from cart.serializers import CartSerializer, CartListSerializer
from rest_framework import permissions


class CartViewSet(BaseGenericViewSet, CreateModelMixin, ListModelMixin, DestroyModelMixin):
    queryset = Cart.objects.all()
    serializer_class = {"default": CartSerializer, "list": CartListSerializer}
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.action == "list":
            return self.queryset.filter(customer=self.request.user)
        return super().get_queryset()
    
    def create(self, request, *args, **kwargs):
        request.data['customer'] = request.user.id
        return super().create(request, *args, **kwargs)

    