# Generated by Django 2.1.7 on 2019-06-11 01:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_auto_20190610_2232'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='message_type',
            field=models.CharField(default=None, max_length=50),
        ),
    ]
