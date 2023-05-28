from rest_framework.exceptions import ValidationError as DRFValidationError
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import RegexValidator
from django.contrib.auth import get_user_model

UserModel = get_user_model()

def custom_validation(data):
    email = data['email'].strip()
    username = data['username'].strip()
    usertype = data['usertype'].strip()
    phone = data['phone'].strip()
    password = data['password'].strip()

    ##
    if not email:
        raise DRFValidationError('An email is required.')
    ## 
    if UserModel.objects.filter(email=email).exists():
        raise DRFValidationError('Email already exists. Choose another email')
    ##
    if not username:
        raise DRFValidationError('Please enter your username') 
    ##
    if not phone:
        raise DRFValidationError("A phone number is required.")
    ##
    if len(phone) != 10:
        raise DRFValidationError("Please enter a valid phone number. Phone digits must be 10")
    ##
    validators=RegexValidator(regex=r'^\d{1,10}$', message="Please enter a valid phone number. No letters or symbols allowed.")
    try:
        validators(phone)
    except DjangoValidationError as e:
        raise DRFValidationError (e.message)
    ##
    if not usertype:
        raise DRFValidationError("Please indicate whether you are a customer or an artisan")
    ##
    if not password:
        raise DRFValidationError('A password is required.') 
    ##
    if len(password) < 8:
        raise DRFValidationError('The password must have a minimum of 8 characters')
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

