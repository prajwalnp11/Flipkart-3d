from django.db import models
from floors.models import Floor

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE, related_name='categories')
    icon = models.CharField(max_length=50, default='Package', help_text="Lucide icon name")
    icon_3d_type = models.CharField(max_length=50, default='generic', help_text="3D portal model type")
    display_order = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=20, default="#2874F0")
    banner_image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['floor', 'display_order', 'name']

    def __str__(self):
        return f"{self.name} (Floor {self.floor.floor_number})"
