from django.contrib import admin

# Register your models here.
from .models import Delivery, Umpire, Match

admin.site.register(Delivery)
admin.site.register(Umpire)
admin.site.register(Match)
