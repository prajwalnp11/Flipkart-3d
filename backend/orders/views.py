import uuid
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Order, OrderItem, Payment
from .serializers import OrderSerializer, CheckoutSerializer
from cart.views import get_or_create_cart

class CheckoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_cart(request)
        cart_items = cart.items.select_related('product', 'variant').all()

        if not cart_items.exists():
            return Response({'detail': 'Cart is empty. Add products before checkout.'}, status=status.HTTP_400_BAD_REQUEST)

        validated = serializer.validated_data

        subtotal = cart.subtotal
        discount = cart.discount
        delivery_fee = cart.delivery_fee
        total_amount = cart.total_amount

        user = request.user if request.user.is_authenticated else None

        order = Order.objects.create(
            user=user,
            full_name=validated['full_name'],
            email=validated['email'],
            phone=validated['phone'],
            shipping_address=validated['shipping_address'],
            city=validated['city'],
            state=validated['state'],
            postal_code=validated['postal_code'],
            subtotal=subtotal,
            discount_amount=discount,
            delivery_fee=delivery_fee,
            total_amount=total_amount,
            status='CONFIRMED',
            payment_method=validated['payment_method'],
            payment_status='PAID' if validated['payment_method'] != 'COD' else 'PENDING',
        )

        for item in cart_items:
            variant_desc = f"{item.variant.variant_type}: {item.variant.name}" if item.variant else ""
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                variant_info=variant_desc,
                unit_price=item.unit_price,
                quantity=item.quantity,
                total_price=item.total_price
            )
            # update stock safely
            if item.product.stock >= item.quantity:
                item.product.stock -= item.quantity
                item.product.save()

        # Create payment record
        Payment.objects.create(
            order=order,
            transaction_id=f"TXN-{uuid.uuid4().hex[:12].upper()}",
            payment_method=validated['payment_method'],
            amount=total_amount,
            status='SUCCESS' if validated['payment_method'] != 'COD' else 'PENDING',
            payload={'gateway': 'FlipkartPay Gateway Mock', 'currency': 'INR'}
        )

        # Clear cart
        cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class OrderListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            orders = Order.objects.filter(user=request.user)
        else:
            email = request.query_params.get('email')
            phone = request.query_params.get('phone')
            if email:
                orders = Order.objects.filter(email=email)
            elif phone:
                orders = Order.objects.filter(phone=phone)
            else:
                orders = Order.objects.none()
        return Response(OrderSerializer(orders, many=True).data)

class OrderDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, order_number):
        try:
            order = Order.objects.get(order_number=order_number)
            return Response(OrderSerializer(order).data)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
