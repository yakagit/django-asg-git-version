# calls/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CallViewSet

router = DefaultRouter()
router.register(r'', CallViewSet, basename='call')

urlpatterns = [
    path('calls/', include(router.urls)),
]
