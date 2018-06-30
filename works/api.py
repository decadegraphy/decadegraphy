from rest_framework import serializers, viewsets
from .models import Work, Photo

class WorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Work
        fields = '__all__'

    cover = serializers.StringRelatedField(read_only=True)
    photos = serializers.SerializerMethodField()

    def get_photos(self, obj):
        return Photo.objects.filter(work=obj).values('cloud_id')


class WorkViewSet(viewsets.ModelViewSet):
    queryset = Work.objects.all().order_by('-created_at')
    serializer_class = WorkSerializer
