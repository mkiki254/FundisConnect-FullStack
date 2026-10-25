from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from artisans_api.models import ArtisanPersonalInfo
from customers_api.tests import make_artisan   # shared helper, reused from the job-request tests

User = get_user_model()
PROFILE_URL = '/api/artisan/profile/personal-info/'
PROFILE_DETAIL_URL = '/api/artisan/profile/personal-info/detail/'

PROFILE_DATA = {
    'first_name': 'New',
    'last_name': 'Artisan',
    'specialization': 'plumber',
    'location': 'POINT(36.8219 -1.2921)',
}


class ArtisanProfileTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.customer = User.objects.create_user(
            email='customer1@example.com', username='customer1',
            usertype='customer', phone='0711111111', password='testpass123')
        # An artisan who has registered but not created a profile yet
        cls.new_artisan = User.objects.create_user(
            email='newartisan@example.com', username='newartisan',
            usertype='artisan', phone='0766666666', password='testpass123')
        # An artisan who already has a profile
        cls.artisan, _ = make_artisan('artisan1@example.com', 'artisan1', '0733333333', 'One')

    def setUp(self):
        self.client.raise_request_exception = False

    def test_artisan_can_create_a_profile(self):
        # Control test
        self.client.force_login(self.new_artisan)
        response = self.client.post(PROFILE_URL, PROFILE_DATA, format='multipart')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(ArtisanPersonalInfo.objects.filter(user=self.new_artisan).exists())

    def test_customer_cannot_create_an_artisan_profile(self):
        self.client.force_login(self.customer)
        response = self.client.post(PROFILE_URL, PROFILE_DATA, format='multipart')
        self.assertEqual(response.status_code, 403)
        self.assertFalse(ArtisanPersonalInfo.objects.filter(user=self.customer).exists())

    def test_second_profile_is_rejected_with_400_not_500(self):
        self.client.force_login(self.artisan)
        response = self.client.post(PROFILE_URL, PROFILE_DATA, format='multipart')
        self.assertEqual(response.status_code, 400)

    def test_artisan_can_read_their_own_profile(self):
        # Control test
        self.client.force_login(self.artisan)
        self.assertEqual(self.client.get(PROFILE_DETAIL_URL).status_code, 200)

    def test_missing_profile_returns_404_not_500(self):
        self.client.force_login(self.new_artisan)
        self.assertEqual(self.client.get(PROFILE_DETAIL_URL).status_code, 404)