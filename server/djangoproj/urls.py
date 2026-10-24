from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

from djangoapp import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("djangoapp/", include("djangoapp.urls")),
    path("about/", views.about, name="about"),
    path("contact/", views.contact, name="contact"),
    path("dealers/", views.dealers_home, name="dealers_home"),
    path("", views.home, name="home"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
