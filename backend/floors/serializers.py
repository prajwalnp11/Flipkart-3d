from rest_framework import serializers
from .models import Floor

class FloorSerializer(serializers.ModelSerializer):
    category_count = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Floor
        fields = '__all__'

    def get_category_count(self, obj):
        return obj.categories.filter(is_active=True).count()

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()
