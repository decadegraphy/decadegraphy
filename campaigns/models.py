from django.db import models

class Campaign(models.Model):
    title = models.CharField(max_length=128)

class Applicant(models.Model):
    email = models.EmailField()
    note = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, editable=True)
