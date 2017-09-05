# -*- coding: utf-8 -*-
from django.db import models

from decadegraphy.users.models import User


class Campaign(models.Model):
    title = models.CharField(max_length=128)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, editable=True)


SKILLS = (
    (1, '文案、文字编辑、活动策划'),
    (2, '平面/VI/网页/UI设计'),
    (3, '被拍者社群运营管理'),
    (4, '网站开发'),
)


class Applicant(models.Model):
    campaign = models.ForeignKey(Campaign, null=True, blank=True)
    user = models.ForeignKey(User, null=True, blank=True)
    email = models.EmailField()
    roles = models.CharField(max_length=255)
    note = models.TextField(null=True, blank=True)

    story = models.TextField(null=True, blank=True)
    planned_date_start = models.DateField(null=True, blank=True)
    planned_date_end = models.DateField(null=True, blank=True)
    participant_optional_cities = models.CharField(null=True, blank=True, max_length=255)
    photographer_optional_city = models.CharField(null=True, blank=True, max_length=255)
    photographer_schedule = models.IntegerField(null=True, blank=True)
    volunteer_schedule = models.IntegerField(null=True, blank=True)
    skill = models.IntegerField(null=True, blank=True, choices=SKILLS)
    will = models.IntegerField(null=True, blank=True, choices=SKILLS)
    created_at = models.DateTimeField(auto_now_add=True, editable=True)

    def __str__(self):
        return '{0}({1})'.format(self.user, self.roles)
