from django.db import models
from base.models import BaseModel
from complain.models import Complain
from user.models import User
    
    
class Reply(BaseModel):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    complain = models.ForeignKey(to=Complain, on_delete=models.CASCADE, related_name="replies")
    text = models.TextField()
    

class ReplyPicture(BaseModel):
    reply = models.ForeignKey(to="Reply", on_delete=models.CASCADE, related_name="pictures")
    picture = models.ImageField(upload_to="reply_pictures/")