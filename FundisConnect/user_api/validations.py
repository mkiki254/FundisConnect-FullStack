from rest_framework.exceptions import ValidationError as DRFValidationError
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import RegexValidator
from django.contrib.auth import get_user_model

UserModel = get_user_model()

# Roles a person may choose for themselves when signing up. "admin" is left out on
# purpose: admin accounts are created in the Django admin site.
SIGNUP_USERTYPES = ('customer', 'artisan')


def clean_text(data, name):
    """Return data[name] without surrounding spaces.
    A missing or non-text value counts as empty, so the "is required" checks
    below handle it, instead of a KeyError turning into a 500."""
    value = data.get(name)
    return value.strip() if isinstance(value, str) else ''


def custom_validation(data):
    email = clean_text(data, 'email')
    username = clean_text(data, 'username')
    usertype = clean_text(data, 'usertype')
    # The password is stored exactly as typed; only the checks ignore surrounding spaces
    password = data.get('password') if isinstance(data.get('password'), str) else ''

    if not email:
        raise DRFValidationError('An email is required.')
    if UserModel.objects.filter(email=email).exists():
        raise DRFValidationError('Email already exists. Choose another email')
    if not username:
        raise DRFValidationError('Please enter your username')
    validate_phone(data)
    if usertype not in SIGNUP_USERTYPES:
        raise DRFValidationError('Please indicate whether you are a customer or an artisan')
    if not password.strip():
        raise DRFValidationError('A password is required.')
    if len(password.strip()) < 8:
        raise DRFValidationError('The password must have a minimum of 8 characters')
    # Return the cleaned values, so what was validated is exactly what gets saved
    return {'email': email, 'username': username, 'usertype': usertype,
            'phone': clean_text(data, 'phone'), 'password': password}


def validate_email(data):
    if not clean_text(data, 'email'):
        raise DRFValidationError('an email is needed')
    return True


def validate_password(data):
    password = data.get('password')
    if not isinstance(password, str) or not password.strip():
        raise DRFValidationError('a password is needed')
    return True


def validate_phone(data):
    phone = clean_text(data, 'phone')
    if not phone:
        raise DRFValidationError("A phone number is required.")
    if len(phone) != 10:
        raise DRFValidationError("Please enter a valid phone number. Phone digits must be 10")
    validators = RegexValidator(regex=r'^\d{1,10}$', message="Please enter a valid phone number. No letters or symbols allowed.")
    try:
        validators(phone)
    except DjangoValidationError as e:
        raise DRFValidationError(e.message)
    return data