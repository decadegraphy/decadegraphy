from rest_framework import serializers, viewsets
from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
import django_filters.rest_framework

from decadegraphy.users.models import User
from .models import Campaign, Applicant


class CampaignSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Campaign
        fields = ('title',)


class ApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = '__all__'

    cities = serializers.SerializerMethodField()

    def get_cities(self, obj):
        user = obj.user
        user_and_optional_cities = {'user': [user.country, user.region, user.city], 'optional': [obj.photographer_optional_city, obj.participant_optional_cities]}
        return user_and_optional_cities


class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = Applicant.objects.all().order_by('-created_at')
    serializer_class = ApplicantSerializer
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    filter_fields = ('user', 'email', 'roles')

    def create(self, request):
        data = request.data
        data['user'] = request.user.id
        serializer = ApplicantSerializer(data=request.data)
        if serializer.is_valid() is False:
            return Response(serializer.errors, status=400)
        serializer.save()

        # Update User
        user = User.objects.get(pk=request.user.id)

        user.wechat_id = data.get('wechat_id')
        user.mobile = data.get('mobile')
        user.country = data.get('country')
        user.region = data.get('region')
        user.city = data.get('city')
        user.age = data.get('age')
        # user.set_password(data['password'])
        user.save()
        return Response(serializer.data)
