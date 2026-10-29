import io
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone
from PIL import Image, ImageDraw, ImageFont

from artisans_api.models import ArtisanPersonalInfo
from customers_api.models import CustomerJobRequests
from payment_api.models import ArtisanPayment

User = get_user_model()

# first name, last name, trade, neighbourhood, longitude, latitude.
# The names are made up and the locations are approximate neighbourhood centres.
ARTISANS = [
    ('Wanjiku', 'Mwangi', 'plumber', 'Westlands', 36.8108, -1.2676),
    ('Otieno', 'Odhiambo', 'plumber', 'South B', 36.8330, -1.3100),
    ('Achieng', 'Akinyi', 'electrician', 'Kilimani', 36.7850, -1.2900),
    ('Kamau', 'Njoroge', 'electrician', 'Ruaka', 36.7790, -1.2070),
    ('Mutua', 'Kioko', 'carpenter', 'Karen', 36.7110, -1.3190),
    ('Wafula', 'Barasa', 'mason', 'Eastleigh', 36.8490, -1.2740),
    ('Chebet', 'Kiplagat', 'tiling', 'Kasarani', 36.8970, -1.2200),
    ('Hassan', 'Abdi', 'painter', 'Rongai', 36.7500, -1.3960),
]
COLOURS = ['#2b6cb0', '#2f855a', '#c05621', '#6b46c1', '#b83280', '#2c7a7b', '#975a16', '#4a5568']

# username, phone
CUSTOMERS = [('grace_wambui', '0711000001'), ('brian_otieno', '0711000002')]

# customer number, artisan number (both starting at 1), title, description, days ahead,
# address, longitude, latitude
JOBS = [
    (1, 1, 'Leaking kitchen sink', 'Water leaks under the sink every time the tap runs.',
     3, 'Westlands, Nairobi', 36.8120, -1.2660),
    (1, 3, 'Faulty socket in the living room', 'The socket sparks when a plug is inserted.',
     5, 'Kilimani, Nairobi', 36.7870, -1.2890),
    (2, 1, 'Low water pressure in the bathroom', 'The shower barely runs in the mornings.',
     7, 'South B, Nairobi', 36.8350, -1.3090),
]


def avatar_png(first, last, colour):
    """A 240x240 PNG showing the artisan's initials, since demo artisans have no photos."""
    size = 240
    image = Image.new('RGB', (size, size), colour)
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default(size=100)
    initials = f'{first[0]}{last[0]}'
    left, top, right, bottom = draw.textbbox((0, 0), initials, font=font)
    draw.text(((size - (right - left)) / 2 - left, (size - (bottom - top)) / 2 - top),
              initials, fill='white', font=font)
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    return buffer.getvalue()


def upsert_user(email, username, usertype, phone, password):
    user = User.objects.filter(email=email).first()
    if user is None:
        return User.objects.create_user(
            email=email, username=username, usertype=usertype, phone=phone, password=password)
    user.set_password(password)   # a re-run with a new password updates it
    user.save()
    return user


class Command(BaseCommand):
    help = ('Create demo customers, artisans, job requests and one paid lead so the site is not empty. '
            'Safe to run more than once.')

    def add_arguments(self, parser):
        parser.add_argument(
            '--password', required=True,
            help='Password for every demo account (at least 8 characters). It is never stored in the repo.')

    @transaction.atomic
    def handle(self, *args, **options):
        password = options['password']
        if len(password) < 8:
            raise CommandError('The password must have at least 8 characters.')

        customers = []
        for number, (username, phone) in enumerate(CUSTOMERS, start=1):
            customers.append(upsert_user(
                f'demo.customer{number}@example.com', username, 'customer', phone, password))

        artisans = []
        for number, (first, last, trade, _area, lon, lat) in enumerate(ARTISANS, start=1):
            user = upsert_user(f'demo.artisan{number}@example.com', f'demo_artisan{number}',
                               'artisan', f'072000000{number}', password)
            profile, _ = ArtisanPersonalInfo.objects.get_or_create(
                user=user,
                defaults={'first_name': first, 'last_name': last, 'specialization': trade,
                          'location': Point(lon, lat, srid=4326)})
            if not profile.profile_picture:
                profile.profile_picture.save(
                    f'demo-{first.lower()}-{last.lower()}.png',
                    ContentFile(avatar_png(first, last, COLOURS[number - 1])))
            artisans.append((user, profile))

        jobs = []
        for customer_no, artisan_no, title, description, days, address, lon, lat in JOBS:
            job, _ = CustomerJobRequests.objects.update_or_create(
                customer=customers[customer_no - 1],
                selected_artisan=artisans[artisan_no - 1][1],
                job_title=title,
                # Re-running before a demo moves the dates forward again
                defaults={'job_description': description,
                          'schedule': timezone.now() + timedelta(days=days),
                          'address': address, 'location': Point(lon, lat, srid=4326)})
            jobs.append(job)

        # Artisan 1 has already paid for the first lead, so the "accepted job" screens have content
        # without needing the M-Pesa sandbox. Customer 2's request to the same artisan stays locked.
        ArtisanPayment.objects.get_or_create(
            job_request_id=jobs[0],
            defaults={'artisan': artisans[0][0], 'transaction_code': 'DEMO0001',
                      'artisan_number': artisans[0][0].phone,
                      'transaction_date': timezone.now() - timedelta(days=1), 'amount_paid': 100})

        self.stdout.write(self.style.SUCCESS(
            f'Demo data ready: {len(customers)} customers, {len(artisans)} artisans, '
            f'{len(jobs)} job requests, 1 payment.'))
        self.stdout.write('Log in with any of these emails and the password you gave:')
        self.stdout.write('  customers: demo.customer1@example.com, demo.customer2@example.com')
        self.stdout.write('  artisans:  demo.artisan1@example.com ... demo.artisan8@example.com')