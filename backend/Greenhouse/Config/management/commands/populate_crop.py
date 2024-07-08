
from django.core.management.base import BaseCommand
from Config.models import Crop, CropConfig

class Command(BaseCommand):
    help = 'Populates the database with initial crop parameters'

    def handle(self, *args, **options):
        crop_parameters = [
            {
                "crop": "Tomato",
                "parameters": [
                    {"parameter": "Temperature", "good_min": 18, "good_max": 25, "tolerable_min": 10, "tolerable_max": 30, "bad_min": -273, "bad_max": 10},
                    {"parameter": "Humidity", "good_min": 50, "good_max": 70, "tolerable_min": 40, "tolerable_max": 80, "bad_min": 0, "bad_max": 40},
                    {"parameter": "Soil Moisture", "good_min": 60, "good_max": 80, "tolerable_min": 50, "tolerable_max": 90, "bad_min": 0, "bad_max": 50},
                    {"parameter": "Rainfall", "good_min": 500, "good_max": 750, "tolerable_min": 400, "tolerable_max": 1000, "bad_min": 0, "bad_max": 400},
                    {"parameter": "Light Intensity", "good_min": 1500, "good_max": 2500, "tolerable_min": 1000, "tolerable_max": 3000, "bad_min": 0, "bad_max": 1000},
                ]
            },
            {
                "crop": "Lettuce",
                "parameters": [
                    {"parameter": "Temperature", "good_min": 15, "good_max": 20, "tolerable_min": 10, "tolerable_max": 25, "bad_min": -273, "bad_max": 10},
                    {"parameter": "Humidity", "good_min": 60, "good_max": 80, "tolerable_min": 50, "tolerable_max": 90, "bad_min": 0, "bad_max": 50},
                    {"parameter": "Soil Moisture", "good_min": 70, "good_max": 85, "tolerable_min": 60, "tolerable_max": 90, "bad_min": 0, "bad_max": 60},
                    {"parameter": "Rainfall", "good_min": 400, "good_max": 600, "tolerable_min": 300, "tolerable_max": 800, "bad_min": 0, "bad_max": 300},
                    {"parameter": "Light Intensity", "good_min": 1200, "good_max": 2000, "tolerable_min": 1000, "tolerable_max": 2500, "bad_min": 0, "bad_max": 1000},
                ]
            },
            {
                "crop": "Carrot",
                "parameters": [
                    {"parameter": "Temperature", "good_min": 16, "good_max": 21, "tolerable_min": 10, "tolerable_max": 25, "bad_min": -273, "bad_max": 10},
                    {"parameter": "Humidity", "good_min": 55, "good_max": 75, "tolerable_min": 45, "tolerable_max": 85, "bad_min": 0, "bad_max": 45},
                    {"parameter": "Soil Moisture", "good_min": 60, "good_max": 80, "tolerable_min": 50, "tolerable_max": 90, "bad_min": 0, "bad_max": 50},
                    {"parameter": "Rainfall", "good_min": 500, "good_max": 700, "tolerable_min": 400, "tolerable_max": 900, "bad_min": 0, "bad_max": 400},
                    {"parameter": "Light Intensity", "good_min": 1500, "good_max": 2000, "tolerable_min": 1000, "tolerable_max": 2500, "bad_min": 0, "bad_max": 1000},
                ]
            },
            # Add more crops and their parameters
        ]

        for crop_data in crop_parameters:
            crop, created = Crop.objects.get_or_create(name=crop_data["crop"])
            for param in crop_data["parameters"]:
                CropConfig.objects.get_or_create(
                    crop=crop,
                    parameter=param["parameter"],
                    good_min=param["good_min"],
                    good_max=param["good_max"],
                    tolerable_min=param["tolerable_min"],
                    tolerable_max=param["tolerable_max"],
                    bad_min=param["bad_min"],
                    bad_max=param["bad_max"]
                )

        self.stdout.write(self.style.SUCCESS('Successfully populated crop parameters'))
