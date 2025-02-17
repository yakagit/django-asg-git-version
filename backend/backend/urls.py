from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from core.views import OrderViewSet  # Подключаем ViewSet для Order
from core.views import check_secret_key, is_authenticated

# Создаем экземпляр роутера
router = routers.DefaultRouter()

# Регистрируем ViewSet с роутером
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('calls.urls')),
    path('api/', include(router.urls)),
    path('api/check-secret-key/', check_secret_key),
    path('api/is-authenticated/', is_authenticated),
]
