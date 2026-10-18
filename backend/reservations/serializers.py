from datetime import timedelta
from rest_framework import serializers
from .models import Reservation, Restaurant, Table


class RestaurantSerializer(serializers.ModelSerializer):
  class Meta:
    model = Restaurant
    fields = '__all__'


class TableSerializer(serializers.ModelSerializer):
  class Meta:
    model = Table
    fields = '__all__'


class ReservationSerializer(serializers.ModelSerializer):

  class Meta:
    model = Reservation
    fields = '__all__'

  def validate(self, data):
    guests = data['number_of_guests']
    table = data['table']
    visit_time = data['visit_datetime']

    # 1. Validação de capacidade da mesa
    if guests > table.capacity:
      raise serializers.ValidationError(
          'O número de convidados excede a capacidade desta mesa.'
      )

    # 2. Janela de 2 horas para verificação de conflitos/overbooking
    start_window = visit_time - timedelta(hours=1, minutes=59)
    end_window = visit_time + timedelta(hours=1, minutes=59)

    existing_reservations = Reservation.objects.filter(
        table=table, visit_datetime__range=(start_window, end_window)
    ).count()

    if existing_reservations >= table.quantity:
      raise serializers.ValidationError(
          'Este tipo de mesa já se encontra esgotado para o horário'
          ' selecionado.'
      )

    return data