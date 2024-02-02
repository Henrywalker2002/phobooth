from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
from base.views import BaseGenericViewSet
from address.models import Province, District, Ward
from address.serializers import ProvideSerializer, ProvideSummarySerializer
from rest_framework.response import Response
from rest_framework import status


class ProvinceViewSet(BaseGenericViewSet, CreateModelMixin, ListModelMixin, RetrieveModelMixin):
    
    queryset = Province.objects.all()
    serializer_class = {'default': ProvideSerializer, 'list' : ProvideSummarySerializer}
    lookup_field = 'code_name'

    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        
        districts = serializer.validated_data.pop('districts')
        
        self.perform_create(serializer)
        provide = serializer.instance
        
        for dictrict in districts:
            wards = dictrict.pop('wards')
            dictrict_object = District.objects.create(provide=provide, **dictrict)
            
            for ward in wards:
                Ward.objects.create(district=dictrict_object, **ward)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    