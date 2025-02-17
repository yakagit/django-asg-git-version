from django.db import models


# Главная компания
class HeadCustomer(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

# Подразделение
class Customer(models.Model):
    head_customer = models.ForeignKey(
        HeadCustomer,
        on_delete=models.CASCADE,
        related_name='customers'
    )
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

# Менеджер заказа
class OrderManager(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True)
    surname = models.CharField(max_length=50, null=True, blank=True)
    patronymic = models.CharField(max_length=50, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True, unique=True)

    class Meta:
        unique_together = ('name', 'surname')

    def __str__(self):
        return f"{self.surname} {self.name} {self.patronymic}"

# Заказ
class Order(models.Model):
    customer = models.ForeignKey(
        Customer, 
        on_delete=models.CASCADE, 
        related_name='orders'
    )
    order_manager = models.ForeignKey(
        OrderManager, 
        on_delete=models.CASCADE, 
        related_name='orders'
    )
    order_num = models.CharField(max_length=45, unique=True)
    order_date = models.DateField(null=True, blank=True)
    object_full_name = models.TextField(null=True, blank=True)
    object_short_name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.order_num

# Вызов
class Call(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='calls', verbose_name="Кодовое название")
    nadzor_num = models.CharField(max_length=100, null=True, blank=True, verbose_name="Договор на ТН")
    nadzor_date = models.DateField(null=True, blank=True, verbose_name="Дата договора ТН")
    works = models.TextField(null=True, blank=True, verbose_name="Работы")
    interval = models.CharField(max_length=100, null=True, blank=True, verbose_name="Интервал")
    diameter = models.CharField(max_length=100, null=True, blank=True, verbose_name="Диаметр")
    length = models.CharField(max_length=100, null=True, blank=True, verbose_name="Длина")
    material = models.CharField(max_length=100, null=True, blank=True, verbose_name="Материал")
    agent = models.CharField(max_length=100, null=True, blank=True, verbose_name="Представитель")
    agent_phone = models.CharField(max_length=20, null=True, blank=True, verbose_name="Контакт")
    meet_date = models.DateTimeField(null=True, blank=True, verbose_name="Дата встречи")
    meet_place = models.CharField(max_length=255, null=True, blank=True, verbose_name="Место встречи")
    zone = models.CharField(max_length=255, null=True, blank=True, verbose_name="Район")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Call {self.id} for Order {self.order_id}"
