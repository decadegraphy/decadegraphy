import urllib
from django.conf import settings

from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.models import SocialAccount


class AccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request):
        return getattr(settings, 'ACCOUNT_ALLOW_REGISTRATION', True)

    def get_login_redirect_url(self, request):
        qs = dict()
        qs['need_password'] = False if request.user._password else True

        social_account = SocialAccount.objects.get(user_id=request.user.id)
        if social_account:
            qs['uid'] = social_account.uid
        qs['username'] = request.user.username
        qs['email'] = request.user.email
        return '/campaigns/signup?' + urllib.parse.urlencode(qs)


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_open_for_signup(self, request, sociallogin):
        return getattr(settings, 'ACCOUNT_ALLOW_REGISTRATION', True)
