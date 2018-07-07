from django.db import models

class Work(models.Model):
    photographer = models.CharField(max_length=32)
    participant = models.CharField(max_length=32)
    cover = models.OneToOneField('Photo', related_name='cover', null=True, blank=True)
    story = models.TextField()
    likes = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    shares = models.IntegerField(default=0)
    twitter_id = models.CharField(max_length=64, null=True, blank=True)
    location = models.CharField(max_length=128, null=True, blank=True)
    publication_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return '{0} taked {1} at {2}'.format(self.photographer, self.participant, self.publication_date)

class Photo(models.Model):
    cloud_id = models.CharField(max_length=128)
    work = models.ForeignKey(Work)
    file_format = models.CharField(max_length=8)

    def __str__(self):
        return self.cloud_id
