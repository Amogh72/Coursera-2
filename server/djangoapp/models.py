from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class CarModel(models.Model):
    class VehicleType(models.TextChoices):
        SEDAN = "SEDAN", "Sedan"
        SUV = "SUV", "SUV"
        WAGON = "WAGON", "Wagon"
        COUPE = "COUPE", "Coupe"
        HATCHBACK = "HATCHBACK", "Hatchback"
        TRUCK = "TRUCK", "Truck"
        VAN = "VAN", "Van"
        OTHER = "OTHER", "Other"

    make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name="models")
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=VehicleType.choices, default=VehicleType.SEDAN)
    year = models.IntegerField(validators=[MinValueValidator(2015), MaxValueValidator(2023)])

    class Meta:
        ordering = ["make__name", "name", "-year"]
        constraints = [
            models.UniqueConstraint(fields=["make", "name", "year"], name="unique_make_model_year")
        ]

    def __str__(self):
        return f"{self.year} {self.make.name} {self.name}"
