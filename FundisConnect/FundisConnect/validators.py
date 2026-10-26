from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

MAX_IMAGE_BYTES = 10 * 1024 * 1024    # 10 MB for photos
MAX_VIDEO_BYTES = 50 * 1024 * 1024    # 50 MB for videos


def validate_upload_size(file):
    limit = MAX_VIDEO_BYTES if file.name.lower().endswith('.mp4') else MAX_IMAGE_BYTES
    if file.size > limit:
        raise ValidationError(f'The file is too large. The maximum size is {limit // (1024 * 1024)} MB.')

validate_image_extension = FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])
validate_job_media_extension = FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'mp4'])