from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    floor_number = serializers.ReadOnlyField(source='floor.floor_number')
    floor_name = serializers.ReadOnlyField(source='floor.name')
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()
