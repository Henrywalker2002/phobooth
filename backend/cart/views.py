from base.views import BaseGenericViewSet
from rest_framework.mixins import CreateModelMixin, ListModelMixin, DestroyModelMixin
from cart.models import Cart
from cart.serializers import CartSerializer, CartListSerializer
from rest_framework import permissions
from rest_framework.response import Response
from cart.filters import CartFilter


class CartViewSet(BaseGenericViewSet, CreateModelMixin, ListModelMixin, DestroyModelMixin):
    queryset = Cart.objects.all()
    serializer_class = {"default": CartSerializer, "list": CartListSerializer}
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = CartFilter
    search_fields = ["@item__name", "@item__description"]

    def get_queryset(self):
        if self.action == "list":
            return self.queryset.filter(customer=self.request.user)
        return super().get_queryset()
    
    def create(self, request, *args, **kwargs):
        request.data['customer'] = request.user.id
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        queryset = queryset.order_by("modified_at", "item__studio_id")

        
        page = self.paginate_queryset(queryset)
        if page:
            serializer = self.get_serializer(page, many=True)
            data = serializer.data 
        else:
            data = self.get_serializer(queryset, many=True).data
        res = []
        # studio_id = 123 : { studio : {}, items: ["id",.... ] }
        for item in data:
            studio = item["item"].pop("studio")
            if res:
                if res[-1]["studio"]["id"] == studio["id"]:
                    res[-1]["items"].append(item)
                else:
                    res.append({"studio": studio, "items": [item]})
            else:
                res.append({"studio": studio, "items": [item]})
        

        return self.get_paginated_response(res)

