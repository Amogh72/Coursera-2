import json
from pathlib import Path

from django.db import transaction

from .models import CarMake, CarModel


@transaction.atomic
def initiate():
    """Idempotently load the course car make/model sample data."""
    data_file = Path(__file__).resolve().parents[1] / "database" / "data" / "car_records.json"
    if not data_file.exists():
        return {"makes_created": 0, "models_created": 0, "note": "car_records.json was not found"}

    with data_file.open(encoding="utf-8") as handle:
        records = json.load(handle).get("cars", [])

    makes_created = 0
    models_created = 0
    type_map = {
        "SEDAN": CarModel.VehicleType.SEDAN,
        "SUV": CarModel.VehicleType.SUV,
        "WAGON": CarModel.VehicleType.WAGON,
        "COUPE": CarModel.VehicleType.COUPE,
        "HATCHBACK": CarModel.VehicleType.HATCHBACK,
        "TRUCK": CarModel.VehicleType.TRUCK,
        "PICKUP": CarModel.VehicleType.TRUCK,
        "VAN": CarModel.VehicleType.VAN,
        "MINIVAN": CarModel.VehicleType.VAN,
    }

    for record in records:
        make_name = str(record.get("make", "")).strip()
        model_name = str(record.get("model", "")).strip()
        try:
            year = int(record.get("year"))
        except (TypeError, ValueError):
            continue
        if not make_name or not model_name or not 2015 <= year <= 2023:
            continue

        make, created = CarMake.objects.get_or_create(
            name=make_name,
            defaults={"description": f"{make_name} vehicles"},
        )
        makes_created += int(created)
        raw_type = str(record.get("bodyType", "OTHER")).upper()
        model_type = type_map.get(raw_type, CarModel.VehicleType.OTHER)
        _, created = CarModel.objects.get_or_create(
            make=make,
            name=model_name,
            year=year,
            defaults={"type": model_type},
        )
        models_created += int(created)

    return {"makes_created": makes_created, "models_created": models_created}
