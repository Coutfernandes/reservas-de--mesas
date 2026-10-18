from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from reservations.views import ReservationViewSet, RestaurantViewSet, TableViewSet

router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet)
router.register(r'tables', TableViewSet)
router.register(r'reservations', ReservationViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]