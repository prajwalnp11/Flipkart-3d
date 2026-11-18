from django.db import models
from django.conf import settings
from products.models import Product, ProductVariant

class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='carts')
    session_key = models.CharField(max_length=64, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart #{self.id} ({self.user or self.session_key})"

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def subtotal(self):
        return sum(item.total_price for item in self.items.all())

    @property
    def discount(self):
        # 5% extra cart discount for demo
        return round(float(self.subtotal) * 0.05, 2) if self.subtotal > 1000 else 0.0

    @property
    def delivery_fee(self):
        return 0.0 if self.subtotal > 500 else 40.0

    @property
    def total_amount(self):
        return max(0.0, float(self.subtotal) - self.discount + self.delivery_fee)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def unit_price(self):
        base = float(self.product.price)
        if self.variant and self.variant.price_modifier:
            base += float(self.variant.price_modifier)
        return round(base, 2)

    @property
    def total_price(self):
        return round(self.unit_price * self.quantity, 2)

    def __str__(self):
        return f"{self.quantity}x {self.product.name} in Cart #{self.cart_id}"

class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='wishlists')
    session_key = models.CharField(max_length=64, blank=True, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user or self.session_key} - {self.product.name}"
