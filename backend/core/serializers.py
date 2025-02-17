from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    customer = serializers.StringRelatedField()
    order_manager = serializers.StringRelatedField()

    class Meta:
        model = Order
        fields = [
            'id',
            'customer',
            'order_manager',
            'order_num',
            'order_date',
            'object_full_name',
            'object_short_name',
        ]
