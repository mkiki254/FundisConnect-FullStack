from django_daraja.mpesa.core import MpesaClient
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import MpesaNumberSerializer
from rest_framework import permissions, status
from .validations import phone_validation
from user_api.permissions import IsArtisan
from django.contrib.auth import get_user_model
from .models import ArtisanPayment
from datetime import datetime


User = get_user_model()
class PaymentAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsArtisan, )
    authentication_classes = (SessionAuthentication, )
    
    @csrf_exempt
    def post(self, request):
        clean_data = phone_validation(request.data)
        serializer = MpesaNumberSerializer(data=clean_data)
        if serializer.is_valid():
            mpesa_number = serializer.validated_data['mpesa_number']
            modified_mpesa_number = f"254{mpesa_number.lstrip('0')}"
            cl = MpesaClient()
            reference = "FundisConnect"
            amount = 1
            phone_number = modified_mpesa_number
            transaction_description = "Description"
            callback_url = 'https://91a3-105-58-227-169.ngrok-free.app/api/payment/results/'
            response = cl.stk_push(phone_number, amount,reference, transaction_description, callback_url)
            # print(response)
            return Response(response)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)            

class PaymentResultsAPIView(APIView):
    permission_classes = (permissions.AllowAny, )    

    @csrf_exempt
    def post(self, request):
        if request.method == 'POST':
            cl = MpesaClient()
            result = cl.parse_stk_result(request.body)
            if result["ResultCode"] == 0:
                print("Transaction was successful")
                transaction_code = result["MpesaReceiptNumber"]
                mpesa_number = str(result["PhoneNumber"])
                modified_mpesa_number = f"0{mpesa_number.lstrip('254')}"
                artisan = User.objects.filter(phone = modified_mpesa_number).first()
                transaction_date_str = str(result["TransactionDate"])
                transaction_date = datetime.strptime(transaction_date_str, "%Y%m%d%H%M%S")
                # iso_date = transaction_date.isoformat()
                amount_paid = result["Amount"]

                artisan_payment = ArtisanPayment(
                    artisan = artisan,
                    transaction_code=transaction_code,
                    artisan_number = modified_mpesa_number,
                    transaction_date = transaction_date.isoformat(),
                    amount_paid = amount_paid
                )
                artisan_payment.save()
            return Response("Payment Successful")
        return Response(status=status.HTTP_400_BAD_REQUEST)