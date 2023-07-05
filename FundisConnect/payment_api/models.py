from django.db import models
from user_api.models import AppUser

class ArtisanPayment(models.Model):
    payment_id = models.BigAutoField(primary_key=True)
    artisan = models.ForeignKey(AppUser, on_delete=models.CASCADE, limit_choices_to={'usertype': 'artisan'})
    transaction_code = models.CharField(max_length=50)
    artisan_number = models.CharField(max_length=20)
    transaction_date = models.DateTimeField()
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.transaction_code
