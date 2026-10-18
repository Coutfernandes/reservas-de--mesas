
from django.db import models


class Restaurant(models.Model):
  name = models.CharField(max_length=100)
  zone = models.CharField(max_length=100)  

  class Meta:
    unique_together = ('name', 'zone')

  def __str__(self):
    return f'{self.name} ({self.zone})'


class Table(models.Model):
  restaurant = models.ForeignKey(
      Restaurant, on_delete=models.CASCADE, related_name='tables'
  )
  capacity = models.IntegerField()  # Coluna 'table_size' no CSV
  quantity = models.IntegerField()  # Coluna 'table_count' no CSV

  def __str__(self):
    return (
        f'Mesa para {self.capacity} p. em {self.restaurant.name} (Qtd:'
        f' {self.quantity})'
    )


class Reservation(models.Model):
  guest_name = models.CharField(max_length=150)
  guest_email = models.EmailField()
  restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
  table = models.ForeignKey(Table, on_delete=models.CASCADE)
  visit_datetime = models.DateTimeField()
  number_of_guests = models.IntegerField()
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f'Reserva de {self.guest_name} - {self.restaurant.name}'