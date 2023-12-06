from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter
from user.views import AuthenticationViewSet, UserViewSet
from role.views import RoleViewSet, PermissionViewSet
from studio.views import StudioViewSet
from category.views import CategoryViewSet
from item.views import ItemServicesViewSet, ItemViewSet
from cart.views import CartViewSet
from order.views import OrderViewSet, OrderItemViewSet
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView, TokenBlacklistView)

router = DefaultRouter() 

router.register(r'user', UserViewSet, 'user')
router.register(r'role', RoleViewSet, 'role')
router.register(r'permission', PermissionViewSet, 'permission')
router.register(r'studio', StudioViewSet, 'studio')
router.register(r'category', CategoryViewSet, 'category')
router.register(r'item/services', ItemServicesViewSet, 'item_services')
router.register(r'item', ItemViewSet, 'item')
router.register(r'cart', CartViewSet, 'cart')
router.register(r'order', OrderViewSet, 'order')
router.register(r'order-item', OrderItemViewSet, 'order-item')

schema_view = get_schema_view(openapi.Info(
    "docs", default_version= 'v1', public = True), permission_classes= (permissions.AllowAny, ))

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('docs/', schema_view.with_ui()), 
    path('login/', AuthenticationViewSet.as_view({'post': 'login'})),
    path('logout/', TokenBlacklistView.as_view(), name='logout'),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls))
]
