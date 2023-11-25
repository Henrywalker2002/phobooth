from base.views import CustomModelViewSetBase
from studio.models import Studio
from studio.serializers import StudioSerializer
from rest_framework import status
from rest_framework.response import Response


class StudioViewSet(CustomModelViewSetBase):
    queryset = Studio.objects.all()
    serializer_class = {'default': StudioSerializer}
    
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        serializer.save()
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)
    

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    