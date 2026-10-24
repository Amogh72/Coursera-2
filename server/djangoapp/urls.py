from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from . import views

app_name = "djangoapp"

urlpatterns = [
    path("login", views.login_user, name="login"),
    path("logout", views.logout_request, name="logout"),
    path("registration", views.registration, name="registration"),
    path("get_dealers", views.get_dealerships, name="get_dealers"),
    path("get_dealers/<str:state>", views.get_dealers_by_state, name="get_dealers_by_state"),
    path("dealer/<int:dealer_id>", views.get_dealer_details, name="dealer_details"),
    path("reviews/dealer/<int:dealer_id>", views.get_dealer_reviews, name="dealer_reviews"),
    path("add_review", views.add_review, name="add_review"),
    path("get_cars", views.get_cars, name="get_cars"),
    path("get_carmakes", views.get_all_car_makes, name="get_carmakes"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
