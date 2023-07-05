from rest_framework.exceptions import ValidationError as DRFValidationError
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import RegexValidator

def phone_validation(data):
    phone = data['mpesa_number'].strip()

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
    return data
    

