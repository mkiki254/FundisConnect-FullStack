from datetime import timedelta

from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from django.utils import timezone
from rest_framework.test import APITestCase

from artisans_api.models import ArtisanPersonalInfo
from customers_api.models import CustomerJobRequests
from payment_api.models import ArtisanPayment

User = get_user_model()
JOB_LIST_URL = '/api/customer/jobrequest/'


class JobRequestAccessTests(APITestCase):
    """Job requests are visible only to their owner and the artisan they are addressed to."""

    @classmethod
    def setUpTestData(cls):
        # Runs once per class; Django rolls the data back afterwards.
        cls.customer1 = User.objects.create_user(
            email='customer1@example.com', username='customer1',
            usertype='customer', phone='0711111111', password='testpass123')
        cls.customer2 = User.objects.create_user(
            email='customer2@example.com', username='customer2',
            usertype='customer', phone='0744444444', password='testpass123')
        # The artisan the job is addressed to
        cls.artisan_user = User.objects.create_user(
            email='artisan1@example.com', username='artisan1',
            usertype='artisan', phone='0733333333', password='testpass123')
        cls.artisan = ArtisanPersonalInfo.objects.create(
            user=cls.artisan_user, first_name='Artisan', last_name='One',
            specialization='plumber', location=Point(36.8219, -1.2921, srid=4326))
        # A second artisan who has nothing to do with the job
        cls.other_artisan_user = User.objects.create_user(
            email='artisan2@example.com', username='artisan2',
            usertype='artisan', phone='0755555555', password='testpass123')
        ArtisanPersonalInfo.objects.create(
            user=cls.other_artisan_user, first_name='Artisan', last_name='Two',
            specialization='electrician', location=Point(36.9, -1.3, srid=4326))
        cls.job = CustomerJobRequests.objects.create(
            customer=cls.customer1, selected_artisan=cls.artisan,
            job_title='Leaking kitchen sink',
            job_description='Water leaks under the sink.',
            schedule=timezone.now() + timedelta(days=7),
            address='Test Building, Nairobi',
            location=Point(36.8172, -1.2864, srid=4326))
        cls.detail_url = f'{JOB_LIST_URL}{cls.job.job_request_id}/'

    # ---- reading ----

    def test_owner_can_read_own_job_request(self):
        # Control test: proves the setup is right
        self.client.force_login(self.customer1)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, 200)

    def test_other_customer_cannot_read_job_request(self):
        self.client.force_login(self.customer2)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, 404)

    def test_job_request_list_hides_other_customers_requests(self):
        self.client.force_login(self.customer2)
        response = self.client.get(JOB_LIST_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['features']), 0)

    def test_selected_artisan_can_read_the_request_addressed_to_them(self):
        # Control for the artisan side: the React app depends on this
        self.client.force_login(self.artisan_user)
        self.assertEqual(self.client.get(self.detail_url).status_code, 200)
        response = self.client.get(JOB_LIST_URL)
        self.assertEqual(len(response.data['features']), 1)

    def test_other_artisan_cannot_read_the_request(self):
        self.client.force_login(self.other_artisan_user)
        self.assertEqual(self.client.get(self.detail_url).status_code, 404)
        response = self.client.get(JOB_LIST_URL)
        self.assertEqual(len(response.data['features']), 0)

    def test_nonexistent_request_returns_404_not_500(self):
        self.client.force_login(self.customer1)
        response = self.client.get(f'{JOB_LIST_URL}9999/')
        self.assertEqual(response.status_code, 404)

    # ---- changing and deleting ----

    def test_other_customer_cannot_edit_the_request(self):
        self.client.force_login(self.customer2)
        response = self.client.put(self.detail_url, {'job_title': 'Hacked'}, format='multipart')
        self.assertEqual(response.status_code, 404)
        self.job.refresh_from_db()
        self.assertEqual(self.job.job_title, 'Leaking kitchen sink')   # unchanged

    def test_other_customer_cannot_delete_the_request(self):
        self.client.force_login(self.customer2)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, 404)
        self.assertTrue(CustomerJobRequests.objects.filter(pk=self.job.pk).exists())

    def test_owner_can_still_edit_the_request(self):
        # Control: the rules must not lock out the rightful owner
        self.client.force_login(self.customer1)
        response = self.client.put(self.detail_url, {
            'job_title': 'Updated title',
            'job_description': 'Water leaks under the sink.',
            'schedule': '2026-11-20T09:00:00.000Z',
            'address': 'Test Building, Nairobi',
            'selected_artisan': self.artisan.pk,
            'location': 'POINT(36.8172 -1.2864)',
        }, format='multipart')
        self.assertEqual(response.status_code, 200)
        self.job.refresh_from_db()
        self.assertEqual(self.job.job_title, 'Updated title')

CUSTOMER_DETAILS_URL = '/api/customer/jobrequest/customer-details/'


def make_artisan(email, username, phone, first_name):
    user = User.objects.create_user(
        email=email, username=username, usertype='artisan', phone=phone, password='testpass123')
    profile = ArtisanPersonalInfo.objects.create(
        user=user, first_name=first_name, last_name='Test', specialization='plumber',
        location=Point(36.82, -1.29, srid=4326))
    return user, profile


def make_job(customer, artisan_profile, title):
    return CustomerJobRequests.objects.create(
        customer=customer, selected_artisan=artisan_profile, job_title=title,
        job_description='Test job.', schedule=timezone.now() + timedelta(days=7),
        address='Test Building, Nairobi', location=Point(36.8172, -1.2864, srid=4326))


def pay_for(artisan_user, job):
    return ArtisanPayment.objects.create(
        artisan=artisan_user, job_request_id=job, transaction_code=f'TEST{job.pk}',
        artisan_number=artisan_user.phone, transaction_date=timezone.now(), amount_paid=100)


class CustomerDetailsGateTests(APITestCase):
    """An artisan sees a customer's contact details only after paying for that customer's job."""

    @classmethod
    def setUpTestData(cls):
        cls.customer1 = User.objects.create_user(
            email='customer1@example.com', username='customer1',
            usertype='customer', phone='0711111111', password='testpass123')
        cls.customer2 = User.objects.create_user(
            email='customer2@example.com', username='customer2',
            usertype='customer', phone='0744444444', password='testpass123')
        cls.artisan1, profile1 = make_artisan('artisan1@example.com', 'artisan1', '0733333333', 'One')
        cls.artisan2, profile2 = make_artisan('artisan2@example.com', 'artisan2', '0755555555', 'Two')
        cls.job1 = make_job(cls.customer1, profile1, 'Job for artisan1')
        cls.job2 = make_job(cls.customer2, profile2, 'Job for artisan2')

    def emails_seen_by(self, user):
        self.client.force_login(user)
        response = self.client.get(CUSTOMER_DETAILS_URL)
        self.assertEqual(response.status_code, 200)
        return {item['email'] for item in response.data}

    def test_artisan_sees_no_customers_before_paying(self):
        self.assertEqual(self.emails_seen_by(self.artisan1), set())

    def test_artisan_sees_the_customer_after_paying(self):
        pay_for(self.artisan1, self.job1)
        self.assertEqual(self.emails_seen_by(self.artisan1), {'customer1@example.com'})

    def test_payment_for_one_job_reveals_only_that_customer(self):
        pay_for(self.artisan2, self.job2)
        self.assertEqual(self.emails_seen_by(self.artisan2), {'customer2@example.com'})
        self.assertEqual(self.emails_seen_by(self.artisan1), set())   # artisan1 has paid for nothing

    def test_customers_cannot_use_the_endpoint(self):
        for customer in (self.customer1, self.customer2):
            self.client.force_login(customer)
            self.assertEqual(self.client.get(CUSTOMER_DETAILS_URL).status_code, 403)

    def test_anonymous_user_is_refused(self):
        self.assertEqual(self.client.get(CUSTOMER_DETAILS_URL).status_code, 403)

class JobRequestCreationTests(APITestCase):
    """Only customers create job requests."""

    @classmethod
    def setUpTestData(cls):
        cls.customer = User.objects.create_user(
            email='customer1@example.com', username='customer1',
            usertype='customer', phone='0711111111', password='testpass123')
        cls.artisan_user, profile = make_artisan('artisan1@example.com', 'artisan1', '0733333333', 'One')
        cls.job_data = {
            'job_title': 'Leaking kitchen sink',
            'job_description': 'Water leaks under the sink.',
            'schedule': '2026-11-20T09:00:00.000Z',
            'address': 'Test Building, Nairobi',
            'selected_artisan': profile.pk,
            'location': 'POINT(36.8172 -1.2864)',
        }

    def test_customer_can_create_a_job_request(self):
        # Control test
        self.client.force_login(self.customer)
        response = self.client.post(JOB_LIST_URL, self.job_data, format='multipart')
        self.assertEqual(response.status_code, 201)

    def test_artisan_cannot_create_a_job_request(self):
        self.client.force_login(self.artisan_user)
        response = self.client.post(JOB_LIST_URL, self.job_data, format='multipart')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(CustomerJobRequests.objects.count(), 0)