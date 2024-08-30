from django.core.management.base import BaseCommand
from Config.models import Crop, CropConfig

class Command(BaseCommand):
    help = 'Populates the database with initial crop parameters'

    def handle(self, *args, **options):
        crop_parameters = [
            {
                "crop": "Tomato",
                "parameters": [
                    {"parameter": "Temperature", "good_min": 25, "good_max": 35, "tolerable_min": 20, "tolerable_max": 40, "bad_min": 15, "bad_max": 20},
                    {"parameter": "Humidity", "good_min": 75, "good_max": 95, "tolerable_min": 65, "tolerable_max": 100, "bad_min": 50, "bad_max": 65},
                    {"parameter": "Soil Moisture", "good_min": 60, "good_max": 80, "tolerable_min": 50, "tolerable_max": 90, "bad_min": 0, "bad_max": 50},
                    {"parameter": "Rainfall", "good_min": 500, "good_max": 1000, "tolerable_min": 400, "tolerable_max": 1200, "bad_min": 0, "bad_max": 400},
                    {"parameter": "Light Intensity", "good_min": 1500, "good_max": 2500, "tolerable_min": 1000, "tolerable_max": 3000, "bad_min": 0, "bad_max": 1000},
                ]
            },
            {
                "crop": "Lettuce",
                "parameters": [
                    {"parameter": "Temperature", "good_min": 22, "good_max": 30, "tolerable_min": 20, "tolerable_max": 35, "bad_min": 15, "bad_max": 20},
                    {"parameter": "Humidity", "good_min": 80, "good_max": 95, "tolerable_min": 70, "tolerable_max": 100, "bad_min": 50, "bad_max": 70},
                    {"parameter": "Soil Moisture", "good_min": 70, "good_max": 85, "tolerable_min": 60, "tolerable_max": 90, "bad_min": 0, "bad_max": 60},
                    {"parameter": "Rainfall", "good_min": 400, "good_max": 800, "tolerable_min": 300, "tolerable_max": 1000, "bad_min": 0, "bad_max": 300},
                    {"parameter": "Light Intensity", "good_min": 1200, "good_max": 2000, "tolerable_min": 1000, "tolerable_max": 2500, "bad_min": 0, "bad_max": 1000},
                ]
            },
            {
                "crop": "Carrot",
                "parameters": [
                    {"parameter": "Temperature", "good_min": 22, "good_max": 30, "tolerable_min": 20, "tolerable_max": 35, "bad_min": 15, "bad_max": 20},
                    {"parameter": "Humidity", "good_min": 75, "good_max": 95, "tolerable_min": 65, "tolerable_max": 100, "bad_min": 50, "bad_max": 65},
                    {"parameter": "Soil Moisture", "good_min": 60, "good_max": 80, "tolerable_min": 50, "tolerable_max": 90, "bad_min": 0, "bad_max": 50},
                    {"parameter": "Rainfall", "good_min": 500, "good_max": 700, "tolerable_min": 400, "tolerable_max": 900, "bad_min": 0, "bad_max": 400},
                    {"parameter": "Light Intensity", "good_min": 1500, "good_max": 2000, "tolerable_min": 1000, "tolerable_max": 2500, "bad_min": 0, "bad_max": 1000},
                ]
            },
            # Add more crops and their parameters as needed
        ]

        for crop_data in crop_parameters:
            crop, created = Crop.objects.get_or_create(name=crop_data["crop"])
            for param in crop_data["parameters"]:
                CropConfig.objects.update_or_create(
                    crop=crop,
                    parameter=param["parameter"],
                    defaults={
                        'high_min': param["good_min"],
                        'high_max': param["good_max"],
                        'tolerable_min': param["tolerable_min"],
                        'tolerable_max': param["tolerable_max"],
                        'low_min': param["bad_min"],
                        'low_max': param["bad_max"],
                    }
                )

        self.stdout.write(self.style.SUCCESS('Successfully populated crop parameters'))
