import shutil
import tempfile
from io import StringIO

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from django.core.cache import cache
from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import override_settings

from artisans_api.models import ArtisanPersonalInfo
from customers_api.models import CustomerJobRequests
from payment_api.models import ArtisanPayment

User = get_user_model()
REGISTER_URL = '/api/register'
LOGIN_URL = '/api/login'

VALID_CUSTOMER = {
    'email': 'new.customer@example.com',
    'username': 'newcustomer',
    'usertype': 'customer',
    'phone': '0712345678',
    'password': 'testpass123',
}


class RegistrationTests(APITestCase):

    

    def setUp(self):
        cache.clear()
        # Return a 500 response instead of re-raising the exception, so a crash
        # shows up as "500 != 400", the same thing you saw in Postman
        self.client.raise_request_exception = False

    def test_valid_customer_can_register(self):
        # Control test: the rules must not block legitimate sign-ups
        response = self.client.post(REGISTER_URL, VALID_CUSTOMER, format='json')
        self.assertEqual(response.status_code, 201)
        user = User.objects.get(email=VALID_CUSTOMER['email'])
        self.assertEqual(user.usertype, 'customer')
        self.assertTrue(user.check_password('testpass123'))  # saved as a hash that matches

    def test_valid_artisan_can_register(self):
        data = {**VALID_CUSTOMER, 'email': 'new.artisan@example.com',
                'username': 'newartisan', 'usertype': 'artisan'}
        response = self.client.post(REGISTER_URL, data, format='json')
        self.assertEqual(response.status_code, 201)

    def test_response_does_not_contain_the_password(self):
        response = self.client.post(REGISTER_URL, VALID_CUSTOMER, format='json')
        self.assertEqual(response.status_code, 201)
        # Check the raw body, which is what the client actually receives
        self.assertNotIn('testpass123', response.content.decode())

    def test_cannot_register_as_admin(self):
        data = {**VALID_CUSTOMER, 'usertype': 'admin'}
        response = self.client.post(REGISTER_URL, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(User.objects.filter(email=VALID_CUSTOMER['email']).exists())

    def test_unknown_usertype_is_rejected(self):
        data = {**VALID_CUSTOMER, 'usertype': 'superhero'}
        response = self.client.post(REGISTER_URL, data, format='json')
        self.assertEqual(response.status_code, 400)

    def test_missing_field_returns_400_with_a_list_of_messages(self):
        for field in VALID_CUSTOMER:
            with self.subTest(missing=field):
                data = {k: v for k, v in VALID_CUSTOMER.items() if k != field}
                response = self.client.post(REGISTER_URL, data, format='json')
                self.assertEqual(response.status_code, 400)
                # Signup.jsx calls response.data.join(", "), so this must stay a list
                self.assertIsInstance(response.data, list)

    def test_duplicate_email_is_rejected_with_a_list_of_messages(self):
        self.client.post(REGISTER_URL, VALID_CUSTOMER, format='json')
        response = self.client.post(REGISTER_URL, VALID_CUSTOMER, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIsInstance(response.data, list)


class LoginTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(
            email='customer1@example.com', username='customer1',
            usertype='customer', phone='0711111111', password='testpass123')

    def setUp(self):
        cache.clear()
        self.client.raise_request_exception = False
        self.credentials = {'email': 'customer1@example.com', 'password': 'testpass123'}

    def test_valid_login_starts_a_session(self):
        # Control test
        response = self.client.post(LOGIN_URL, self.credentials, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.client.get('/api/user/').status_code, 200)

    def test_login_response_does_not_contain_the_password(self):
        response = self.client.post(LOGIN_URL, self.credentials, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertNotIn('testpass123', response.content.decode())

    def test_wrong_password_returns_400_with_a_list_of_messages(self):
        data = {**self.credentials, 'password': 'wrong-password'}
        response = self.client.post(LOGIN_URL, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIsInstance(response.data, list)

    def test_missing_password_returns_400(self):
        response = self.client.post(LOGIN_URL, {'email': 'customer1@example.com'}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_missing_email_returns_400(self):
        response = self.client.post(LOGIN_URL, {'password': 'testpass123'}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_rate_limit_cannot_be_dodged_with_a_forged_forwarded_header(self):
        statuses = []
        for i in range(12):
            response = self.client.post(
                LOGIN_URL, {**self.credentials, 'password': 'wrong-password'},
                format='json', HTTP_X_FORWARDED_FOR=f'10.0.0.{i}')   # a different fake address each time
            statuses.append(response.status_code)
        self.assertIn(429, statuses)

class ApiResponseFormatTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            email='customer1@example.com', username='customer1',
            usertype='customer', phone='0711111111', password='testpass123')

    def test_a_browser_gets_json_not_the_browsable_api_page(self):
        # DRF's HTML "browsable API" is a development aid. The public site answers with JSON only.
        self.client.force_login(self.user)
        browser_accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        response = self.client.get('/api/user/', HTTP_ACCEPT=browser_accept)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/json')

    def test_pages_cannot_be_embedded_in_other_sites(self):
        # Stops clickjacking: another site showing ours inside an invisible frame
        response = self.client.get('/admin/login/')
        self.assertEqual(response['X-Frame-Options'], 'DENY')

TEMP_MEDIA_ROOT = tempfile.mkdtemp()   # generated avatars go here, never into your real media/ folder
DEMO_PASSWORD = 'demo-pass-123'


@override_settings(MEDIA_ROOT=TEMP_MEDIA_ROOT)
class SeedDemoTests(APITestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA_ROOT, ignore_errors=True)
        super().tearDownClass()

    def seed(self):
        call_command('seed_demo', password=DEMO_PASSWORD, stdout=StringIO())

    def assert_demo_marketplace(self):
        self.assertEqual(User.objects.filter(usertype='customer').count(), 2)
        self.assertEqual(ArtisanPersonalInfo.objects.count(), 8)
        self.assertEqual(CustomerJobRequests.objects.count(), 3)
        self.assertEqual(ArtisanPayment.objects.count(), 1)

    def test_creates_the_demo_marketplace(self):
        self.seed()
        self.assert_demo_marketplace()
        trades = set(ArtisanPersonalInfo.objects.values_list('specialization', flat=True))
        self.assertEqual(trades, {'plumber', 'electrician', 'carpenter', 'mason', 'tiling', 'painter'})
        for profile in ArtisanPersonalInfo.objects.all():
            self.assertTrue(profile.profile_picture, f'{profile} has no picture')

    def test_running_it_twice_does_not_duplicate_anything(self):
        self.seed()
        self.seed()
        self.assert_demo_marketplace()

    def test_demo_accounts_can_log_in(self):
        self.seed()
        for email in ('demo.customer1@example.com', 'demo.artisan1@example.com'):
            cache.clear()   # the login endpoint is rate-limited
            response = self.client.post('/api/login', {'email': email, 'password': DEMO_PASSWORD}, format='json')
            self.assertEqual(response.status_code, 200, email)

    def test_demo_shows_the_pay_per_lead_rule(self):
        # Artisan 1 paid for customer 1's request only, so customer 2 stays hidden
        self.seed()
        self.client.force_login(User.objects.get(email='demo.artisan1@example.com'))
        response = self.client.get('/api/customer/jobrequest/customer-details/')
        self.assertEqual({item['email'] for item in response.data}, {'demo.customer1@example.com'})

    def test_a_password_is_required(self):
        # The message must mention the option; a command that doesn't exist yet would not
        with self.assertRaisesMessage(CommandError, '--password'):
            call_command('seed_demo', stdout=StringIO(), stderr=StringIO())