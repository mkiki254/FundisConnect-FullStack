from django_daraja.mpesa.core import MpesaClient
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def payment_index(request):
    cl = MpesaClient()
    reference = "FundisConnect"
    amount = 1
    phone_number = "254714456992"
    transaction_description = "Description"
    callback_url = 'https://2ffa-41-89-10-241.ngrok-free.app/api/payment'
    response = cl.stk_push(phone_number, amount,reference, transaction_description, callback_url)

    if request.method == 'POST':
        result = cl.parse_stk_result(request.body)
        if result["ResultCode"] == 0:
            print(result)

    return HttpResponse(response)