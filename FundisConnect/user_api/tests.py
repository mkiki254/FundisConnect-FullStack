from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

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