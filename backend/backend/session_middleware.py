from django.shortcuts import redirect
from django.conf import settings

class SessionCheckMiddleware:
    """
    Middleware для проверки наличия сессии.
    Если сессия не установлена, перенаправляет пользователя на страницу ввода секретного ключа.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Исключаем страницы, которые не требуют проверки сессии (например, ввод секретного ключа и админка)
        exempt_urls = [settings.LOGIN_URL, '/secret/']
        
        if not request.session.get('authenticated') and request.path not in exempt_urls:
            return redirect('secret_key')  # Перенаправление на ввод секретного ключа

        response = self.get_response(request)
        return response
