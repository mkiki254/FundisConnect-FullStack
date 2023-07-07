from django_daraja.mpesa.core import MpesaClient
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import MpesaNumberSerializer, ArtisanPaymentSerializer
from rest_framework import permissions, status
from .validations import phone_validation
from user_api.permissions import IsArtisan
from django.contrib.auth import get_user
from .models import ArtisanPayment
from datetime import datetime
from django.core.cache import cache
from .models import ArtisanPayment


class PaymentAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsArtisan, )
    authentication_classes = (SessionAuthentication, )
    
    @csrf_exempt
    def post(self, request):
        user = get_user(request)
        cache.set("user", user)
        clean_data = phone_validation(request.data)
        serializer = MpesaNumberSerializer(data=clean_data)
        if serializer.is_valid():
            job_request_id = serializer.validated_data['job_request_id']
            print(job_request_id)
            cache.set("job_request_id", job_request_id)
            mpesa_number = serializer.validated_data['mpesa_number']
            modified_mpesa_number = f"254{mpesa_number.lstrip('0')}"
            cl = MpesaClient()
            reference = "FundisConnect"
            amount = 1
            phone_number = modified_mpesa_number
            transaction_description = "Description"
            callback_url = 'https://ee85-41-89-10-241.ngrok-free.app/api/payment/results/'
            response = cl.stk_push(phone_number, amount,reference, transaction_description, callback_url)
            # print(response)
            return Response(response)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)            

class PaymentResultsAPIView(APIView):
    permission_classes = (permissions.AllowAny, )    
    def get(self, request):
        artisan_payments = ArtisanPayment.objects.all()
        serializer = ArtisanPaymentSerializer(artisan_payments, many=True)
        return Response(serializer.data)

    @csrf_exempt
    def post(self, request):
        if request.method == 'POST':
            print(cache.get("job_request_id"))
            cl = MpesaClient()
            result = cl.parse_stk_result(request.body)
            if result["ResultCode"] == 0:
                print("Transaction was successful")
                transaction_code = result["MpesaReceiptNumber"]
                mpesa_number = str(result["PhoneNumber"])
                modified_mpesa_number = f"0{mpesa_number.lstrip('254')}"
                transaction_date_str = str(result["TransactionDate"])
                transaction_date = datetime.strptime(transaction_date_str, "%Y%m%d%H%M%S")
                amount_paid = result["Amount"]

                artisan_payment = ArtisanPayment(
                    artisan = cache.get("user"),
                    job_request_id = cache.get("job_request_id"),
                    transaction_code=transaction_code,
                    artisan_number = modified_mpesa_number,
                    transaction_date = transaction_date.isoformat(),
                    amount_paid = amount_paid
                )
                artisan_payment.save()
                cache.delete("user")
                cache.delete("job_request_id")
                return Response("Payment Successful")
            return Response("Payment Unsuccessful")
        return Response(status=status.HTTP_400_BAD_REQUEST)