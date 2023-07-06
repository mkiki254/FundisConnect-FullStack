from django.contrib import admin
from django.contrib.admin import ModelAdmin
from .models import ArtisanPayment  


@admin.register(ArtisanPayment)
class ArtisanPaymentAdmin(ModelAdmin):
    list_display = ('payment_id', 'artisan', 'job_request_id', 'transaction_code', 'artisan_number', 'transaction_date', 'amount_paid')
