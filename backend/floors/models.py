from django.db import models

class Floor(models.Model):
    floor_number = models.IntegerField(unique=True, help_text="0=Ground, 1=First Floor, 2=Second Floor, 3=Third Floor")
    name = models.CharField(max_length=150)
    short_title = models.CharField(max_length=50)
    subtitle = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    theme_color = models.CharField(max_length=20, default="#2874F0")
    ambient_sound = models.CharField(max_length=100, default="mall_ambient", blank=True)
    camera_position = models.JSONField(default=dict, blank=True, help_text="e.g. {'x': 0, 'y': 2, 'z': 8}")
    camera_target = models.JSONField(default=dict, blank=True, help_text="e.g. {'x': 0, 'y': 1, 'z': 0}")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['floor_number']

    def __str__(self):
        return f"Floor {self.floor_number}: {self.name}"
