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

MAX_DESTINATIONS = 50
ORS_MATRIX_URL = 'https://api.openrouteservice.org/v2/matrix/driving-car'

def parse_point(text):
    """'36.8219,-1.2921' -> (36.8219, -1.2921), or None if it isn't a valid longitude,latitude pair."""
    try:
        lon, lat = (float(part) for part in text.split(','))
    except (AttributeError, ValueError):
        return None
    if not (-180 <= lon <= 180 and -90 <= lat <= 90):
        return None
    return lon, lat

def as_point(value):
    """[lon, lat] -> (lon, lat), or None if it isn't a valid pair of numbers."""
    if not isinstance(value, (list, tuple)) or len(value) != 2:
        return None
    if not all(isinstance(n, (int, float)) and not isinstance(n, bool) for n in value):
        return None
    lon, lat = value
    if not (-180 <= lon <= 180 and -90 <= lat <= 90):
        return None
    return float(lon), float(lat)


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

class RouteDistancesView(APIView):
    """Driving distances from one point to many, in one OpenRouteService call."""
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'routing'

    def post(self, request):
        bad_input = Response(
            ['Send "from" as [longitude, latitude] and "to" as a list of 1 to 50 such points.'],
            status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(request.data, dict):
            return bad_input
        start = as_point(request.data.get('from'))
        raw_targets = request.data.get('to')
        if start is None or not isinstance(raw_targets, list) or not 1 <= len(raw_targets) <= MAX_DESTINATIONS:
            return bad_input
        targets = [as_point(target) for target in raw_targets]
        if None in targets:
            return bad_input

        body = {
            'locations': [list(start)] + [list(target) for target in targets],
            'sources': [0],
            'destinations': list(range(1, len(targets) + 1)),
            'metrics': ['distance'],
            'units': 'km',
        }
        try:
            ors = requests.post(ORS_MATRIX_URL, json=body,
                                headers={'Authorization': settings.ORS_API_KEY}, timeout=10)
            ors.raise_for_status()
            distances = ors.json()['distances'][0]
        except (requests.RequestException, ValueError, KeyError, IndexError, TypeError) as exc:
            logger.warning('OpenRouteService matrix request failed: %s', exc)
            return Response({'detail': 'The routing service is not available right now.'},
                            status=status.HTTP_502_BAD_GATEWAY)
        return Response({'distances_km': distances})