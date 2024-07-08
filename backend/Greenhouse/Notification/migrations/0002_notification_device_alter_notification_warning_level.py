# Generated by Django 5.0.6 on 2024-07-05 08:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Device", "0003_alter_greenhouse_users"),
        ("Notification", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="notification",
            name="device",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="Device.device",
            ),
        ),
        migrations.AlterField(
            model_name="notification",
            name="warning_level",
            field=models.CharField(
                choices=[("Low", "Low"), ("Good", "Good"), ("High", "High")],
                default="Low",
                max_length=10,
            ),
        ),
    ]