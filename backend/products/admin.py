from django.contrib import admin
from .models import Product, ProductImage, Product3DModel, ProductVariant, ProductFeature, ProductReview

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class Product3DModelInline(admin.StackedInline):
    model = Product3DModel
    can_delete = False

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1

class ProductFeatureInline(admin.StackedInline):
    model = ProductFeature
    extra = 1

class ProductReviewInline(admin.TabularInline):
    model = ProductReview
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'floor', 'price', 'original_price', 'stock', 'rating', 'is_featured', 'is_active')
    list_filter = ('floor', 'category', 'brand', 'is_featured', 'is_active')
    search_fields = ('name', 'brand', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('price', 'stock', 'is_featured', 'is_active')
    inlines = [Product3DModelInline, ProductImageInline, ProductVariantInline, ProductFeatureInline, ProductReviewInline]

@admin.register(Product3DModel)
class Product3DModelAdmin(admin.ModelAdmin):
    list_display = ('product', 'model_type', 'scale', 'initial_rotation_y', 'camera_distance')

@admin.register(ProductFeature)
class ProductFeatureAdmin(admin.ModelAdmin):
    list_display = ('product', 'name', 'title', 'icon', 'display_order')
    list_filter = ('product__category', 'product')

@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'author_name', 'rating', 'title', 'verified_purchase', 'created_at')
    list_filter = ('rating', 'verified_purchase')
