from rest_framework import viewsets, routers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from campaigns.api import ApplicantViewSet
from decadegraphy.users.models import User


class UserAuthViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)

    def list(self, request):
        return Response({'username': request.user.username})

router = routers.SimpleRouter()
router.register(r'campaigns/applicants', ApplicantViewSet)
router.register(r'users/auth', UserAuthViewSet, base_name='users_auth')

urlpatterns = router.urls
