from base.views import BaseGenericViewSet
from rest_framework.mixins import CreateModelMixin, ListModelMixin, DestroyModelMixin
from cart.models import Cart
from cart.serializers import CartSerializer, CartListSerializer
from rest_framework import permissions
from rest_framework.response import Response
from cart.filters import CartFilter
from cart.filters import CartFilter
from rest_framework import status


class CartViewSet(BaseGenericViewSet, CreateModelMixin, ListModelMixin, DestroyModelMixin):
    queryset = Cart.objects.all()
    serializer_class = {"default": CartSerializer, "list": CartListSerializer}
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = CartFilter
    search_fields = ["@item__name", "@item__description"]
    filterset_class = CartFilter
    search_fields = ["@item__name", "@item__description"]

    def get_queryset(self):
        if self.action == "list":
            return self.queryset.filter(customer=self.request.user)
        return super().get_queryset()
    
    def create(self, request, *args, **kwargs):
        request.data['customer'] = request.user.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = self.get_queryset().filter(item=serializer.validated_data["item"], customer=request.user)
        if item.exists():
            item = item.first()
            item.number += serializer.validated_data["number"]
            item.save()
            return Response(self.get_serializer(item).data, status=status.HTTP_201_CREATED)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        queryset = queryset.order_by( "item__studio_id", "modified_at")

        
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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=204)
