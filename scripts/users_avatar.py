import os
import json
import shutil

import requests

from works.models import Work
from django.conf import settings

STATIC_DIR = settings.STATICFILES_DIRS[0]

HEADERS = {
    'content-type': 'application/json',
    'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'
}

def get_avatar_url(username):
    params = {
        'queryId': 'ey5le5rFYEThjq0u1i43tA',
        'variables': '{"screen_name":"%s","withHighlightedLabel":true}' % username
    }
    response = requests.post('https://api.twitter.com/graphql', json.dumps(params), headers=HEADERS)
    data = response.json()
    url = data['data']['user']['legacy']['profile_image_url_https']
    url = url.replace('normal', 'bigger')
    return url

def save_avatar(username):
    filename = os.path.join(STATIC_DIR, 'avatar', username + '.jpg')
    url = get_avatar_url(username)
    print('Download {0}: {1}'.format(username, url))
    with requests.get(url, stream=True, headers=HEADERS) as r:
        with open(filename, 'wb') as f:
            shutil.copyfileobj(r.raw, f)


def run():
    works = Work.objects.all()
    users = set()
    for work in works:
        users.add(work.photographer)
        users.add(work.participant)

    for username in users:
        try:
            save_avatar(username)
        except:
            print('Except {0}'.format(username))
