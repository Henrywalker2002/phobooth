import jwt

from django.utils.functional import SimpleLazyObject
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser
from user.models import User
from django.contrib.auth.middleware import get_user
from backend.settings import SECRET_KEY


class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.user = SimpleLazyObject(lambda: self.__class__.get_jwt_user(request))

    @staticmethod
    def get_jwt_user(request):

        try:
            user_jwt = get_user(request) 
        except Exception as e:
            user_jwt = AnonymousUser()
        if user_jwt.is_authenticated:
            return user_jwt
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token:
            token = token.split()[1]

        user_jwt = AnonymousUser()
        if token is not None:
            try:
                user_jwt = jwt.decode(
                    token,
                    SECRET_KEY, 
                    algorithms=['HS256']
                )
                user_jwt = User.objects.get(
                    id=user_jwt["user_id"]
                )
            except Exception as e: # NoQA
                # traceback.print_exc()
                return user_jwt
        return user_jwt