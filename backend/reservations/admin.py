from django.contrib import admin
from .models import Restaurant, Table, Reservation

# Registre seus modelos aqui para que apareçam no Django Admin
admin.site.register(Restaurant)
admin.site.register(Table)
admin.site.register(Reservation)