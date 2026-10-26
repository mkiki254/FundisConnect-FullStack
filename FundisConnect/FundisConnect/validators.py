from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

MAX_UPLOAD_BYTES = 10 * 1024 * 1024   # 10 MB


def validate_upload_size(file):
    if file.size > MAX_UPLOAD_BYTES:
        raise ValidationError('The file is too large. The maximum size is 10 MB.')


validate_image_extension = FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])
validate_job_media_extension = FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'mp4'])