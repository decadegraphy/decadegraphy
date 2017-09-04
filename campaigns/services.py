from oauth2client.service_account import ServiceAccountCredentials
from typing import Dict
from httplib2 import Http
from apiclient.discovery import build
import googleapiclient.discovery_cache.base
from django.db import transaction
from redis import StrictRedis
from config import settings
from .models import Applicant

GOOGLE_CALENDAR_API_READ_WRITE_SCOPE = 'https://www.googleapis.com/auth/calendar'
API_SCOPES = [GOOGLE_CALENDAR_API_READ_WRITE_SCOPE]
GOOGLE_CALENDAR_API_NAME = 'calendar'
GOOGLE_CALENDAR_API_VERSION = 'v3'
# such information can be access from `service.calendarList().list().execute()`
PROGRESS_GOOGLE_CALENDAR_ID = '0qo4ij527286dctr302eqkkrao@group.calendar.google.com'


class _MemoryCache(googleapiclient.discovery_cache.base.Cache):
    _CACHE = {}

    def get(self, url):
        return _MemoryCache._CACHE.get(url)

    def set(self, url, content):
        _MemoryCache._CACHE[url] = content


def _populate_google_calendar_http_handler(path_to_key_file: str):
    """Returns an authorized http handler instance for building the services.

    It takes an path to the service account key file.
    """
    credentials = ServiceAccountCredentials.from_json_keyfile_name(
        path_to_key_file, scopes=API_SCOPES)
    http_auth = credentials.authorize(Http())
    return http_auth


def build_google_calendar_service(http_handler, cache=_MemoryCache()):
    """Returns Google Calendar API service object.

    It accepts KV pairs to build the OAuth2 object.
    """

    service = build(GOOGLE_CALENDAR_API_NAME, GOOGLE_CALENDAR_API_VERSION,
                    http=http_handler, developerKey=None, cache=cache)
    fetched_calendar_id = service.calendars().get(
        calendarId=PROGRESS_GOOGLE_CALENDAR_ID).execute()['id']
    assert fetched_calendar_id == PROGRESS_GOOGLE_CALENDAR_ID

    return service


def submit_photograph_event_to_calendar(service, event):
    """Submits the event to the google calendar.
    """
    body = event
    response = service.events().insert(calendarId=PROGRESS_GOOGLE_CALENDAR_ID,
                                       body=body, sendNotifications=False).execute()
    return response


def commit_created_at_timestamp_in_db(applicant, calendar_event):
    """Saves the newly listed event timestamp in DB.
    """
    applicant.google_calendar_event_created_at = calendar_event['created']
    applicant.save()

def populate_event_for_submitting(applicant):
    """Returns a dict of to be submitted event.
    """
    event = {
        'summary': "{} 与摄影师约拍".format(applicant.user__twitter_id),
        'location': "{}".format(applicant.participant_optional_cities),
        'status': 'tentative',
        'start': {
            'date': "{}".format(applicant.planned_date_start),
        },
        'end': {
            'date': "{}".format(applicant.planned_date_end),
        }
    }
    return event

_PHOTOGRAPH_EVENT_LOCK_KEY_PREFIX = '_photograph_event_lock_'

def process_photograph_event(applicant, calendar_service, redis):
    """Processes the potential photograph event.

    It tries to submit the event to designated google calendar.
    And it commits to the database to prevent duplication event in the calendar.

    The function is atomic.
    """

    # Uses the best effort redis redlock assumed the network is quite ok for such task.
    with redis.lock("{}{}".format(_PHOTOGRAPH_EVENT_LOCK_KEY_PREFIX, applicant.id)):
        applicant.refresh_from_db()
        if applicant.google_calendar_event_created:
            return

        with transaction.atomic():
            event = populate_event_for_submitting(applicant)
            result = submit_photograph_event_to_calendar(calendar_service, event)
            commit_created_at_timestamp_in_db(applicant, result)

def process_potential_photograph_events():
    """Iterates over the potential events and enqueue them.
    """
    # TODO: credential file location
    http = _populate_google_calendar_http_handler('credential.json')
    calendar_service = build_google_calendar_service(http)
    redis = StrictRedis.from_url(settings.REDIS_LOCATION)

    applicants = Applicant.objects.filter(
        google_calendar_event_created_at=None)
    for applicant in applicants.iterator():
        process_photograph_event(applicant, calendar_service, redis)
