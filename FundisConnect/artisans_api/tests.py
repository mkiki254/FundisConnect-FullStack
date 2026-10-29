import io
import shutil
import tempfile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from PIL import Image
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

TEMP_MEDIA_ROOT = tempfile.mkdtemp()   # uploads go here, never into your real media/ folder


def image_file(name, fmt):
    """A real, tiny image: it passes Pillow's content check, so only the extension rule can stop it."""
    buffer = io.BytesIO()
    Image.new('RGB', (10, 10), 'red').save(buffer, format=fmt)
    return SimpleUploadedFile(name, buffer.getvalue(), content_type=f'image/{fmt.lower()}')


@override_settings(MEDIA_ROOT=TEMP_MEDIA_ROOT)
class ProfilePictureTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.artisan_user = User.objects.create_user(
            email='newartisan@example.com', username='newartisan',
            usertype='artisan', phone='0766666666', password='testpass123')

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA_ROOT, ignore_errors=True)
        super().tearDownClass()

    def post_profile(self, picture):
        self.client.force_login(self.artisan_user)
        return self.client.post(PROFILE_URL, {**PROFILE_DATA, 'profile_picture': picture}, format='multipart')

    def test_png_picture_is_accepted(self):
        # Control test
        self.assertEqual(self.post_profile(image_file('me.png', 'PNG')).status_code, 201)

    def test_gif_picture_is_rejected(self):
        response = self.post_profile(image_file('me.gif', 'GIF'))
        self.assertEqual(response.status_code, 400)
        self.assertIn('profile_picture', response.data)

    def test_real_image_with_an_mp4_name_is_rejected(self):
        response = self.post_profile(image_file('me.mp4', 'PNG'))
        self.assertEqual(response.status_code, 400)
        self.assertIn('profile_picture', response.data)