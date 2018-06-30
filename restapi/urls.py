from rest_framework import viewsets, routers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from works.api import WorkViewSet

class UserAuthViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def list(self, request):
        return Response({'username': request.user.username, 'id': request.user.id})

router = routers.SimpleRouter()
router.register(r'users/auth', UserAuthViewSet, base_name='users_auth')
router.register(r'works', WorkViewSet)

urlpatterns = router.urls
