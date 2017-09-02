import os
from celery import Celery

# TODO: `DJANGO_SETTINGS_MODULE` should be set beforehand
env = os.environ.get('DJANGO_SETTINGS_MODULE') or 'config.settings.local'

app = Celery('decadegraph')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object(f"{env}.CeleryConfig", namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
