from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from io import BytesIO
from .models import Order
from core.models import Call
from .serializers import CallSerializer
from .services.docx_to_pdf import DocxToPdf
from .services.generate_docx import GenerateDocx
import os

class CallViewSet(viewsets.ModelViewSet):
    queryset = Call.objects.all().order_by('-created_at')
    serializer_class = CallSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        instance = serializer.save()

        data = {
            'object_full_name': instance.order.object_full_name,
            'nadzor_num': instance.nadzor_num,
            'nadzor_date': instance.nadzor_date.strftime('%d.%m.%Y') if instance.nadzor_date else '',
            'works': instance.works if instance.works else '',
            'interval': instance.interval if instance.interval else '',
            'diameter': instance.diameter if instance.diameter else '',
            'length': instance.length if instance.length else '',
            'material': instance.material if instance.material else '',
            'agent': instance.agent if instance.agent else '',
            'agent_phone': instance.agent_phone if instance.agent_phone else '',
            'meet_date': instance.meet_date.strftime('%d.%m.%Y в %H:%M') if instance.meet_date else '',
            'meet_place': instance.meet_place if instance.meet_place else '',
            'zone': instance.zone if instance.zone else '',
            'object_short_name': instance.order.object_short_name
        }

        # Генерация docx и pdf
        try:
            docx_path = GenerateDocx(data)
            pdf_path = DocxToPdf(docx_path)
        except Exception as e:
            return Response({"error": f"Ошибка при генерации PDF: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Проверяем, что PDF файл существует
        if os.path.exists(pdf_path):
            try:
                with open(pdf_path, 'rb') as pdf_file:
                    pdf_data = pdf_file.read()

                pdf_io = BytesIO(pdf_data)
                response = FileResponse(pdf_io, content_type='application/pdf')
                response['Content-Disposition'] = f'attachment; filename="{instance.order.object_short_name}.pdf"'
                return response
            except Exception as e:
                return Response({"error": f"Ошибка при чтении PDF файла: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "Файл PDF не найден."}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'], url_path='last-call-by-order/(?P<order_id>[^/.]+)')
    def get_last_call_for_order(self, request, order_id=None):
        order = get_object_or_404(Order, id=order_id)

        last_call = Call.objects.filter(order=order).order_by('-created_at').first()

        if last_call:
            serializer = CallSerializer(last_call)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'None'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['get'], url_path='prev-calls-by-order/(?P<order_id>[^/.]+)')
    def get_prev_calls_by_order(self, request, order_id=None):
        order = get_object_or_404(Order, id=order_id)

        calls_list = Call.objects.filter(order=order).order_by('-created_at')
        if calls_list.exists():
            serializer = CallSerializer(calls_list, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'None'}, status=status.HTTP_404_NOT_FOUND)

