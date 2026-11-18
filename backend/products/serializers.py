from rest_framework import serializers
from .models import Product, ProductImage, Product3DModel, ProductVariant, ProductFeature, ProductReview

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'

class Product3DModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product3DModel
        fields = '__all__'

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = '__all__'

class ProductFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductFeature
        fields = '__all__'

class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = '__all__'

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    floor_number = serializers.ReadOnlyField(source='floor.floor_number')
    floor_name = serializers.ReadOnlyField(source='floor.name')
    primary_image = serializers.SerializerMethodField()
    model_3d_type = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'brand', 'category', 'category_name',
            'floor', 'floor_number', 'floor_name', 'price', 'original_price',
            'discount_percentage', 'rating', 'review_count', 'stock',
            'is_featured', 'showroom_slot', 'position_x', 'position_y', 'position_z',
            'primary_image', 'model_3d_type'
        )

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        return img.image_url if img else ""

    def get_model_3d_type(self, obj):
        return obj.model_3d.model_type if hasattr(obj, 'model_3d') else "generic"

class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    category_slug = serializers.ReadOnlyField(source='category.slug')
    floor_number = serializers.ReadOnlyField(source='floor.floor_number')
    floor_name = serializers.ReadOnlyField(source='floor.name')
    images = ProductImageSerializer(many=True, read_only=True)
    model_3d = Product3DModelSerializer(read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    features = ProductFeatureSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
