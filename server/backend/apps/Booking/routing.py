from django.urls import path
from .consumers import Conversation,ConversationOnline


channel_routing = [
    path('booking/conversation-online/<str:access>',ConversationOnline.as_asgi()),
    path('booking/conversation/<str:access>', Conversation.as_asgi()),
]
