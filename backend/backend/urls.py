from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter
from user.views import AuthenticationViewSet, UserViewSet, StaffViewSet
from role.views import RoleViewSet, PermissionViewSet
from studio.views import StudioViewSet
from studio_document.views import StudioDocumentViewSet
from category.views import CategoryViewSet
from cart.views import CartViewSet
from order.views.order import OrderViewSet
from order.views.order_item import OrderItemViewSet
from order_history.views import OrderHistoryViewSet
from item.views.service import ItemServicesViewset
from item.views.item import ItemViewSet, ItemImageViewSet
from item.views.product import ProductViewSet, VariationViewSet
from item.views.service_pack import ServicePackItemViewSet
from address.views import ProvinceViewSet
from payment.views import PaymentViewSet
from media.views import MediaViewSet
from notification.views import NotificationViewSet
from complain.views import ComplainViewSet
from complain_forum.views import ReplyViewSet
from demo.views import ImageDemoViewSet, ImageDemoCommentViewSet
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter() 

router.register(r'user', UserViewSet, 'user')
router.register(r'staff', StaffViewSet, 'staff')
router.register(r'role', RoleViewSet, 'role')
router.register(r'permission', PermissionViewSet, 'permission')
router.register(r'studio', StudioViewSet, 'studio')
router.register(r'studio-document', StudioDocumentViewSet, 'studio-document')
router.register(r'category', CategoryViewSet, 'category')
router.register(r'item-service', ItemServicesViewset, 'item-service')
router.register(r'item-product', ProductViewSet, 'item-product')    
router.register(r'item-variation', VariationViewSet, 'item-variation')
router.register(r'item-service-pack', ServicePackItemViewSet, 'item-service-pack')
router.register(r'item-picture', ItemImageViewSet, 'item-picture')
router.register(r'item', ItemViewSet, 'item')
router.register(r'cart', CartViewSet, 'cart')
router.register(r'order', OrderViewSet, 'order')
router.register(r'order-item', OrderItemViewSet, 'order-item')
router.register(r'order-history', OrderHistoryViewSet, 'order-history')
router.register(r'province', ProvinceViewSet, 'province')
router.register(r'payment', PaymentViewSet, 'payment')
router.register(r'media', MediaViewSet, 'media')
router.register(r'notification', NotificationViewSet, 'notification')
router.register(r'complain', ComplainViewSet, 'complain')
router.register(r'complain-reply', ReplyViewSet, 'complain-reply')
router.register(r'demo', ImageDemoViewSet, 'demo')
router.register(r'demo-comment', ImageDemoCommentViewSet, 'demo-comment')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('login/', AuthenticationViewSet.as_view({'post': 'login'}), name='login'),
    path('logout/', TokenBlacklistView.as_view(), name='logout'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
