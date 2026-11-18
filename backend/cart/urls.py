from django.urls import path
from .views import (
    CartDetailView,
    CartItemAddView,
    CartItemUpdateView,
    CartClearView,
    WishlistView
)

urlpatterns = [
    path('', CartDetailView.as_view(), name='cart_detail'),
    path('items/add/', CartItemAddView.as_view(), name='cart_item_add'),
    path('items/<int:item_id>/', CartItemUpdateView.as_view(), name='cart_item_update'),
    path('clear/', CartClearView.as_view(), name='cart_clear'),
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
]
