from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

# Reusing the helpers from the job-request tests. Once a third test file needs them,
# we'll move them into a shared module.
from customers_api.tests import make_artisan, make_job, pay_for

User = get_user_model()
PAYMENT_RESULTS_URL = '/api/payment/results/'


class PaymentResultsAccessTests(APITestCase):
    """Payment records hold phone numbers and transaction codes. Only the artisan who paid may read them."""

    @classmethod
    def setUpTestData(cls):
        cls.customer = User.objects.create_user(
            email='customer1@example.com', username='customer1',
            usertype='customer', phone='0711111111', password='testpass123')
        cls.artisan1, profile1 = make_artisan('artisan1@example.com', 'artisan1', '0733333333', 'One')
        cls.artisan2, profile2 = make_artisan('artisan2@example.com', 'artisan2', '0755555555', 'Two')
        job1 = make_job(cls.customer, profile1, 'Job for artisan1')
        job2 = make_job(cls.customer, profile2, 'Job for artisan2')
        cls.payment1 = pay_for(cls.artisan1, job1)
        cls.payment2 = pay_for(cls.artisan2, job2)

    def test_artisan_sees_only_their_own_payments(self):
        self.client.force_login(self.artisan1)
        response = self.client.get(PAYMENT_RESULTS_URL)
        self.assertEqual(response.status_code, 200)
        codes = {item['transaction_code'] for item in response.data}
        self.assertEqual(codes, {self.payment1.transaction_code})

    def test_customer_cannot_list_payments(self):
        self.client.force_login(self.customer)
        self.assertEqual(self.client.get(PAYMENT_RESULTS_URL).status_code, 403)

    def test_anonymous_user_cannot_list_payments(self):
        self.assertEqual(self.client.get(PAYMENT_RESULTS_URL).status_code, 403)

    def test_mpesa_callback_is_still_reachable_without_login(self):
        # M-Pesa's servers cannot log in. This only checks that the permission layer lets the
        # request through. What the view does with an empty body is not what this test is about.
        self.client.raise_request_exception = False
        response = self.client.post(PAYMENT_RESULTS_URL, {}, format='json')
        self.assertNotIn(response.status_code, (401, 403))