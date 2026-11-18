from django.db import models
from django.conf import settings
from categories.models import Category
from floors.models import Floor

class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True)
    brand = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.PositiveIntegerField(default=0)
    rating = models.FloatField(default=4.5)
    review_count = models.PositiveIntegerField(default=50)
    stock = models.PositiveIntegerField(default=20)
    delivery_estimate = models.CharField(max_length=100, default="FREE Delivery by Tomorrow")
    warranty = models.CharField(max_length=150, default="1 Year Brand Warranty")
    return_policy = models.CharField(max_length=150, default="7 Days Replacement Guarantee")
    description = models.TextField()
    specifications = models.JSONField(default=dict, blank=True)
    is_featured = models.BooleanField(default=False)
    showroom_slot = models.IntegerField(default=0, help_text="Slot index on floor pedestal grid")
    position_x = models.FloatField(default=0.0)
    position_y = models.FloatField(default=0.0)
    position_z = models.FloatField(default=0.0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['floor', 'showroom_slot', 'name']

    def __str__(self):
        return f"{self.name} - ₹{self.price}"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image_url = models.CharField(max_length=500, blank=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    angle_label = models.CharField(max_length=50, default="Front")
    is_primary = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-is_primary', 'display_order']

    def __str__(self):
        return f"{self.product.name} ({self.angle_label})"

class Product3DModel(models.Model):
    MODEL_TYPES = [
        ('smartphone', 'Smartphone'),
        ('laptop', 'Laptop'),
        ('headphones', 'Headphones'),
        ('smartwatch', 'Smartwatch'),
        ('camera', 'Camera'),
        ('shoe', 'Footwear / Sneaker'),
        ('sofa', 'Furniture / Sofa'),
        ('television', 'Television / Display'),
        ('generic', 'Generic 3D Object'),
    ]

    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='model_3d')
    model_type = models.CharField(max_length=50, choices=MODEL_TYPES, default='generic')
    glb_file = models.FileField(upload_to='models_3d/', blank=True, null=True)
    glb_url = models.CharField(max_length=500, blank=True)
    scale = models.FloatField(default=1.0)
    initial_rotation_y = models.FloatField(default=0.0)
    camera_distance = models.FloatField(default=2.5)
    auto_rotate_speed = models.FloatField(default=1.0)
    color_options = models.JSONField(default=list, blank=True, help_text="List of colors [{'name': 'Titanium Blue', 'hex': '#1e3a8a'}]")
    material_config = models.JSONField(default=dict, blank=True, help_text="Roughness, metalness, clearcoat overrides")

    def __str__(self):
        return f"3D Model for {self.product.name} ({self.model_type})"

class ProductVariant(models.Model):
    VARIANT_TYPES = [
        ('Color', 'Color'),
        ('Storage', 'Storage'),
        ('Size', 'Size'),
        ('RAM', 'RAM'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    variant_type = models.CharField(max_length=20, choices=VARIANT_TYPES)
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=100, help_text="Color hex code, storage capacity, or size number")
    price_modifier = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock = models.PositiveIntegerField(default=10)

    class Meta:
        ordering = ['variant_type', 'price_modifier']

    def __str__(self):
        return f"{self.product.name} - {self.variant_type}: {self.name}"

class ProductFeature(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='features')
    name = models.CharField(max_length=100, help_text="Internal identifier, e.g. 'camera', 'display'")
    title = models.CharField(max_length=150, help_text="Display title, e.g. '48MP Pro Triple Camera System'")
    description = models.TextField()
    hotspot_position = models.JSONField(default=dict, help_text="{'x': 0.2, 'y': 0.6, 'z': 0.1}")
    icon = models.CharField(max_length=50, default='Sparkles')
    badge_text = models.CharField(max_length=50, blank=True)
    specs = models.JSONField(default=dict, blank=True, help_text="Key-value pairs for technical specs")
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'id']

    def __str__(self):
        return f"{self.product.name} Feature: {self.title}"

class ProductReview(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    author_name = models.CharField(max_length=100, default="Verified Buyer")
    rating = models.PositiveSmallIntegerField(default=5)
    title = models.CharField(max_length=200)
    comment = models.TextField()
    verified_purchase = models.BooleanField(default=True)
    helpful_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.product.name} - {self.rating}★ by {self.author_name}"
