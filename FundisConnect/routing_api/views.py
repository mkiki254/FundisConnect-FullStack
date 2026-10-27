import logging

import requests
from django.conf import settings
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

logger = logging.getLogger(__name__)

ORS_DIRECTIONS_URL = 'https://api.openrouteservice.org/v2/directions/driving-car'


def parse_point(text):
    """'36.8219,-1.2921' -> (36.8219, -1.2921), or None if it isn't a valid longitude,latitude pair."""
    try:
        lon, lat = (float(part) for part in text.split(','))
    except (AttributeError, ValueError):
        return None
    if not (-180 <= lon <= 180 and -90 <= lat <= 90):
        return None
    return lon, lat


class RouteView(APIView):
    """A driving route between two points, fetched from OpenRouteService with the server's key."""
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'routing'

    def get(self, request):
        start = parse_point(request.query_params.get('from'))
        end = parse_point(request.query_params.get('to'))
        if start is None or end is None:
            return Response(['Give "from" and "to" as longitude,latitude, for example from=36.82,-1.29'],
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            ors = requests.get(
                ORS_DIRECTIONS_URL,
                params={'start': f'{start[0]},{start[1]}', 'end': f'{end[0]},{end[1]}'},
                headers={'Authorization': settings.ORS_API_KEY},
                timeout=10)
            ors.raise_for_status()
            data = ors.json()
        except (requests.RequestException, ValueError) as exc:
            # The details go to the server log. The browser gets a generic message.
            logger.warning('OpenRouteService request failed: %s', exc)
            return Response({'detail': 'The routing service is not available right now.'},
                            status=status.HTTP_502_BAD_GATEWAY)
        return Response(data)