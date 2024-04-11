from django.urls import re_path
from complain_forum.consumers import ComplainForumConsumer


websocket_urlpatterns = [
    re_path(r'ws/complain-forum/(?P<id>\w+)/$', ComplainForumConsumer.as_asgi()),
]