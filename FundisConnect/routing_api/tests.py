from unittest.mock import patch

import requests
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import override_settings
from rest_framework.test import APITestCase

User = get_user_model()
ROUTE_URL = '/api/route/'
START = '36.8219,-1.2921'
END = '36.8172,-1.2864'

SAMPLE_ROUTE = {
    'type': 'FeatureCollection',
    'features': [{
        'type': 'Feature',
        'properties': {'summary': {'distance': 1234.5, 'duration': 300.0}},
        'geometry': {'type': 'LineString',
                     'coordinates': [[36.8219, -1.2921], [36.8172, -1.2864]]},
    }],
}


@override_settings(ORS_API_KEY='test-key-123')
class RouteViewTests(APITestCase):
    """Tests never call the real ORS: requests.get is replaced by a stand-in."""

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            email='customer1@example.com', username='customer1',
            usertype='customer', phone='0711111111', password='testpass123')

    def setUp(self):
        cache.clear()   # throttle counters live in the cache
        self.client.raise_request_exception = False

    @patch('routing_api.views.requests.get')
    def test_anonymous_user_is_refused_and_ors_is_not_called(self, mock_get):
        response = self.client.get(ROUTE_URL, {'from': START, 'to': END})
        self.assertEqual(response.status_code, 403)
        mock_get.assert_not_called()

    @patch('routing_api.views.requests.get')
    def test_logged_in_user_gets_the_route(self, mock_get):
        mock_get.return_value.json.return_value = SAMPLE_ROUTE
        self.client.force_login(self.user)
        response = self.client.get(ROUTE_URL, {'from': START, 'to': END})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), SAMPLE_ROUTE)
        # The server called ORS with the right points and its own key
        _, kwargs = mock_get.call_args
        self.assertEqual(kwargs['params'], {'start': START, 'end': END})
        self.assertEqual(kwargs['headers'], {'Authorization': 'test-key-123'})

    @patch('routing_api.views.requests.get')
    def test_bad_points_return_400_and_ors_is_not_called(self, mock_get):
        self.client.force_login(self.user)
        for params in ({}, {'from': START}, {'from': 'abc', 'to': END}, {'from': START, 'to': '200,100'}):
            with self.subTest(params=params):
                self.assertEqual(self.client.get(ROUTE_URL, params).status_code, 400)
        mock_get.assert_not_called()

    @patch('routing_api.views.requests.get')
    def test_ors_failure_returns_502_without_leaking_details(self, mock_get):
        mock_get.side_effect = requests.ConnectionError('secret details test-key-123')
        self.client.force_login(self.user)
        response = self.client.get(ROUTE_URL, {'from': START, 'to': END})
        self.assertEqual(response.status_code, 502)
        self.assertNotIn('test-key-123', response.content.decode())
        self.assertNotIn('secret details', response.content.decode())