from datetime import datetime, timedelta
from django.test import TestCase
from django.utils.timezone import make_aware
from .models import Restaurant, Table, Reservation
from .serializers import ReservationSerializer

class ReservationTestCase(TestCase):

    def setUp(self):
        # Configuração inicial de teste baseada nos dados do parque
        self.restaurant = Restaurant.objects.create(
            name="Rocket Diner",
            zone="Space Port"
        )
        self.table = Table.objects.create(
            restaurant=self.restaurant,
            capacity=4,
            quantity=1  # Apenas 1 mesa disponível para testar o limite rapidamente
        )
        self.visit_time = make_aware(datetime(2026, 11, 1, 19, 0, 0))

    def test_successful_reservation(self):
        """Garante que uma reserva válida passa com sucesso."""
        data = {
            "guest_name": "Matheus",
            "guest_email": "matheus@example.com",
            "restaurant": self.restaurant.id,
            "table": self.table.id,
            "visit_datetime": self.visit_time,
            "number_of_guests": 4
        }
        serializer = ReservationSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        serializer.save()
        self.assertEqual(Reservation.objects.count(), 1)

    def test_overbooking_prevention(self):
        """Garante que a segunda reserva no mesmo horário gera erro de validação (overbooking)."""
        # 1ª Reserva ocupa a única mesa
        Reservation.objects.create(
            guest_name="Primeiro Cliente",
            guest_email="cliente1@example.com",
            restaurant=self.restaurant,
            table=self.table,
            visit_datetime=self.visit_time,
            number_of_guests=4
        )

        # 2ª Tentativa de reserva no mesmo horário
        data_second = {
            "guest_name": "Segundo Cliente",
            "guest_email": "cliente2@example.com",
            "restaurant": self.restaurant.id,
            "table": self.table.id,
            "visit_datetime": self.visit_time + timedelta(minutes=30),
            "number_of_guests": 2
        }
        
        serializer = ReservationSerializer(data=data_second)
        self.assertFalse(serializer.is_valid())
        self.assertIn("esgotado", str(serializer.errors))
        self.assertEqual(Reservation.objects.count(), 1)

    def test_capacity_exceeded(self):
        """Garante que grupos maiores do que a capacidade da mesa são rejeitados."""
        data = {
            "guest_name": "Grupo Grande",
            "guest_email": "grupo@example.com",
            "restaurant": self.restaurant.id,
            "table": self.table.id,
            "visit_datetime": self.visit_time,
            "number_of_guests": 6  # Mesa é para 4 pessoas
        }
        serializer = ReservationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("excede a capacidade", str(serializer.errors))