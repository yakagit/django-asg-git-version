from rest_framework import viewsets
from .models import Order
from .serializers import OrderSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta

SECRET_KEY = '43oifh349hg93rhgjPO#H02Q)#FH938hf923hggsdi)923'
SESSION_DURATION = timedelta(days=1)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

@api_view(['POST'])
def check_secret_key(request):
    user_key = request.data.get('key')

    if user_key == SECRET_KEY:
        request.session['authenticated'] = True
        request.session['expires_at'] = (timezone.now() + SESSION_DURATION).isoformat()
        return Response({"message": "Access granted!"}, status=200)
    else:
        return Response({"message": "Invalid key!"}, status=403)

@api_view(['GET'])
def is_authenticated(request):
    authenticated = request.session.get('authenticated', False)
    expires_at = request.session.get('expires_at')

    if authenticated and expires_at and timezone.now() < timezone.datetime.fromisoformat(expires_at):
        return Response({"authenticated": True}, status=200)
    else:
        return Response({"authenticated": False}, status=401)