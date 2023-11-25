import threading

_local = threading.local()

class CustomMiddleware:
    """
    Add request id and request.user to local
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        if request.user and request.user.is_authenticated:
            _local.__setattr__('user', request.user)
            if request.user.studio:
                _local.__setattr__('studio', request.user.studio)
        
        response = self.get_response(request)
        return response
    
def get_current_user():
    return getattr(_local, 'user', None)

def get_current_studio():
    return getattr(_local, 'studio', None)

class CustomThread(threading.Thread):
    """
    Custom thread to save request.user and request id when create new thread
    """

    def start(self):
        self.user = get_current_user()
        super().start()

    def run(self):
        global _user
        if not hasattr(_user, 'user'):
            setattr(_user, 'user', self.user)
        if not hasattr(_user, 'request_id'):
            setattr(_user, 'request_id', self.request_id)
        super().run()
