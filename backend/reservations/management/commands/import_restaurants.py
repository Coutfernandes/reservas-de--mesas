import csv
from django.core.management.base import BaseCommand
from reservations.models import Restaurant, Table


class Command(BaseCommand):
  help = 'Importa restaurantes e mesas do ficheiro CSV'

  def handle(self, *args, **options):
    with open('restaurants.csv', mode='r', encoding='utf-8') as file:
      reader = csv.DictReader(file)
      for row in reader:
        restaurant, _ = Restaurant.objects.get_or_create(
            name=row['restaurant_name'].strip(), zone=row['location'].strip()
        )

        Table.objects.get_or_create(
            restaurant=restaurant,
            capacity=int(row['table_size']),
            quantity=int(row['table_count']),
        )

    self.stdout.write(
        self.style.SUCCESS('Dados do CSV importados com sucesso!')
    )