import os
import json
import re
import urllib.request
import urllib.parse
from django.conf import settings
from django.utils.text import slugify
from floors.models import Floor
from categories.models import Category
from .models import Product, ProductImage, Product3DModel, ProductVariant

RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY', getattr(settings, 'RAPIDAPI_KEY', ''))
RAPIDAPI_FLIPKART_HOST = os.environ.get('RAPIDAPI_FLIPKART_HOST', 'real-time-flipkart-data.p.rapidapi.com')

# Curated high-fidelity real Flipkart products fallback catalog
# Used when RAPIDAPI_KEY is not set or network quota is exceeded
REAL_FLIPKART_CATALOG = [
    {
        "title": "Apple iPhone 16 Pro (Black Titanium, 128 GB)",
        "brand": "Apple",
        "price": 119900.0,
        "original_price": 119900.0,
        "discount_percentage": 0,
        "rating": 4.8,
        "review_count": 3410,
        "image_url": "https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/m/o/b/-original-imah4sssf55yquua.jpeg",
        "product_url": "https://www.flipkart.com/apple-iphone-16-pro-black-titanium-128-gb/p/itm...",
        "category_slug": "mobiles",
        "floor_number": 1,
        "model_3d_type": "smartphone",
        "specifications": {
            "Display": "6.3 inch Super Retina XDR OLED",
            "Processor": "A18 Pro Chip with 6-core GPU",
            "Camera": "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto",
            "Battery": "Up to 27 hours video playback",
            "Build": "Grade 5 Titanium with Ceramic Shield",
        },
        "color_options": [
            {"name": "Black Titanium", "hex": "#2B2A2C"},
            {"name": "White Titanium", "hex": "#F2F1ED"},
            {"name": "Natural Titanium", "hex": "#9E9A93"},
            {"name": "Desert Titanium", "hex": "#C2A385"}
        ]
    },
    {
        "title": "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)",
        "brand": "Samsung",
        "price": 129999.0,
        "original_price": 134999.0,
        "discount_percentage": 3,
        "rating": 4.7,
        "review_count": 5280,
        "image_url": "https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/5/t/j/-original-imagx9eg5a7hzhug.jpeg",
        "product_url": "https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itm...",
        "category_slug": "mobiles",
        "floor_number": 1,
        "model_3d_type": "smartphone",
        "specifications": {
            "Display": "6.8 inch Quad HD+ Dynamic AMOLED 2X 120Hz",
            "Processor": "Snapdragon 8 Gen 3 for Galaxy (4nm)",
            "Camera": "200MP + 50MP Periscope + 12MP Ultra-wide + 10MP Telephoto",
            "Battery": "5000 mAh with 45W Fast Charging",
            "Features": "Galaxy AI, Integrated S-Pen, Titanium Frame"
        },
        "color_options": [
            {"name": "Titanium Gray", "hex": "#6C6C70"},
            {"name": "Titanium Black", "hex": "#222224"},
            {"name": "Titanium Violet", "hex": "#4A425A"},
            {"name": "Titanium Yellow", "hex": "#D9C794"}
        ]
    },
    {
        "title": "Apple MacBook Pro 16\" M3 Max (36 GB / 1 TB SSD, Space Black)",
        "brand": "Apple",
        "price": 349900.0,
        "original_price": 349900.0,
        "discount_percentage": 0,
        "rating": 4.9,
        "review_count": 420,
        "image_url": "https://rukminim2.flixcart.com/image/832/832/xif0q/computer/m/b/n/-original-imagytwmhegyf82g.jpeg",
        "product_url": "https://www.flipkart.com/apple-macbook-pro-16-m3-max/p/itm...",
        "category_slug": "laptops",
        "floor_number": 1,
        "model_3d_type": "laptop",
        "specifications": {
            "Display": "16.2-inch Liquid Retina XDR (3456 x 2234) 120Hz",
            "Processor": "Apple M3 Max (14-core CPU, 30-core GPU)",
            "Memory": "36 GB Unified Memory",
            "Storage": "1 TB Superfast NVMe SSD",
            "Battery": "Up to 22 hours battery life"
        },
        "color_options": [
            {"name": "Space Black", "hex": "#2E2F32"},
            {"name": "Silver", "hex": "#E3E4E5"}
        ]
    },
    {
        "title": "Sony WH-1000XM5 Active Noise Cancelling Bluetooth Headphones",
        "brand": "Sony",
        "price": 26990.0,
        "original_price": 34990.0,
        "discount_percentage": 22,
        "rating": 4.6,
        "review_count": 6840,
        "image_url": "https://rukminim2.flixcart.com/image/832/832/xif0q/headphone/d/h/s/-original-imagk5vgq4t2yhqg.jpeg",
        "product_url": "https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm...",
        "category_slug": "audio",
        "floor_number": 1,
        "model_3d_type": "headphones",
        "specifications": {
            "Audio": "Custom 30mm Precision Driver with Carbon Fiber dome",
            "Noise Cancelling": "Auto NC Optimizer with Integrated Processor V1 + QN1",
            "Battery Life": "Up to 30 hours with Quick Charge (3 min = 3 hrs)",
            "Microphones": "8 Beamforming Microphones with AI Noise Reduction",
            "Connectivity": "Multipoint Bluetooth 5.2, LDAC High-Res Audio"
        },
        "color_options": [
            {"name": "Midnight Black", "hex": "#1A1A1A"},
            {"name": "Platinum Silver", "hex": "#E0DDD5"},
            {"name": "Midnight Blue", "hex": "#1E2A4A"}
        ]
    },
    {
        "title": "Nothing Phone (2a) Plus 5G (Grey, 256 GB / 12 GB RAM)",
        "brand": "Nothing",
        "price": 27999.0,
        "original_price": 31999.0,
        "discount_percentage": 12,
        "rating": 4.5,
        "review_count": 14200,
        "image_url": "https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/q/t/f/-original-imah3c99f9cbgjdf.jpeg",
        "product_url": "https://www.flipkart.com/nothing-phone-2a-plus-grey-256-gb/p/itm...",
        "category_slug": "mobiles",
        "floor_number": 1,
        "model_3d_type": "smartphone",
        "specifications": {
            "Display": "6.7 inch Flexible AMOLED 120Hz (1300 nits)",
            "Processor": "MediaTek Dimensity 7350 Pro 5G (4nm)",
            "Camera": "50MP Primary + 50MP Ultra-Wide + 50MP Front Selfie",
            "Battery": "5000 mAh with 50W Fast Charging",
            "Glyph Interface": "3-light customizable rear LED notification array"
        },
        "color_options": [
            {"name": "Metallic Grey", "hex": "#4C4D50"},
            {"name": "Black", "hex": "#1F2022"}
        ]
    },
    {
        "title": "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Case",
        "brand": "Apple",
        "price": 89900.0,
        "original_price": 89900.0,
        "discount_percentage": 0,
        "rating": 4.8,
        "review_count": 920,
        "image_url": "https://rukminim2.flixcart.com/image/832/832/xif0q/smartwatch/y/v/s/-original-imah4sssf29eapwz.jpeg",
        "product_url": "https://www.flipkart.com/apple-watch-ultra-2-gps-cellular/p/itm...",
        "category_slug": "wearables",
        "floor_number": 1,
        "model_3d_type": "smartwatch",
        "specifications": {
            "Case": "49mm Aerospace-grade Titanium with Sapphire crystal",
            "Display": "Always-On Retina display up to 3000 nits brightness",
            "Processor": "S9 SiP with 4-core Neural Engine and Double Tap gesture",
            "Sensors": "Depth gauge, water temperature, precision dual-frequency GPS",
            "Battery": "Up to 36 hours normal use / 72 hours in Low Power Mode"
        },
        "color_options": [
            {"name": "Natural Titanium", "hex": "#A8A49D"},
            {"name": "Black Titanium", "hex": "#2B2927"}
        ]
    },
    {
        "title": "Samsung 65\" Neo QLED 8K Smart TV (QN900D)",
        "brand": "Samsung",
        "price": 289990.0,
        "original_price": 419900.0,
        "discount_percentage": 30,
        "rating": 4.7,
        "review_count": 310,
        "image_url": "https://rukminim2.flixcart.com/image/832/832/xif0q/television/h/d/8/-original-imahfvg73hpgs5eh.jpeg",
        "product_url": "https://www.flipkart.com/samsung-65-neo-qled-8k-smart-tv/p/itm...",
        "category_slug": "home-appliances",
        "floor_number": 3,
        "model_3d_type": "television",
        "specifications": {
            "Display": "65-inch Real 8K Resolution (7680 x 4320) with Quantum Matrix Pro",
            "Processor": "NQ8 AI Gen3 Processor with 512 Neural Networks",
            "Audio": "90W 6.2.4 Channel with Dolby Atmos & Object Tracking Sound Pro",
            "Design": "Infinity Air Design with Ultra Slim One Connect Box"
        },
        "color_options": [
            {"name": "Titan Black", "hex": "#1F2022"}
        ]
    },
    {
        "title": "Nike Air Jordan 1 Retro High OG Sneaker",
        "brand": "Nike",
        "price": 16995.0,
        "original_price": 16995.0,
        "discount_percentage": 0,
        "rating": 4.8,
        "review_count": 2180,
        "image_url": "https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/c/o/d/-original-imah4295tfgc86gq.jpeg",
        "product_url": "https://www.flipkart.com/nike-air-jordan-1-retro-high-og/p/itm...",
        "category_slug": "fashion",
        "floor_number": 2,
        "model_3d_type": "shoe",
        "specifications": {
            "Material": "Genuine full-grain premium leather upper",
            "Cushioning": "Encapsulated Air-Sole unit in the heel",
            "Outsole": "Solid rubber cupsole with deep flex grooves",
            "Style": "Classic Chicago colorblocking with Wings logo"
        },
        "color_options": [
            {"name": "Varsity Red / Black", "hex": "#B91C1C"},
            {"name": "Royal Blue / White", "hex": "#1D4ED8"},
            {"name": "Shadow Grey", "hex": "#4B5563"}
        ]
    },
    {
        "title": "Dior Sauvage Eau de Parfum (100 ml)",
        "brand": "Dior",
        "price": 12500.0,
        "original_price": 13900.0,
        "discount_percentage": 10,
        "rating": 4.9,
        "review_count": 4890,
        "image_url": "https://rukminim2.flixcart.com/image/832/832/xif0q/perfume/m/c/u/-original-imah2y5a9n29jggf.jpeg",
        "product_url": "https://www.flipkart.com/dior-sauvage-eau-de-parfum-100-ml/p/itm...",
        "category_slug": "beauty",
        "floor_number": 2,
        "model_3d_type": "perfume",
        "specifications": {
            "Fragrance Family": "Earthy & Woody",
            "Top Notes": "Reggio Bergamot",
            "Heart Notes": "Sichuan Pepper, Lavender, Star Anise",
            "Base Notes": "Ambroxan, Papua Vanilla Absolute",
            "Volume": "100 ml / 3.4 oz"
        },
        "color_options": [
            {"name": "Deep Midnight Blue Glass", "hex": "#0F172A"}
        ]
    },
    {
        "title": "Scandinavian Minimalist 3-Seater Velvet Sofa",
        "brand": "Urban Living",
        "price": 38999.0,
        "original_price": 54999.0,
        "discount_percentage": 29,
        "rating": 4.6,
        "review_count": 870,
        "image_url": "https://rukminim2.flixcart.com/image/832/832/xif0q/sofa-sectional/g/s/o/-original-imagzk9vzzk86kph.jpeg",
        "product_url": "https://www.flipkart.com/scandinavian-velvet-3-seater-sofa/p/itm...",
        "category_slug": "furniture",
        "floor_number": 3,
        "model_3d_type": "sofa",
        "specifications": {
            "Dimensions": "84\" W x 35\" D x 32\" H",
            "Frame": "Kiln-dried solid Eucalyptus wood",
            "Fabric": "Stain-resistant performance velvet",
            "Legs": "Brushed brass tapered metal legs"
        },
        "color_options": [
            {"name": "Emerald Velvet", "hex": "#064E3B"},
            {"name": "Royal Blue", "hex": "#1E3A8A"},
            {"name": "Oatmeal Beige", "hex": "#D1C7BD"}
        ]
    }
]

def detect_model_archetype(title, category_slug=""):
    """Infer the closest 3D model archetype from product title & category."""
    t = title.lower()
    if any(k in t for k in ['iphone', 'galaxy', 'pixel', 'oneplus', 'xiaomi', 'nothing', 'phone', 'mobile', 'smartphone']):
        return 'smartphone', 'mobiles', 1
    if any(k in t for k in ['macbook', 'laptop', 'zenbook', 'thinkpad', 'strix', 'notebook', 'chromebook']):
        return 'laptop', 'laptops', 1
    if any(k in t for k in ['headphone', 'wh-1000', 'airpods max', 'headset', 'earphone', 'earbuds', 'buds']):
        return 'headphones', 'audio', 1
    if any(k in t for k in ['watch', 'smartwatch', 'band', 'apple watch', 'galaxy watch']):
        return 'smartwatch', 'wearables', 1
    if any(k in t for k in ['tv', 'television', 'oled', 'qled', 'led tv', 'bravia']):
        return 'television', 'home-appliances', 3
    if any(k in t for k in ['shoe', 'sneaker', 'jordan', 'nike', 'adidas', 'puma', 'boot']):
        return 'shoe', 'fashion', 2
    if any(k in t for k in ['sofa', 'couch', 'chair', 'table', 'bed', 'desk', 'furniture']):
        return 'sofa', 'furniture', 3
    if any(k in t for k in ['perfume', 'parfum', 'eau de', 'cologne', 'fragrance', 'dior', 'sauvage']):
        return 'perfume', 'beauty', 2
    
    # Category fallback
    if category_slug == 'mobiles':
        return 'smartphone', 'mobiles', 1
    if category_slug in ('fashion', 'beauty'):
        return 'shoe', category_slug, 2
    if category_slug in ('furniture', 'home-appliances'):
        return 'sofa', category_slug, 3
    return 'generic', category_slug or 'mobiles', 1

def search_flipkart_live(query, page=1):
    """
    Search Flipkart products via RapidAPI (or fall back to curated catalog).
    Returns list of parsed product dictionaries with 3D bindings.
    """
    cleaned_query = (query or '').strip()
    results = []

    # Attempt live RapidAPI query if key is configured
    if RAPIDAPI_KEY:
        try:
            encoded_q = urllib.parse.quote(cleaned_query)
            url = f"https://{RAPIDAPI_FLIPKART_HOST}/search?q={encoded_q}&page={page}"
            req = urllib.request.Request(
                url,
                headers={
                    "x-rapidapi-key": RAPIDAPI_KEY,
                    "x-rapidapi-host": RAPIDAPI_FLIPKART_HOST,
                    "User-Agent": "Flipkart-3D-Mall/1.0"
                }
            )
            with urllib.request.urlopen(req, timeout=5.0) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode('utf-8'))
                    raw_items = data.get('data', []) or data.get('products', []) or []
                    for item in raw_items:
                        title = item.get('title') or item.get('name') or ''
                        if not title:
                            continue
                        price = float(re.sub(r'[^\d.]', '', str(item.get('price', 0))) or 0)
                        orig_price = float(re.sub(r'[^\d.]', '', str(item.get('original_price', price))) or price)
                        disc = int(item.get('discount_percentage') or (int((1 - price/orig_price)*100) if orig_price > price else 0))
                        
                        m_type, cat_slug, floor_no = detect_model_archetype(title)
                        results.append({
                            "title": title,
                            "brand": item.get('brand') or title.split()[0],
                            "price": price,
                            "original_price": orig_price,
                            "discount_percentage": disc,
                            "rating": float(item.get('rating') or 4.5),
                            "review_count": int(item.get('review_count') or 100),
                            "image_url": item.get('thumbnail') or item.get('image') or "",
                            "product_url": item.get('url') or "",
                            "category_slug": cat_slug,
                            "floor_number": floor_no,
                            "model_3d_type": m_type,
                            "specifications": item.get('specs') or {"Category": cat_slug},
                            "color_options": [{"name": "Default Edition", "hex": "#2874F0"}],
                            "is_live_api": True
                        })
        except Exception as e:
            print(f"[FlipkartService] RapidAPI error: {e}, falling back to curated catalog")

    # If RapidAPI returned items, return them
    if results:
        return results

    # Fallback to local intelligent filter on curated real Flipkart catalog
    q_lower = cleaned_query.lower()
    if not q_lower:
        return REAL_FLIPKART_CATALOG

    matches = [
        p for p in REAL_FLIPKART_CATALOG
        if q_lower in p["title"].lower() or q_lower in p["brand"].lower() or q_lower in p["category_slug"].lower()
    ]
    return matches if matches else REAL_FLIPKART_CATALOG[:6]

def import_flipkart_product_to_mall(product_data):
    """
    Imports a real Flipkart product dictionary into the Django database,
    creates the 3D model configuration, and places it in the 3D shopping mall.
    """
    title = product_data.get('title', 'New Flipkart 3D Product')
    brand = product_data.get('brand', 'Flipkart Assured')
    price = float(product_data.get('price', 999.0))
    orig_price = float(product_data.get('original_price', price))
    disc = int(product_data.get('discount_percentage', 0))
    rating = float(product_data.get('rating', 4.5))
    reviews = int(product_data.get('review_count', 50))
    img_url = product_data.get('image_url', '')
    specs = product_data.get('specifications', {})
    cat_slug = product_data.get('category_slug', 'mobiles')
    floor_num = int(product_data.get('floor_number', 1))
    model_type = product_data.get('model_3d_type', 'smartphone')
    color_options = product_data.get('color_options', [{'name': 'Titanium', 'hex': '#2874F0'}])

    # 1. Lookup or create Floor & Category
    floor_obj, _ = Floor.objects.get_or_create(
        floor_number=floor_num,
        defaults={'name': f'Floor {floor_num}', 'short_title': f'{floor_num}F'}
    )
    cat_obj, _ = Category.objects.get_or_create(
        slug=cat_slug,
        defaults={'name': cat_slug.capitalize(), 'floor': floor_obj}
    )

    # 2. Unique slug
    base_slug = slugify(title)[:260] or 'flipkart-item'
    slug = base_slug
    counter = 1
    while Product.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1

    # Find next open showroom slot on this floor
    highest_slot = Product.objects.filter(floor=floor_obj).count()

    # 3. Create Product
    product = Product.objects.create(
        name=title,
        slug=slug,
        brand=brand,
        category=cat_obj,
        floor=floor_obj,
        price=price,
        original_price=orig_price,
        discount_percentage=disc,
        rating=rating,
        review_count=reviews,
        stock=25,
        delivery_estimate="FREE Delivery by Tomorrow",
        warranty="1 Year Flipkart Warranty",
        return_policy="7 Days Replacement Guarantee",
        description=f"Authentic {brand} product from Flipkart. Includes standard warranty and Flipkart Assured guarantee.",
        specifications=specs,
        is_featured=True,
        showroom_slot=highest_slot,
        position_x=-4.0 + (highest_slot % 4) * 2.8,
        position_y=1.1,
        position_z=-1.5 if highest_slot < 4 else 3.5
    )

    # 4. Create ProductImage
    if img_url:
        ProductImage.objects.create(
            product=product,
            image_url=img_url,
            angle_label="Primary Flipkart View",
            is_primary=True,
            display_order=0
        )

    # 5. Create 3D Model Attachment
    scale_map = {
        'smartphone': 1.0,
        'laptop': 1.1,
        'headphones': 1.05,
        'smartwatch': 0.85,
        'television': 1.4,
        'shoe': 0.95,
        'sofa': 1.2,
        'perfume': 0.8,
        'generic': 1.0
    }
    Product3DModel.objects.create(
        product=product,
        model_type=model_type,
        scale=scale_map.get(model_type, 1.0),
        camera_distance=2.4 if model_type in ('smartphone', 'smartwatch', 'perfume') else 3.2,
        auto_rotate_speed=0.8,
        color_options=color_options
    )

    # 6. Add Color Variants
    for col in color_options:
        ProductVariant.objects.create(
            product=product,
            variant_type='Color',
            name=col.get('name', 'Standard'),
            value=col.get('hex', '#2874F0'),
            price_modifier=0
        )

    return product
