from celery import shared_task
from .services import process_potential_photograph_events


@shared_task
def enqueue_potential_photograph_events:
    process_potential_photograph_events()
