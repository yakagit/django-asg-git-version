from rest_framework import serializers
from .models import Order
from core.models import Call
import pytz

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'object_full_name', 'object_short_name']
    
class CallSerializer(serializers.ModelSerializer):
    # Передаем queryset для поля order
    order = OrderSerializer(read_only=True)

    order_id = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), source='order', write_only=True)

    class Meta:
        model = Call
        fields = ['order_id', 'order', 'zone', 'nadzor_num', 'nadzor_date', 'works', 'interval', 'diameter', 'length', 'material', 'agent', 'agent_phone', 'meet_date', 'meet_place']
    
    def validate_meet_date(self, value):
        if value.tzinfo is None:
            value = pytz.timezone('Europe/Moscow').localize(value)
        return value
