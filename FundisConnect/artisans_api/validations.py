from rest_framework.exceptions import ValidationError


def profileCustomValidation(data):
    first_name = data["properties"]["first_name"]
    last_name = data["properties"]["last_name"]
    specialization = data["properties"]["specialization"][0]

    ##
    if first_name == "":
        raise ValidationError('First name is required.')
    ##
    if last_name == "":
        raise ValidationError('Last name is required.')
    ##
    if specialization == "":
        raise ValidationError('Specialization is required')
    return data