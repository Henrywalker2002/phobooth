from base.views import BaseGenericViewSet
from rest_framework.mixins import CreateModelMixin, ListModelMixin, UpdateModelMixin, RetrieveModelMixin
from draw_money.models import DrawMoney
from draw_money.serializers import CreateDrawMoneySerializer, UpdateDrawMoneySerializer, ReadDetailDrawMoneySerializer, ReadSummrayDrawMoneySerializer
from rest_framework import status
from rest_framework.response import Response
from draw_money.permission import DrawMoneyPermission
from django.db import transaction


class DrawMoneyViewSet(BaseGenericViewSet, CreateModelMixin, ListModelMixin, UpdateModelMixin, RetrieveModelMixin):
    queryset = DrawMoney.objects.all()
    serializer_class = {"list": ReadSummrayDrawMoneySerializer, "retrieve": ReadDetailDrawMoneySerializer,
                        "create": CreateDrawMoneySerializer, "default": UpdateDrawMoneySerializer}
    permission_classes = [DrawMoneyPermission]
    filterset_fields = ["status", "studio__code_name"]
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        studio = request.user.studio
        if not data.get("amount"):
            data["amount"] = studio.account_balance
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data["studio"] = studio
        self.perform_create(serializer)
        studio.account_balance -= serializer.validated_data["amount"]
        studio.save()
        data_return = self.get_serializer(serializer.instance, is_get = True).data
        headers = self.get_success_headers(data_return)
        return Response(data=data_return, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        data_return = self.get_serializer(serializer.instance, is_get = True).data
        return Response(data=data_return)
        