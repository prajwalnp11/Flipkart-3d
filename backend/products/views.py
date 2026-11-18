from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Product, ProductReview
from .serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    ProductReviewSerializer
)

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related('category', 'floor', 'model_3d').prefetch_related('images', 'variants', 'features', 'reviews')
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        floor = self.request.query_params.get('floor')
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        search_query = self.request.query_params.get('search')

        if floor is not None:
            qs = qs.filter(floor__floor_number=floor)
        if category:
            qs = qs.filter(category__slug=category)
        if featured:
            qs = qs.filter(is_featured=True)
        if search_query:
            qs = qs.filter(
                Q(name__icontains=search_query) |
                Q(brand__icontains=search_query) |
                Q(category__name__icontains=search_query) |
                Q(description__icontains=search_query)
            )
        return qs

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def add_review(self, request, slug=None):
        product = self.get_object()
        serializer = ProductReviewSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user if request.user.is_authenticated else None
            author_name = request.data.get('author_name', request.user.username if user else "Verified Buyer")
            serializer.save(product=product, user=user, author_name=author_name)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
