from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from address.models import Province, District, Ward
from address.serializers import ProvideSerializer, ProvideSummarySerializer
from rest_framework.response import Response
from rest_framework import status


class ProvinceViewSet(CreateModelMixin, GenericViewSet, ListModelMixin, RetrieveModelMixin):
    
    queryset = Province.objects.all()
    serializer_class = {'default': ProvideSerializer, 'list' : ProvideSummarySerializer}
    lookup_field = 'code_name'
    
    def get_queryset(self):
        if self.action == "list":
            return self.queryset.order_by('name')
        return super().get_queryset()
    
    def get_serializer_class(self):
        # ensure that serializer_class must be a dict and have default 
        assert self.serializer_class is not None, (
            "'%s' should either include a `serializer_class` attribute, "
            "or override the `get_serializer_class()` method."
            % self.__class__.__name__
        )
        assert isinstance(self.serializer_class, dict), (
            f"{self.__class__.__name__} serialize_class must be a dict"
        )
        assert "default" in self.serializer_class.keys(), (
            f"{self.__class__.__name__} serializer_class must have default keys"
        )
        
        if self.action in self.serializer_class.keys():
            return self.serializer_class[self.action]
        return self.serializer_class['default']
    
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
    