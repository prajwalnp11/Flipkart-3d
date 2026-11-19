import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User, Address
from floors.models import Floor
from categories.models import Category
from products.models import Product, ProductImage, Product3DModel, ProductVariant, ProductFeature, ProductReview

def seed():
    print("Seeding Flipkart 3D Virtual Mall database...")

    # 1. Superuser & Demo User
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser('admin', 'admin@flipkart3d.local', 'admin123')
        admin.phone_number = "+91 98765 43210"
        admin.save()
        print("Created superuser: admin / admin123")

    demo_user, _ = User.objects.get_or_create(
        username='shopper',
        defaults={
            'email': 'shopper@flipkart3d.local',
            'first_name': 'Aarav',
            'last_name': 'Sharma',
            'phone_number': '+91 99887 76655'
        }
    )
    demo_user.set_password('shopper123')
    demo_user.save()

    Address.objects.get_or_create(
        user=demo_user,
        defaults={
            'full_name': 'Aarav Sharma',
            'street': 'Flat 402, Skyline Towers, Koramangala 4th Block',
            'city': 'Bengaluru',
            'state': 'Karnataka',
            'postal_code': '560034',
            'country': 'India',
            'phone': '+91 99887 76655',
            'is_default': True,
            'address_type': 'Home'
        }
    )

    # 2. Floors
    floors_data = [
        {
            'floor_number': 0,
            'name': 'Ground Floor – Grand Atrium & Lobby',
            'short_title': 'LOBBY',
            'subtitle': 'Category Gateways, Concierge & High-Speed Elevators',
            'description': 'The magnificent central hub of Flipkart 3D Mall with expansive marble floors, interactive portals, and seamless floor navigation.',
            'theme_color': '#2874F0',
            'camera_position': {'x': 0, 'y': 2.8, 'z': 12},
            'camera_target': {'x': 0, 'y': 1.2, 'z': 0}
        },
        {
            'floor_number': 1,
            'name': 'First Floor – Mobiles & Electronics',
            'short_title': 'ELECTRONICS',
            'subtitle': 'Flagship Smartphones, Pro Laptops & High-Fidelity Audio',
            'description': 'Step into the futuristic tech pavilion featuring floating glass pedestals, metallic architecture, and tactile 3D product previews.',
            'theme_color': '#0284C7',
            'camera_position': {'x': 0, 'y': 2.5, 'z': 10},
            'camera_target': {'x': 0, 'y': 1.2, 'z': 0}
        },
        {
            'floor_number': 2,
            'name': 'Second Floor – Fashion & Lifestyle',
            'short_title': 'FASHION',
            'subtitle': 'Haute Couture, Sneaker Vault & Designer Accessories',
            'description': 'An elegant boutique gallery with mood lighting, runway podiums, and multi-angle 3D apparel and footwear displays.',
            'theme_color': '#D946EF',
            'camera_position': {'x': 0, 'y': 2.5, 'z': 10},
            'camera_target': {'x': 0, 'y': 1.2, 'z': 0}
        },
        {
            'floor_number': 3,
            'name': 'Third Floor – Home & Living',
            'short_title': 'HOME & LIVING',
            'subtitle': 'Smart Living, Contemporary Furniture & Kitchen Innovations',
            'description': 'A luxury penthouse showroom showcasing designer sofas, cinema displays, and modern smart appliances in real-world scale.',
            'theme_color': '#10B981',
            'camera_position': {'x': 0, 'y': 2.5, 'z': 10},
            'camera_target': {'x': 0, 'y': 1.2, 'z': 0}
        }
    ]

    floors = {}
    for f in floors_data:
        floor_obj, _ = Floor.objects.update_or_create(floor_number=f['floor_number'], defaults=f)
        floors[f['floor_number']] = floor_obj
    print(f"Seeded {len(floors)} floors.")

    # 3. Categories
    categories_data = [
        # Floor 1
        {
            'name': 'Mobiles & Smartphones',
            'slug': 'mobiles',
            'description': 'Explore flagship smartphones with aerospace titanium builds and cinematic triple-lens optics.',
            'floor': floors[1],
            'icon': 'Smartphone',
            'icon_3d_type': 'smartphone',
            'display_order': 1,
            'color': '#2874F0'
        },
        {
            'name': 'Laptops & Computers',
            'slug': 'laptops-computers',
            'description': 'Unleash powerhouse silicon chips, Liquid Retina displays, and ultra-slim CNC aluminium bodies.',
            'floor': floors[1],
            'icon': 'Laptop',
            'icon_3d_type': 'laptop',
            'display_order': 2,
            'color': '#0284C7'
        },
        {
            'name': 'Electronics & Audio',
            'slug': 'electronics',
            'description': 'Studio-grade spatial acoustic headphones, active noise cancellation, and titanium drivers.',
            'floor': floors[1],
            'icon': 'Headphones',
            'icon_3d_type': 'headphones',
            'display_order': 3,
            'color': '#3B82F6'
        },
        {
            'name': 'Smartwatches & Wearables',
            'slug': 'wearables',
            'description': 'Precision titanium cases, Sapphire crystal glass, and continuous biometric telemetry.',
            'floor': floors[1],
            'icon': 'Watch',
            'icon_3d_type': 'smartwatch',
            'display_order': 4,
            'color': '#6366F1'
        },

        # Floor 2
        {
            'name': 'Fashion & Apparel',
            'slug': 'fashion',
            'description': 'Curated luxury streetwear, breathable tech fabrics, and timeless tailored silhouettes.',
            'floor': floors[2],
            'icon': 'Shirt',
            'icon_3d_type': 'fashion',
            'display_order': 1,
            'color': '#EC4899'
        },
        {
            'name': 'Shoes & Sneakers',
            'slug': 'shoes',
            'description': 'High-performance reactive foam soles, responsive knit uppers, and iconic street styles.',
            'floor': floors[2],
            'icon': 'Footprints',
            'icon_3d_type': 'shoe',
            'display_order': 2,
            'color': '#D946EF'
        },
        {
            'name': 'Beauty & Personal Care',
            'slug': 'beauty',
            'description': 'Dermatologically advanced skin essentials, ultrasonic stylers, and luxury fragrances.',
            'floor': floors[2],
            'icon': 'Sparkles',
            'icon_3d_type': 'beauty',
            'display_order': 3,
            'color': '#F43F5E'
        },
        {
            'name': 'Luxury Accessories',
            'slug': 'accessories',
            'description': 'Handcrafted leather goods, polarized eyewear, and minimalist stainless chronographs.',
            'floor': floors[2],
            'icon': 'Glasses',
            'icon_3d_type': 'accessories',
            'display_order': 4,
            'color': '#A855F7'
        },

        # Floor 3
        {
            'name': 'Furniture & Living',
            'slug': 'furniture',
            'description': 'Architectural velvet loungers, ergonomic walnut tables, and minimalist Scandinavian decor.',
            'floor': floors[3],
            'icon': 'Armchair',
            'icon_3d_type': 'sofa',
            'display_order': 1,
            'color': '#10B981'
        },
        {
            'name': 'Home Appliances & TVs',
            'slug': 'home-appliances',
            'description': 'Quantum Dot 8K cinema panels, intelligent dual-inverter cooling, and automated living.',
            'floor': floors[3],
            'icon': 'Tv',
            'icon_3d_type': 'television',
            'display_order': 2,
            'color': '#059669'
        }
    ]

    categories = {}
    for c in categories_data:
        cat_obj, _ = Category.objects.update_or_create(slug=c['slug'], defaults=c)
        categories[c['slug']] = cat_obj
    print(f"Seeded {len(categories)} categories.")

    # 4. Detailed 3D Products
    products_catalog = [
        # Product 1: iPhone 16 Pro Max
        {
            'name': 'Apple iPhone 16 Pro Max',
            'slug': 'iphone-16-pro-max',
            'brand': 'Apple',
            'category': categories['mobiles'],
            'floor': floors[1],
            'price': 144900.00,
            'original_price': 159900.00,
            'discount_percentage': 9,
            'rating': 4.9,
            'review_count': 1840,
            'stock': 45,
            'is_featured': True,
            'showroom_slot': 0,
            'position_x': -4.5,
            'position_y': 1.1,
            'position_z': -1.5,
            'description': 'Forged in grade 5 titanium. Powered by the groundbreaking A18 Pro chip. Features the versatile Camera Control button and the longest battery life ever in an iPhone.',
            'specifications': {
                'Display': '6.9-inch Super Retina XDR OLED with ProMotion 120Hz',
                'Processor': 'A18 Pro chip with 6-core GPU & Hardware Ray Tracing',
                'Camera': '48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto',
                'Battery': 'Up to 33 hours video playback, Qi2 & MagSafe wireless charging',
                'Build': 'Grade 5 Titanium frame with textured matte glass back',
                'Connectivity': 'USB-C (USB 3 up to 10Gb/s), Wi-Fi 7, 5G NR'
            },
            'model_3d': {
                'model_type': 'smartphone',
                'scale': 1.0,
                'camera_distance': 2.4,
                'auto_rotate_speed': 0.8,
                'color_options': [
                    {'name': 'Desert Titanium', 'hex': '#C2A385'},
                    {'name': 'Natural Titanium', 'hex': '#9E9A93'},
                    {'name': 'White Titanium', 'hex': '#E8E7E3'},
                    {'name': 'Black Titanium', 'hex': '#3C3B37'}
                ]
            },
            'variants': [
                {'variant_type': 'Color', 'name': 'Desert Titanium', 'value': '#C2A385', 'price_modifier': 0},
                {'variant_type': 'Color', 'name': 'Natural Titanium', 'value': '#9E9A93', 'price_modifier': 0},
                {'variant_type': 'Color', 'name': 'Black Titanium', 'value': '#3C3B37', 'price_modifier': 0},
                {'variant_type': 'Storage', 'name': '256 GB', 'value': '256GB', 'price_modifier': 0},
                {'variant_type': 'Storage', 'name': '512 GB', 'value': '512GB', 'price_modifier': 20000},
                {'variant_type': 'Storage', 'name': '1 TB', 'value': '1TB', 'price_modifier': 40000},
            ],
            'features': [
                {
                    'name': 'camera',
                    'title': '48MP Pro Fusion Camera System',
                    'description': 'Second-generation sensor-shift optical image stabilisation with 4K 120 fps Dolby Vision recording for cinematic precision.',
                    'hotspot_position': {'x': -0.32, 'y': 0.58, 'z': 0.12},
                    'icon': 'Camera',
                    'badge_text': '4K 120 FPS',
                    'specs': {'Sensor': '48MP Quad-Pixel', 'Zoom': '5x Optical Periscope', 'Aperture': 'f/1.78'}
                },
                {
                    'name': 'display',
                    'title': '6.9" Super Retina XDR Display',
                    'description': 'Edge-to-edge borderless OLED display with ProMotion 120Hz refresh rate, Always-On technology, and 2000 nits outdoor peak brightness.',
                    'hotspot_position': {'x': 0.0, 'y': 0.1, 'z': 0.15},
                    'icon': 'Tv',
                    'badge_text': '2000 NITS',
                    'specs': {'Resolution': '2868 x 1320', 'Refresh Rate': '1-120Hz', 'Glass': 'Ceramic Shield 2'}
                },
                {
                    'name': 'processor',
                    'title': 'A18 Pro Silicon with Neural Engine',
                    'description': 'Built on 2nd generation 3-nanometer architecture with a 16-core Neural Engine delivering desktop-grade graphics and AI processing.',
                    'hotspot_position': {'x': 0.0, 'y': -0.1, 'z': -0.05},
                    'icon': 'Cpu',
                    'badge_text': '3nm ARCH',
                    'specs': {'CPU': '6-Core (2 Performance + 4 Efficiency)', 'GPU': '6-Core with Ray Tracing'}
                },
                {
                    'name': 'battery',
                    'title': 'High-Density All-Day Battery',
                    'description': 'Optimised internal architecture with 100% recycled cobalt cells, enabling up to 33 hours continuous playback and 50% charge in 30 mins.',
                    'hotspot_position': {'x': 0.0, 'y': -0.4, 'z': -0.1},
                    'icon': 'BatteryCharging',
                    'badge_text': '33 HOURS',
                    'specs': {'Fast Charging': '30W MagSafe / USB-PD', 'Capacity': '4685 mAh'}
                },
                {
                    'name': 'build',
                    'title': 'Aerospace Grade 5 Titanium Body',
                    'description': 'Forged with aerospace-grade 5 titanium alloy frame, micro-blasted matte glass back, and IP68 water resistance.',
                    'hotspot_position': {'x': 0.42, 'y': 0.0, 'z': 0.0},
                    'icon': 'ShieldCheck',
                    'badge_text': 'GRADE 5 TITANIUM',
                    'specs': {'Weight': '227 grams', 'Water Resistance': 'IP68 (6m depth)'}
                },
                {
                    'name': 'speakers',
                    'title': 'Studio-Grade Stereo Acoustic Speakers',
                    'description': 'Custom dual speakers delivering immersive Spatial Audio with Dolby Atmos and rich bass response.',
                    'hotspot_position': {'x': 0.22, 'y': -0.75, 'z': 0.05},
                    'icon': 'Volume2',
                    'badge_text': 'SPATIAL AUDIO',
                    'specs': {'Acoustics': 'Stereo Speakers', 'Dolby': 'Dolby Atmos'}
                },
                {
                    'name': 'charging_port',
                    'title': 'USB-C 10Gb/s High-Speed Connector',
                    'description': 'Universal USB 3 controller supporting up to 10Gb/s data transfer, DisplayPort 4K video out, and fast charging.',
                    'hotspot_position': {'x': 0.0, 'y': -0.78, 'z': 0.0},
                    'icon': 'Zap',
                    'badge_text': '10GB/S USB 3',
                    'specs': {'Speed': 'Up to 10Gb/s', 'Video': 'DisplayPort Out'}
                }
            ],
            'reviews': [
                {
                    'author_name': 'Rohan Deshmukh',
                    'rating': 5,
                    'title': 'The Desert Titanium finish is stunning!',
                    'comment': 'The camera shutter button and 5x optical zoom take mobile photography to a whole new tier. 3D inspection in this mall convinced me!'
                },
                {
                    'author_name': 'Pooja Nair',
                    'rating': 5,
                    'title': 'Unbelievable battery endurance',
                    'comment': 'Easily lasts 1.5 days on heavy 5G usage. Fluid display and ultra-fast app switching.'
                }
            ]
        },

        # Product 2: MacBook Pro 16" M4 Max
        {
            'name': 'Apple MacBook Pro 16" (M4 Max)',
            'slug': 'macbook-pro-16-m4-max',
            'brand': 'Apple',
            'category': categories['laptops-computers'],
            'floor': floors[1],
            'price': 349900.00,
            'original_price': 379900.00,
            'discount_percentage': 8,
            'rating': 4.95,
            'review_count': 640,
            'stock': 18,
            'is_featured': True,
            'showroom_slot': 1,
            'position_x': -1.5,
            'position_y': 1.1,
            'position_z': -2.5,
            'description': 'Engineered for monumental performance. M4 Max features up to 16 CPU cores, 40 GPU cores, and 128GB unified memory for uncompromising 3D rendering and machine learning.',
            'specifications': {
                'Chip': 'Apple M4 Max with 16-core CPU, 40-core GPU',
                'Display': '16.2-inch Liquid Retina XDR (3456 x 2234) 1600 nits HDR',
                'Memory': '64GB Unified Memory (configurable to 128GB)',
                'Storage': '1TB Ultra-fast NVMe SSD',
                'Audio': 'Six-speaker sound system with force-cancelling woofers',
                'Ports': '3x Thunderbolt 5, HDMI 2.1, SDXC card slot, MagSafe 3'
            },
            'model_3d': {
                'model_type': 'laptop',
                'scale': 1.1,
                'camera_distance': 2.8,
                'auto_rotate_speed': 0.6,
                'color_options': [
                    {'name': 'Space Black', 'hex': '#1C1D1F'},
                    {'name': 'Silver', 'hex': '#E3E4E5'}
                ]
            },
            'variants': [
                {'variant_type': 'Color', 'name': 'Space Black', 'value': '#1C1D1F', 'price_modifier': 0},
                {'variant_type': 'Color', 'name': 'Silver', 'value': '#E3E4E5', 'price_modifier': 0},
                {'variant_type': 'RAM', 'name': '64 GB', 'value': '64GB', 'price_modifier': 0},
                {'variant_type': 'RAM', 'name': '128 GB', 'value': '128GB', 'price_modifier': 60000},
                {'variant_type': 'Storage', 'name': '1 TB SSD', 'value': '1TB', 'price_modifier': 0},
                {'variant_type': 'Storage', 'name': '2 TB SSD', 'value': '2TB', 'price_modifier': 40000},
            ],
            'features': [
                {
                    'name': 'screen',
                    'title': 'Liquid Retina XDR Mini-LED Screen',
                    'description': '10,000 Mini-LED local dimming zones delivering 1,000,000:1 contrast ratio and nano-texture anti-glare glass.',
                    'hotspot_position': {'x': 0.0, 'y': 0.65, 'z': -0.4},
                    'icon': 'Monitor',
                    'badge_text': '1600 NITS HDR',
                    'specs': {'Resolution': '3456 x 2234', 'Color': 'DCI-P3 Wide Gamut'}
                },
                {
                    'name': 'processor',
                    'title': 'M4 Max Silicon Supercomputer',
                    'description': 'Over 500 GB/s memory bandwidth for running 100B+ parameter AI models locally with zero throttling.',
                    'hotspot_position': {'x': 0.0, 'y': 0.05, 'z': 0.2},
                    'icon': 'Cpu',
                    'badge_text': '546 GB/s',
                    'specs': {'CPU Cores': '16 (12 Perf + 4 Eff)', 'GPU Cores': '40'}
                },
                {
                    'name': 'keyboard',
                    'title': 'Magic Keyboard with Touch ID',
                    'description': 'Full-height function key row and laser-etched black anodised aluminum keycap chassis.',
                    'hotspot_position': {'x': 0.0, 'y': 0.08, 'z': 0.35},
                    'icon': 'Sliders',
                    'badge_text': 'SCISSOR SWITCH',
                    'specs': {'Travel': '1mm tactile', 'Trackpad': 'Force Touch Haptic'}
                }
            ],
            'reviews': [
                {
                    'author_name': 'Karan Gupta',
                    'rating': 5,
                    'title': 'Monstrous rendering speeds',
                    'comment': 'Blender and Unreal Engine builds fly on this machine. Space Black looks gorgeous in person.'
                }
            ]
        },

        # Product 3: Sony WH-1000XM5 Studio Headphones
        {
            'name': 'Sony WH-1000XM5 Flagship Headphones',
            'slug': 'sony-wh-1000xm5',
            'brand': 'Sony',
            'category': categories['electronics'],
            'floor': floors[1],
            'price': 26990.00,
            'original_price': 34990.00,
            'discount_percentage': 23,
            'rating': 4.8,
            'review_count': 3290,
            'stock': 80,
            'is_featured': True,
            'showroom_slot': 2,
            'position_x': 1.5,
            'position_y': 1.1,
            'position_z': -2.5,
            'description': 'Industry-leading noise cancellation powered by two processors and eight microphones. Carbon fibre dome drivers deliver breathtaking High-Resolution Audio.',
            'specifications': {
                'Driver Unit': '30mm precision-engineered Carbon Fibre composite',
                'Processors': 'HD Noise Cancelling Processor QN1 + Integrated Processor V1',
                'Battery Life': '30 hours with ANC ON (3 min quick charge for 3 hours)',
                'Codecs': 'LDAC, AAC, SBC, High-Resolution Wireless Audio',
                'Weight': '250g ultra-lightweight soft fit synthetic leather'
            },
            'model_3d': {
                'model_type': 'headphones',
                'scale': 1.15,
                'camera_distance': 2.3,
                'auto_rotate_speed': 0.9,
                'color_options': [
                    {'name': 'Midnight Blue', 'hex': '#1B263B'},
                    {'name': 'Silver Platinum', 'hex': '#D4D4D8'},
                    {'name': 'Matte Black', 'hex': '#18181B'}
                ]
            },
            'variants': [
                {'variant_type': 'Color', 'name': 'Midnight Blue', 'value': '#1B263B', 'price_modifier': 0},
                {'variant_type': 'Color', 'name': 'Silver Platinum', 'value': '#D4D4D8', 'price_modifier': 0},
                {'variant_type': 'Color', 'name': 'Matte Black', 'value': '#18181B', 'price_modifier': 0},
            ],
            'features': [
                {
                    'name': 'anc',
                    'title': 'Dual-Processor Active Noise Cancelling',
                    'description': 'Auto NC Optimizer adjusts acoustic suppression in real time based on atmospheric pressure and wearing condition.',
                    'hotspot_position': {'x': 0.45, 'y': 0.0, 'z': 0.0},
                    'icon': 'Volume2',
                    'badge_text': '8 MICROPHONES',
                    'specs': {'Microphones': '8 Beamforming Mics', 'Algorithms': 'AI DNN Voice Pickup'}
                },
                {
                    'name': 'driver',
                    'title': '30mm Carbon Fibre Composite Driver',
                    'description': 'Ultra-rigid dome with high compliance TPU edge produces crystal clear highs up to 40kHz.',
                    'hotspot_position': {'x': -0.45, 'y': 0.0, 'z': 0.0},
                    'icon': 'Zap',
                    'badge_text': 'CARBON FIBRE',
                    'specs': {'Frequency Response': '4Hz - 40,000Hz', 'Impedance': '48 Ohms'}
                }
            ],
            'reviews': [
                {
                    'author_name': 'Vikram Seth',
                    'rating': 5,
                    'title': 'Absolute silence on flights',
                    'comment': 'Comfortable for 8-hour sessions. LDAC audio streaming with FLAC files is mind-blowing.'
                }
            ]
        },

        # Product 4: Apple Watch Ultra 2
        {
            'name': 'Apple Watch Ultra 2 Titanium',
            'slug': 'apple-watch-ultra-2',
            'brand': 'Apple',
            'category': categories['wearables'],
            'floor': floors[1],
            'price': 89900.00,
            'original_price': 89900.00,
            'discount_percentage': 0,
            'rating': 4.9,
            'review_count': 510,
            'stock': 30,
            'is_featured': True,
            'showroom_slot': 3,
            'position_x': 4.5,
            'position_y': 1.1,
            'position_z': -1.5,
            'description': 'The most capable and rugged Apple Watch. Built with 49mm corrosion-resistant aerospace titanium, brightest 3000-nit display, and dual-frequency GPS.',
            'specifications': {
                'Case': '49mm Aerospace-grade Titanium with raised bezel',
                'Display': '3000 nits Always-On Retina display with Sapphire glass',
                'Water Resistance': '100m water resistant, EN13319 dive computer certified',
                'Battery': 'Up to 36 hours normal use (72 hours Low Power Mode)',
                'Sensors': 'Depth gauge, water temperature, ECG, blood oxygen, dual sirens'
            },
            'model_3d': {
                'model_type': 'smartwatch',
                'scale': 1.25,
                'camera_distance': 2.0,
                'auto_rotate_speed': 0.7,
                'color_options': [
                    {'name': 'Natural Titanium', 'hex': '#B5AEA4'},
                    {'name': 'Black Titanium', 'hex': '#27272A'}
                ]
            },
            'variants': [
                {'variant_type': 'Color', 'name': 'Natural Titanium', 'value': '#B5AEA4', 'price_modifier': 0},
                {'variant_type': 'Color', 'name': 'Black Titanium', 'value': '#27272A', 'price_modifier': 0},
                {'variant_type': 'Size', 'name': 'Ocean Band', 'value': 'Ocean', 'price_modifier': 0},
                {'variant_type': 'Size', 'name': 'Trail Loop', 'value': 'Trail', 'price_modifier': 0},
            ],
            'features': [
                {
                    'name': 'case',
                    'title': '49mm Titanium Armour & Action Button',
                    'description': 'Customisable international orange Action Button lets you start workouts, set waypoints, or trigger the 86dB emergency siren.',
                    'hotspot_position': {'x': -0.35, 'y': 0.1, 'z': 0.0},
                    'icon': 'Shield',
                    'badge_text': 'MIL-STD 810H',
                    'specs': {'Material': 'Aerospace Titanium', 'Button': 'Tactile Action Button'}
                },
                {
                    'name': 'screen',
                    'title': '3000 Nits Sapphire Crystal Screen',
                    'description': 'Ultra-bright sunlight readability with Night Mode that turns the interface vibrant red automatically in the dark.',
                    'hotspot_position': {'x': 0.0, 'y': 0.15, 'z': 0.1},
                    'icon': 'Sun',
                    'badge_text': '3000 NITS',
                    'specs': {'Glass': 'Flat Sapphire Crystal', 'Pixels': '410 x 502'}
                }
            ],
            'reviews': [
                {
                    'author_name': 'Sameer Joshi',
                    'rating': 5,
                    'title': 'Indestructible watch',
                    'comment': 'Took it scuba diving and high altitude trekking. Flawless tracking and incredible battery.'
                }
            ]
        },

        # Product 5 (Floor 2): Nike Air Max 270 React Vault
        {
            'name': 'Nike Air Max 270 React Tech Vault',
            'slug': 'nike-air-max-270-react',
            'brand': 'Nike',
            'category': categories['shoes'],
            'floor': floors[2],
            'price': 13995.00,
            'original_price': 15995.00,
            'discount_percentage': 12,
            'rating': 4.75,
            'review_count': 1120,
            'stock': 60,
            'is_featured': True,
            'showroom_slot': 0,
            'position_x': -3.5,
            'position_y': 1.1,
            'position_z': -1.8,
            'description': 'Iconic lifestyle sneaker combining Nike highest 270 Max Air unit with resilient Nike React foam cushioning for surreal bounce.',
            'specifications': {
                'Midsole': '270 Max Air heel unit + full-length Nike React foam',
                'Upper': 'Lightweight layered no-sew breathable synthetic textile',
                'Outsole': 'Durable full rubber coverage for multi-surface traction',
                'Weight': '310 grams per shoe'
            },
            'model_3d': {
                'model_type': 'shoe',
                'scale': 1.1,
                'camera_distance': 2.4,
                'auto_rotate_speed': 0.9,
                'color_options': [
                    {'name': 'Laser Blue / White', 'hex': '#0090FF'},
                    {'name': 'Triple Black', 'hex': '#111827'},
                    {'name': 'Solar Crimson', 'hex': '#FF2D55'}
                ]
            },
            'variants': [
                {'variant_type': 'Color', 'name': 'Laser Blue / White', 'value': '#0090FF', 'price_modifier': 0},
                {'variant_type': 'Color', 'name': 'Triple Black', 'value': '#111827', 'price_modifier': 0},
                {'variant_type': 'Size', 'name': 'UK 8', 'value': '8', 'price_modifier': 0},
                {'variant_type': 'Size', 'name': 'UK 9', 'value': '9', 'price_modifier': 0},
                {'variant_type': 'Size', 'name': 'UK 10', 'value': '10', 'price_modifier': 0},
            ],
            'features': [
                {
                    'name': 'air_unit',
                    'title': '270-Degree Max Air Heel Bubble',
                    'description': '32mm tall pressurized air chamber providing unmatched shock absorption and all-day energy return.',
                    'hotspot_position': {'x': -0.4, 'y': -0.1, 'z': 0.0},
                    'icon': 'Activity',
                    'badge_text': '32mm AIR',
                    'specs': {'Height': '32mm cushion', 'Technology': 'Dual-Pressure Air'}
                },
                {
                    'name': 'foam',
                    'title': 'Nike React Resilient Foam Sole',
                    'description': 'Springy yet durable foam layer ensures seamless heel-to-toe transitions with zero fatigue.',
                    'hotspot_position': {'x': 0.2, 'y': -0.2, 'z': 0.0},
                    'icon': 'Feather',
                    'badge_text': 'REACT FOAM',
                    'specs': {'Material': 'Thermoplastic Elastomer', 'Flexibility': 'High Response'}
                }
            ],
            'reviews': [
                {
                    'author_name': 'Divya Pillai',
                    'rating': 5,
                    'title': 'Like walking on clouds',
                    'comment': 'The 3D model allowed me to check the air bubble and stitching in extreme detail before ordering!'
                }
            ]
        },

        # Product 6 (Floor 3): Nordic Cloud Luxury 3-Seater Sofa
        {
            'name': 'Nordic Cloud Velvet Ergonomic Sofa',
            'slug': 'nordic-cloud-velvet-sofa',
            'brand': 'Urban Living',
            'category': categories['furniture'],
            'floor': floors[3],
            'price': 64999.00,
            'original_price': 89999.00,
            'discount_percentage': 27,
            'rating': 4.85,
            'review_count': 380,
            'stock': 12,
            'is_featured': True,
            'showroom_slot': 0,
            'position_x': -3.0,
            'position_y': 0.9,
            'position_z': -1.5,
            'description': 'Handcrafted Scandinavian silhouette enveloped in spill-resistant Belgian velvet. Supported by kiln-dried oak wood frame and pocket-spring memory cushions.',
            'specifications': {
                'Dimensions': 'W 220cm x D 95cm x H 82cm',
                'Frame': 'Kiln-dried solid German Oak with 10-year structural warranty',
                'Fabric': '100% Water-repellent Micro-velvet (Martindale: 50,000 rubs)',
                'Seating': 'High-resilience foam core with goose feather topper',
                'Legs': 'Matte Brushed Brass tipped tapered legs'
            },
            'model_3d': {
                'model_type': 'sofa',
                'scale': 1.0,
                'camera_distance': 3.2,
                'auto_rotate_speed': 0.5,
                'color_options': [
                    {'name': 'Royal Flipkart Blue', 'hex': '#1E3A8A'},
                    {'name': 'Emerald Green', 'hex': '#065F46'},
                    {'name': 'Warm Oatmeal', 'hex': '#D6D3D1'}
                ]
            },
            'variants': [
                {'variant_type': 'Color', 'name': 'Royal Flipkart Blue', 'value': '#1E3A8A', 'price_modifier': 0},
                {'variant_type': 'Color', 'name': 'Emerald Green', 'value': '#065F46', 'price_modifier': 0},
                {'variant_type': 'Color', 'name': 'Warm Oatmeal', 'value': '#D6D3D1', 'price_modifier': 0},
                {'variant_type': 'Size', 'name': '3 Seater', 'value': '3-Seater', 'price_modifier': 0},
                {'variant_type': 'Size', 'name': '4 Seater + Ottoman', 'value': '4-Seater', 'price_modifier': 18000},
            ],
            'features': [
                {
                    'name': 'cushion',
                    'title': 'Dual-Density Cloud Cushioning',
                    'description': 'Combines 38-density high-resilience foam with a plush 3-inch feather-down layer that never sags.',
                    'hotspot_position': {'x': 0.0, 'y': 0.1, 'z': 0.2},
                    'icon': 'Smile',
                    'badge_text': 'MEMORY DOWNS',
                    'specs': {'Foam': '38D High Resilience', 'Durability': '10-Year Sag Free'}
                },
                {
                    'name': 'frame',
                    'title': 'Kiln-Dried Solid Oak Frame',
                    'description': 'Reinforced corner blocks and sinuous spring suspension built to withstand 400kg distributed weight.',
                    'hotspot_position': {'x': 0.8, 'y': -0.3, 'z': 0.3},
                    'icon': 'ShieldCheck',
                    'badge_text': 'GERMAN OAK',
                    'specs': {'Timber': 'Sustainable European Oak', 'Warranty': '10 Years'}
                }
            ],
            'reviews': [
                {
                    'author_name': 'Meera Kapoor',
                    'rating': 5,
                    'title': 'Centerpiece of my living room',
                    'comment': 'The royal blue velvet texture looks luxurious under warm lighting. Super deep and cozy.'
                }
            ]
        },

        # Product 7 (Floor 3): Samsung 75" Neo QLED 8K Smart TV
        {
            'name': 'Samsung 75" Neo QLED 8K Smart Cinema TV',
            'slug': 'samsung-75-neo-qled-8k',
            'brand': 'Samsung',
            'category': categories['home-appliances'],
            'floor': floors[3],
            'price': 429990.00,
            'original_price': 529990.00,
            'discount_percentage': 18,
            'rating': 4.9,
            'review_count': 195,
            'stock': 8,
            'is_featured': True,
            'showroom_slot': 1,
            'position_x': 2.8,
            'position_y': 1.1,
            'position_z': -2.2,
            'description': 'Witness unimaginable 8K detail powered by NQ8 AI Gen3 Processor. Features Quantum Matrix Technology Pro with mini LEDs and Dolby Atmos 90W 6.2.4 channel spatial audio.',
            'specifications': {
                'Resolution': 'Real 8K (7680 x 4320 pixels) with 33 Million Pixels',
                'Processor': 'NQ8 AI Gen3 Processor with 512 Neural Networks',
                'Audio': '90W 6.2.4CH with Object Tracking Sound Pro & Dolby Atmos',
                'Design': 'Infinity Air Design with 0.8mm border and Attachable Slim One Connect',
                'Gaming': '4K 240Hz, AMD FreeSync Premium Pro, 4x HDMI 2.1 ports'
            },
            'model_3d': {
                'model_type': 'television',
                'scale': 1.05,
                'camera_distance': 3.0,
                'auto_rotate_speed': 0.4,
                'color_options': [
                    {'name': 'Titan Silver Metallic', 'hex': '#9CA3AF'},
                    {'name': 'Eclipse Black', 'hex': '#111827'}
                ]
            },
            'variants': [
                {'variant_type': 'Size', 'name': '65 Inch', 'value': '65', 'price_modifier': -100000},
                {'variant_type': 'Size', 'name': '75 Inch', 'value': '75', 'price_modifier': 0},
                {'variant_type': 'Size', 'name': '85 Inch', 'value': '85', 'price_modifier': 180000},
            ],
            'features': [
                {
                    'name': 'panel',
                    'title': 'Quantum Matrix Technology Pro (Quantum Mini LED)',
                    'description': '1.5x more lighting zones than normal Quantum Matrix, expressing deep pitch blacks and ultra-pure whites with 14-bit contrast.',
                    'hotspot_position': {'x': 0.0, 'y': 0.2, 'z': 0.05},
                    'icon': 'Monitor',
                    'badge_text': '33 MILLION PIXELS',
                    'specs': {'Backlight': 'Quantum Mini LED', 'Color': '100% Color Volume with Quantum Dot'}
                },
                {
                    'name': 'ai_engine',
                    'title': 'NQ8 AI Gen3 Neural Processor',
                    'description': '512 AI neural networks upscale low-resolution content scene-by-scene into striking 8K clarity.',
                    'hotspot_position': {'x': 0.0, 'y': -0.4, 'z': 0.0},
                    'icon': 'Cpu',
                    'badge_text': '512 AI NETWORKS',
                    'specs': {'AI Upscaling': '8K AI Upscaling Pro', 'Motion': 'AI Motion Enhancer Pro'}
                }
            ],
            'reviews': [
                {
                    'author_name': 'Ananya Sen',
                    'rating': 5,
                    'title': 'Cinema-grade visual experience',
                    'comment': 'Watching IMAX movies and PS5 Pro gaming at 120Hz is breathtaking. The 3D mall experience was exceptional.'
                }
            ]
        },

        # Product 8 (Floor 3): LG InstaView Door-in-Door Smart Refrigerator
        {
            'name': 'LG 655L InstaView French-Door Smart Refrigerator',
            'slug': 'lg-655l-instaview-refrigerator',
            'brand': 'LG',
            'category': categories['home-appliances'],
            'floor': floors[3],
            'price': 169990.00,
            'original_price': 214990.00,
            'discount_percentage': 21,
            'rating': 4.85,
            'review_count': 412,
            'stock': 15,
            'is_featured': True,
            'showroom_slot': 2,
            'position_x': -0.2,
            'position_y': 1.1,
            'position_z': -2.5,
            'description': 'Knock twice and see 23% more of what is inside without opening the door. Linear Cooling reduces temperature fluctuations, locking in flavour and freshness for up to 7 days.',
            'specifications': {
                'Capacity': '655 Litres (Frost Free French Door)',
                'Compressor': 'Smart Inverter Compressor with 10-Year Warranty',
                'Cooling': 'DoorCooling+ & Linear Cooling with Hygiene Fresh+ air filter',
                'Smart Features': 'ThinQ Wi-Fi connectivity, smart temperature diagnostics',
                'Dispenser': 'UVnano water & cubed ice dispenser with self-sanitising nozzle'
            },
            'model_3d': {
                'model_type': 'refrigerator',
                'scale': 1.0,
                'camera_distance': 3.1,
                'auto_rotate_speed': 0.5,
                'color_options': [
                    {'name': 'Brushed Steel', 'hex': '#CBD5E1'},
                    {'name': 'Matte Charcoal Black', 'hex': '#334155'}
                ]
            },
            'variants': [
                {'variant_type': 'Finish', 'name': 'Brushed Steel', 'value': '#CBD5E1', 'price_modifier': 0},
                {'variant_type': 'Finish', 'name': 'Matte Charcoal', 'value': '#334155', 'price_modifier': 10000},
            ],
            'features': [
                {
                    'name': 'instaview',
                    'title': 'InstaView Door-in-Door Mirror Glass',
                    'description': 'Illuminates the interior with two quick knocks so you can view contents without releasing cool air.',
                    'hotspot_position': {'x': 0.35, 'y': 0.45, 'z': 0.4},
                    'icon': 'Eye',
                    'badge_text': 'KNOCK TWICE',
                    'specs': {'Glass': 'Tempered Mirror Glass', 'Cold Loss': '-41% air loss'}
                },
                {
                    'name': 'cooling',
                    'title': 'Linear Cooling & Hygiene Fresh+',
                    'description': '5-step air purification filter eliminates bacteria and foul odours while maintaining optimal humidity.',
                    'hotspot_position': {'x': -0.3, 'y': 0.2, 'z': 0.4},
                    'icon': 'Wind',
                    'badge_text': '99.99% STERILE',
                    'specs': {'Filter': '5-Step Hygiene Fresh+', 'Temperature': '±0.5°C Precision'}
                }
            ],
            'reviews': [
                {
                    'author_name': 'Kavita Chawla',
                    'rating': 5,
                    'title': 'Looks like an art piece in our modern kitchen',
                    'comment': 'The knock-to-see glass is incredible. Very quiet and keeps fruits crunchy for over a week.'
                }
            ]
        },

        # Product 9 (Floor 3): Bosch Series 8 i-DOS Washing Machine
        {
            'name': 'Bosch Series 8 9kg i-DOS Smart Washing Machine',
            'slug': 'bosch-series-8-9kg-idos',
            'brand': 'Bosch',
            'category': categories['home-appliances'],
            'floor': floors[3],
            'price': 68990.00,
            'original_price': 84990.00,
            'discount_percentage': 19,
            'rating': 4.9,
            'review_count': 620,
            'stock': 22,
            'is_featured': True,
            'showroom_slot': 3,
            'position_x': 4.5,
            'position_y': 1.1,
            'position_z': -1.2,
            'description': 'Intelligent automatic dosing system determines the exact quantity of detergent and water down to the millilitre. EcoSilence Drive delivers whisper-quiet endurance.',
            'specifications': {
                'Capacity': '9.0 kg (Front Loading Automatic)',
                'Motor': 'EcoSilence Drive brushless motor with AntiVibration side panels',
                'Spin Speed': '1400 RPM with Iron Assist steam smoothing',
                'Dosing': 'i-DOS automatic liquid detergent & softener calibration',
                'Programs': 'AllergyPlus, SpeedPerfect 65% faster, StainRemoval automatic'
            },
            'model_3d': {
                'model_type': 'washing_machine',
                'scale': 1.1,
                'camera_distance': 2.7,
                'auto_rotate_speed': 0.6,
                'color_options': [
                    {'name': 'Glacier White', 'hex': '#F8FAFC'},
                    {'name': 'Silver Inox', 'hex': '#94A3B8'}
                ]
            },
            'variants': [
                {'variant_type': 'Color', 'name': 'Glacier White', 'value': '#F8FAFC', 'price_modifier': 0},
                {'variant_type': 'Color', 'name': 'Silver Inox', 'value': '#94A3B8', 'price_modifier': 4000},
            ],
            'features': [
                {
                    'name': 'idos',
                    'title': 'i-DOS Precision Auto-Dosing System',
                    'description': 'Sensors detect fabric type, load volume, and soiling degree to dose detergent precisely, saving thousands of litres of water per year.',
                    'hotspot_position': {'x': -0.35, 'y': 0.55, 'z': 0.35},
                    'icon': 'Droplets',
                    'badge_text': 'MILLILITRE ACCURACY',
                    'specs': {'Tank Capacity': '1.3L Liquid Detergent', 'Savings': 'Up to 38% Detergent'}
                },
                {
                    'name': 'drum',
                    'title': 'VarioDrum Wave-Droplet Interior',
                    'description': 'Asymmetrical paddle design gently and efficiently rotates delicate fabrics without snagging or creasing.',
                    'hotspot_position': {'x': 0.0, 'y': 0.1, 'z': 0.4},
                    'icon': 'RotateCw',
                    'badge_text': 'ANTI-CREASE',
                    'specs': {'Drum Volume': '65 Litres', 'Spin': '1400 RPM'}
                }
            ],
            'reviews': [
                {
                    'author_name': 'Ramesh Iyer',
                    'rating': 5,
                    'title': 'Super quiet and completely automated',
                    'comment': 'Fill detergent once a month and forget it. Even at 1400 RPM spin speed it barely vibrates.'
                }
            ]
        },

        # Product 10 (Floor 1): Sony Alpha A7 IV Mirrorless Camera
        {
            'name': 'Sony Alpha A7 IV Mirrorless Camera',
            'slug': 'sony-alpha-a7-iv',
            'brand': 'Sony',
            'category': categories['mobiles'],
            'floor': floors[1],
            'price': 242990.00,
            'original_price': 269990.00,
            'discount_percentage': 10,
            'rating': 4.9,
            'review_count': 940,
            'stock': 18,
            'is_featured': True,
            'showroom_slot': 4,
            'position_x': 5.5,
            'position_y': 1.1,
            'position_z': -1.0,
            'description': 'Full-frame 33MP Exmor R back-illuminated CMOS sensor with BIONZ XR processing engine. 4K 60p 10-bit 4:2:2 recording and real-time eye AF for human, animal, and bird.',
            'specifications': {
                'Sensor': '33MP Full-Frame Exmor R CMOS Sensor',
                'Processor': 'BIONZ XR High-Speed Image Engine',
                'Video': '4K 60p 10-bit 4:2:2 All-Intra recording',
                'Autofocus': '759 phase-detection points with AI subject tracking',
                'Stabilization': '5-axis in-body optical image stabilization (5.5 stops)'
            },
            'model_3d': {
                'model_type': 'camera',
                'scale': 1.15,
                'camera_distance': 2.4,
                'auto_rotate_speed': 0.8,
                'color_options': [
                    {'name': 'Matte Pro Black', 'hex': '#1C1D1F'},
                    {'name': 'Graphite Grey', 'hex': '#374151'}
                ]
            },
            'variants': [
                {'variant_type': 'Kit', 'name': 'Body Only', 'value': 'body', 'price_modifier': 0},
                {'variant_type': 'Kit', 'name': 'With 28-70mm Zoom Lens', 'value': 'kit', 'price_modifier': 20000}
            ],
            'features': [
                {
                    'name': 'sensor',
                    'title': '33MP Exmor R Full-Frame Sensor',
                    'description': 'Back-illuminated sensor with high sensitivity and low noise across ISO 50-204,800 range.',
                    'hotspot_position': {'x': 0.0, 'y': 0.15, 'z': 0.45},
                    'icon': 'Sparkles',
                    'badge_text': '33MP FULL FRAME',
                    'specs': {'Dynamic Range': '15+ Stops', 'Shutter': '10 fps Mechanical'}
                },
                {
                    'name': 'display',
                    'title': 'Vari-Angle Side-Opening Touch LCD',
                    'description': '1.03-million-dot 3.0-type touch panel opens sideways for selfie and low-angle framing.',
                    'hotspot_position': {'x': 0.0, 'y': 0.15, 'z': -0.45},
                    'icon': 'Monitor',
                    'badge_text': 'VARI-ANGLE',
                    'specs': {'Size': '3.0 Inch', 'Touch': 'Full Touch Menu'}
                }
            ],
            'reviews': [
                {
                    'author_name': 'Devrath Nair',
                    'rating': 5,
                    'title': 'Unmatched color science and autofocus',
                    'comment': 'The autofocus locks onto bird and human eyes instantaneously. Exceptional dynamic range.'
                }
            ]
        },

        # Product 11 (Floor 1): JBL Charge 5 Pro Bluetooth Speaker
        {
            'name': 'JBL Charge 5 Pro Bluetooth Speaker',
            'slug': 'jbl-charge-5',
            'brand': 'JBL',
            'category': categories['mobiles'],
            'floor': floors[1],
            'price': 15999.00,
            'original_price': 18999.00,
            'discount_percentage': 16,
            'rating': 4.8,
            'review_count': 3200,
            'stock': 55,
            'is_featured': True,
            'showroom_slot': 5,
            'position_x': 5.5,
            'position_y': 1.1,
            'position_z': 1.0,
            'description': 'Bold JBL Original Pro Sound with an optimized long excursion driver, separate tweeter and dual pumping JBL bass radiators. Up to 20 hours of playtime and built-in powerbank.',
            'specifications': {
                'Output Power': '40W RMS (Woofer 30W + Tweeter 10W)',
                'Battery Life': 'Up to 20 Hours (7500 mAh battery)',
                'Waterproof': 'IP67 Waterproof & Dustproof',
                'Connectivity': 'Bluetooth 5.1 & PartyBoost multi-speaker'
            },
            'model_3d': {
                'model_type': 'speaker',
                'scale': 1.25,
                'camera_distance': 2.4,
                'auto_rotate_speed': 0.8,
                'color_options': [
                    {'name': 'Flipkart Blue', 'hex': '#2874F0'},
                    {'name': 'Squad Camo', 'hex': '#4B5563'},
                    {'name': 'Stealth Black', 'hex': '#18181B'}
                ]
            },
            'variants': [
                {'variant_type': 'Color', 'name': 'Flipkart Blue', 'value': '#2874F0', 'price_modifier': 0},
                {'variant_type': 'Color', 'name': 'Stealth Black', 'value': '#18181B', 'price_modifier': 0}
            ],
            'features': [
                {
                    'name': 'sound',
                    'title': 'JBL Original Pro Sound 40W',
                    'description': 'Dual passive radiators deliver deep, resonant punchy bass and crystalline high frequencies.',
                    'hotspot_position': {'x': 0.0, 'y': 0.0, 'z': 0.4},
                    'icon': 'Volume2',
                    'badge_text': '40W RMS',
                    'specs': {'Frequency Response': '60 Hz - 20 kHz'}
                }
            ],
            'reviews': [
                {
                    'author_name': 'Ankit Verma',
                    'rating': 5,
                    'title': 'The bass vibrates the entire room',
                    'comment': 'Took it to the pool and beach with zero worries about water or sand. Battery lasts days.'
                }
            ]
        },

        # Product 12 (Floor 1): Apple AirPods Pro 2
        {
            'name': 'Apple AirPods Pro 2 (USB-C)',
            'slug': 'apple-airpods-pro-2',
            'brand': 'Apple',
            'category': categories['mobiles'],
            'floor': floors[1],
            'price': 24900.00,
            'original_price': 26900.00,
            'discount_percentage': 7,
            'rating': 4.9,
            'review_count': 5400,
            'stock': 60,
            'is_featured': True,
            'showroom_slot': 6,
            'position_x': 0.0,
            'position_y': 1.1,
            'position_z': -1.0,
            'description': 'Rebuilt from the sound up with the Apple-designed H2 chip. Up to 2x more Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio with dynamic head tracking.',
            'specifications': {
                'Chip': 'Apple H2 headphone chip & Apple U1 in charging case',
                'ANC': 'Up to 2x more Active Noise Cancellation with Transparency mode',
                'Battery': 'Up to 6 hours listening (up to 30 hours with MagSafe case)',
                'Charging': 'MagSafe (USB-C), Apple Watch charger or Qi certified'
            },
            'model_3d': {
                'model_type': 'earbuds',
                'scale': 1.4,
                'camera_distance': 2.0,
                'auto_rotate_speed': 0.8,
                'color_options': [
                    {'name': 'Gloss White', 'hex': '#FFFFFF'}
                ]
            },
            'variants': [
                {'variant_type': 'Edition', 'name': 'USB-C MagSafe Case', 'value': 'usbc', 'price_modifier': 0}
            ],
            'features': [
                {
                    'name': 'anc',
                    'title': 'Pro-Grade Active Noise Cancellation',
                    'description': 'Acoustic algorithms eliminate unwanted ambient sounds in real time with 48,000 noise reductions per second.',
                    'hotspot_position': {'x': 0.25, 'y': 0.2, 'z': 0.1},
                    'icon': 'Volume2',
                    'badge_text': '2X NOISE CANCELLATION',
                    'specs': {'Driver': 'Custom high-excursion Apple driver'}
                }
            ],
            'reviews': [
                {
                    'author_name': 'Pooja Reddy',
                    'rating': 5,
                    'title': 'ANC makes flights whisper quiet',
                    'comment': 'Adaptive audio switches flawlessly between noise cancellation and transparency when people speak.'
                }
            ]
        },

        # Product 13 (Floor 2): Armani Exchange Tailored Slim Blazer
        {
            'name': 'Armani Exchange Tailored Slim Blazer',
            'slug': 'armani-exchange-blazer',
            'brand': 'Armani Exchange',
            'category': categories['fashion'],
            'floor': floors[2],
            'price': 18990.00,
            'original_price': 24990.00,
            'discount_percentage': 24,
            'rating': 4.7,
            'review_count': 420,
            'stock': 15,
            'is_featured': True,
            'showroom_slot': 1,
            'position_x': -4.5,
            'position_y': 1.1,
            'position_z': -1.0,
            'description': 'Contemporary single-breasted blazer in fine stretch wool blend. Structured shoulders, notched lapels, and tailored European slim-fit silhouette.',
            'specifications': {
                'Material': '70% Virgin Wool, 28% Viscose, 2% Elastane',
                'Cut': 'Slim Fit Single Breasted',
                'Lining': '100% Cupro Silk Blend',
                'Care': 'Dry Clean Only'
            },
            'model_3d': {
                'model_type': 'mannequin',
                'scale': 0.82,
                'camera_distance': 3.0,
                'auto_rotate_speed': 0.6,
                'color_options': [
                    {'name': 'Midnight Navy', 'hex': '#1E293B'},
                    {'name': 'Charcoal Black', 'hex': '#111827'}
                ]
            },
            'variants': [
                {'variant_type': 'Size', 'name': 'Size 38 (M)', 'value': '38', 'price_modifier': 0},
                {'variant_type': 'Size', 'name': 'Size 40 (L)', 'value': '40', 'price_modifier': 0},
                {'variant_type': 'Size', 'name': 'Size 42 (XL)', 'value': '42', 'price_modifier': 0}
            ],
            'features': [
                {
                    'name': 'build',
                    'title': 'Italian Virgin Wool Fabric',
                    'description': 'Finely spun virgin wool blend offering natural wrinkle resistance, luxurious drape, and all-season breathability.',
                    'hotspot_position': {'x': 0.0, 'y': 0.5, 'z': 0.25},
                    'icon': 'Feather',
                    'badge_text': 'VIRGIN WOOL',
                    'specs': {'Weave': 'Fine Twill', 'Feel': 'Soft Tailored'}
                }
            ],
            'reviews': [
                {
                    'author_name': 'Rohan Saxena',
                    'rating': 5,
                    'title': 'Impeccable fitting and drape',
                    'comment': 'Fits like a glove straight out of the box. The stretch wool is comfortable for all-day conferences.'
                }
            ]
        },

        # Product 14 (Floor 2): Gucci Horsebit 1955 Leather Handbag
        {
            'name': 'Gucci Horsebit 1955 Leather Handbag',
            'slug': 'gucci-horsebit-1955',
            'brand': 'Gucci',
            'category': categories['fashion'],
            'floor': floors[2],
            'price': 245000.00,
            'original_price': 275000.00,
            'discount_percentage': 11,
            'rating': 4.9,
            'review_count': 180,
            'stock': 8,
            'is_featured': True,
            'showroom_slot': 2,
            'position_x': 4.5,
            'position_y': 1.1,
            'position_z': -1.0,
            'description': 'Introduced for Cruise 2020, the Gucci Horsebit 1955 bag is recreated from an archival design with the iconic double ring and bar horsebit hardware.',
            'specifications': {
                'Material': 'Italian Grain Leather with Microfiber suede lining',
                'Hardware': 'Gold-toned Horsebit detail at front',
                'Strap': 'Adjustable shoulder strap with 25cm drop',
                'Origin': 'Made in Italy'
            },
            'model_3d': {
                'model_type': 'handbag',
                'scale': 1.2,
                'camera_distance': 2.4,
                'auto_rotate_speed': 0.6,
                'color_options': [
                    {'name': 'Cuir Brown Leather', 'hex': '#8B4513'},
                    {'name': 'Obsidian Black', 'hex': '#18181B'},
                    {'name': 'Ivory Cream', 'hex': '#FDFBF7'}
                ]
            },
            'variants': [
                {'variant_type': 'Color', 'name': 'Cuir Brown', 'value': '#8B4513', 'price_modifier': 0},
                {'variant_type': 'Color', 'name': 'Obsidian Black', 'value': '#18181B', 'price_modifier': 0}
            ],
            'features': [
                {
                    'name': 'build',
                    'title': 'Gold-Toned Equestrian Horsebit Clasp',
                    'description': 'Precision-milled brass hardware with 24K gold flash finish honoring the iconic archival equestrian motif.',
                    'hotspot_position': {'x': 0.0, 'y': 0.2, 'z': 0.25},
                    'icon': 'ShieldCheck',
                    'badge_text': 'ARCHIVAL HARDWARE',
                    'specs': {'Material': '24K Gold-Flashed Brass'}
                }
            ],
            'reviews': [
                {
                    'author_name': 'Meera Singhania',
                    'rating': 5,
                    'title': 'Timeless heritage luxury',
                    'comment': 'Stunning craftsmanship. The leather grain is exceptionally supple and the gold hardware is flawless.'
                }
            ]
        }
    ]

    for pdata in products_catalog:
        model_info = pdata.pop('model_3d')
        variants_info = pdata.pop('variants', [])
        features_info = pdata.pop('features', [])
        reviews_info = pdata.pop('reviews', [])

        prod, created = Product.objects.update_or_create(slug=pdata['slug'], defaults=pdata)

        # 3D Model
        Product3DModel.objects.update_or_create(
            product=prod,
            defaults=model_info
        )

        # Variants
        for v in variants_info:
            ProductVariant.objects.update_or_create(
                product=prod,
                variant_type=v['variant_type'],
                name=v['name'],
                defaults=v
            )

        # Features
        for f in features_info:
            ProductFeature.objects.update_or_create(
                product=prod,
                name=f['name'],
                defaults=f
            )

        # Reviews
        for r in reviews_info:
            ProductReview.objects.get_or_create(
                product=prod,
                title=r['title'],
                defaults={**r, 'user': demo_user}
            )

    print(f"Seeded {len(products_catalog)} complete 3D products with hotspots, variants & reviews!")
    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed()
