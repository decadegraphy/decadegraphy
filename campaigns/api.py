from rest_framework import serializers, viewsets
from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated


from .models import Campaign, Applicant

class CampaignSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Campaign
        fields = ['title',]

class ApplicantSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Applicant
        fields = ['email', 'note', 'created_at']

class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer

    def list(self, request):
        applicants = Applicant.objects.all().order_by('-created_at')
        serializer = self.get_serializer(applicants, many=True)
        return Response(serializer.data)
