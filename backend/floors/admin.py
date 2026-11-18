from django.contrib import admin
from .models import Floor

@admin.register(Floor)
class FloorAdmin(admin.ModelAdmin):
    list_display = ('floor_number', 'name', 'short_title', 'theme_color', 'is_active')
    list_editable = ('is_active',)
