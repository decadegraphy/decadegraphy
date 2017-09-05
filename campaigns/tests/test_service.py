import os.path
import json
from test_plus.test import TestCase
from apiclient.http import HttpMockSequence
from redis import StrictRedis
from config import settings
from ..models import Applicant
from ..services import *

CALENDAR_DISCOVERY_FILENAME = os.path.join(
    os.path.dirname(__file__), '..', 'fixtures', 'google_calendar_discovery.json')
CALENDAR_METADATA_FILENAME = os.path.join(
    os.path.dirname(__file__), '..', 'fixtures', 'google_calendar_metadata.json')
CALENDAR_NEW_EVENT_FILENAME = os.path.join(
    os.path.dirname(__file__), '..', 'fixtures', 'google_calendar_new_event.json')

CALENDAR_DISCOVERY = open(CALENDAR_DISCOVERY_FILENAME).read()
CALENDAR_METADATA = open(CALENDAR_METADATA_FILENAME).read()
CALENDAR_NEW_EVENT = open(CALENDAR_NEW_EVENT_FILENAME).read()

def populated_service(is_creating_new_event=True):
    sequence = [
        ({'status': '200'}, CALENDAR_DISCOVERY),
        ({'status': '200'}, CALENDAR_METADATA)]
    if is_creating_new_event:
        sequence.append(({'status': '200'}, CALENDAR_NEW_EVENT))
    http = HttpMockSequence(sequence)
    return build_google_calendar_service(http, cache=None)

class ServiceTests(TestCase):
    fixture = ['calendar_service.yaml']

    @classmethod
    def setUpTestData(cls):
        cls.redis = StrictRedis.from_url(settings.REDIS_LOCATION)

    def test_creates_new_event_for_unlisted_applicant(self):
        service = populated_service()
        unlisted_applicant = Applicant.objects.filter(
            google_calendar_event_created_at=None)
        process_photograph_event(unlisted_applicant, service, self.redis)
        self.assertEqual(
            unlisted_applicant.google_calendar_event_created_at, '2017-09-03T18:53:21.000Z')

    def test_do_nothing_for_listed_applicant(self):
        service = populated_service()
        listed_applicant = Applicant.objects.filter(google_calendar_event_created_at='2017-09-03T18:53:21.000Z')
        process_photograph_event(listed_applicant, service, self.redis)


class GoogleOAuthFlowTests(TestCase):
    def test_finish_oauth_server_to_server_flow(self):
        populated_service(is_creating_new_event=False)

    def test_submit_calendar_event(self):
        service = populated_service()
        event = {
            'summary': '@test 与Test 约拍',
            'location': 'Test',
            'status': 'tentative',
            'start': {
                'date': "2017-09-01",
            },
            'end': {
                'date': "2017-09-01",
            }
        }
        response = submit_photograph_event_to_calendar(service, event)
        self.assertEqual(response['id'], '2q4pq7r8bsemor5nmuv3esjfj4')

