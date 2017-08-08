from rest_framework import routers

from campaigns.api import ApplicantViewSet

router = routers.SimpleRouter()
router.register(r'campaigns/applicants', ApplicantViewSet)

urlpatterns = router.urls
