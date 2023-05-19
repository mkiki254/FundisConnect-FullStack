from rest_framework.exceptions import ValidationError as DRFValidationError
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import RegexValidator
from django.contrib.auth import get_user_model


UserModel = get_user_model()

def custom_validation(data):
    email = data['email'].strip()
    username = data['username'].strip()
    phone = data['phone'].strip()
    password = data['password'].strip()

    ##
    if not email or UserModel.objects.filter(email=email).exists():
        raise DRFValidationError('Email already exists. Choose another email')
    ##
    if not password or len(password) < 8:
        raise DRFValidationError('The password must have a minimum of 8 characters')
    ##
    if not username:
        raise DRFValidationError('Please enter your username')
    
    
    ##
    if not phone or len(phone) != 10:
        raise DRFValidationError("Please enter a valid phone number. Phone digits must be 10")
    ##
    validators=RegexValidator(regex=r'^\d{1,10}$', message="Please enter a valid phone number. No letters or symbols allowed.")
    try:
        validators(phone)
    except DjangoValidationError as e:
        raise DRFValidationError (e.message)
    return data

    


def validate_email(data):
    email = data['email'].strip()
    if not email:
        raise DRFValidationError('an email is needed')
    return True

def validate_password(data):
    password = data['password'].strip()
    if not password:
        raise DRFValidationError('a password is needed')
    return True

