import os
import sys
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime
from django.db import transaction

sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))  # Путь к корню проекта
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

from core.models import *

SERVICE_ACCOUNT_FILE = 'credentials.json'

SCOPES = ['https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive']

credentials = Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)

client = gspread.authorize(credentials)

spreadsheet = client.open('АСГ. Объекты. Сопровождение')

sheet = spreadsheet.worksheet('МВК Москва')  # или spreadsheet.worksheet('Sheet1')

data = sheet.get_all_records()

# Функция для сохранения данных в базу
@transaction.atomic
def save_data_to_db():
    for record in data[1:]:
        try:
            head_customer_name = 'АО "Мосводоканал"' #object
            order_manager_FIO = record['РП'].split(' ') #object
            order_manager_name = None
            order_manager_surname = None
            order_manager_patronymic = None

            try:
                if len(order_manager_FIO) > 0:
                    order_manager_name = order_manager_FIO[0]  # Имя
                if len(order_manager_FIO) > 1:
                    order_manager_surname = order_manager_FIO[1]  # Фамилия
                if len(order_manager_FIO) > 2:
                    order_manager_patronymic = order_manager_FIO[2]  # Отчество
            except Exception as e:
                print(f"Ошибка при извлечении данных из списка: {e}")

            customer_name = record['Технический заказчик']
            order_num = record['№ Договора']
            order_date = datetime.strptime(record['от'], "%d.%m.%Y")
            object_full_name = record['Полное наименование объекта']
            object_short_name = record['Объект']

            # Создание или обновление записи в базе данных
            head_customer, _ = HeadCustomer.objects.get_or_create(
                name=head_customer_name
            )

            # Создание или обновление записи в базе данных
            customer, _ = Customer.objects.get_or_create(
                name=customer_name,
                defaults={
                    'head_customer': head_customer
                }
            )

            order_manager, _ = OrderManager.objects.get_or_create(
                name=order_manager_name,
                surname=order_manager_surname,
                defaults={
                    'patronymic': order_manager_patronymic,
                }
            )

            order, _ = Order.objects.update_or_create(
                order_num=order_num,
                order_manager=order_manager,
                defaults={
                    'customer': customer,
                    'order_date': order_date,
                    'object_short_name': object_short_name,
                    'object_full_name': object_full_name,
                }
            )

        except Exception as e:
            print(f"Ошибка при обработке записи: , ошибка: {e}")

    #customers = Order.objects.all()
    #print(customers)

if __name__ == '__main__':
    save_data_to_db()
