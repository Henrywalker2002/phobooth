from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync


class ComplainForumConsumer(JsonWebsocketConsumer):
    def connect(self):
        complain_id = self.scope['url_route']['kwargs']['id']
        self.room_group_name = f'complain_{complain_id}'
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        self.close()

    def receive_json(self, content):
        # handle content
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, content
        )
    
    def reply(self, event):
        self.send_json(event)