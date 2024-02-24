from base.views import BaseModelViewSet
from order.models import Order, OrderItem
from order.serializers.order import CreateOrderSerializer, ReadOrderSerializer, UpdateOrderSerializer
from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from order.permission import OrderPermission
from base.exceptions import MethodNotAllowed


class OrderViewSet(BaseModelViewSet):
    queryset = Order.objects.all()
    serializer_class = {"create": CreateOrderSerializer, "list": ReadOrderSerializer, "update": UpdateOrderSerializer, "default": ReadOrderSerializer, "partial_update": UpdateOrderSerializer,
                        "list_order_of_studio": ReadOrderSerializer, "retrieve": ReadOrderSerializer}
    permission_classes = [OrderPermission]

    def get_queryset(self):
        if self.action == "list":
            return self.queryset.filter(customer=self.request.user).order_by("-created_at")[:50]
        elif self.action == "list_order_of_studio":
            return self.queryset.filter(studio=self.request.user.studio).order_by("-created_at")[:50]
        return super().get_queryset()

    @transaction.atomic
    def create(self, request, *kawrgs, **kwargs):
        request.data['customer'] = request.user.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order_item = serializer.validated_data.pop('order_item')
        studio = order_item[0]['item'].studio
        # create order
        serializer.validated_data['studio'] = studio
        self.perform_create(serializer)

        # create order item
        order = serializer.instance
        OrderItem.objects.bulk_create(
            [OrderItem(order=order, **item) for item in order_item])

        data = self.get_serializer(order, is_get=True).data
        return Response(data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path="studio")
    def list_order_of_studio(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed()