from rest_framework import viewsets, permissions
from .models import Floor
from .serializers import FloorSerializer

class FloorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Floor.objects.filter(is_active=True).order_by('floor_number')
    serializer_class = FloorSerializer
    permission_classes = [permissions.AllowAny]
