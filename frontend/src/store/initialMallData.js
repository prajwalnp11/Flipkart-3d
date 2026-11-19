// Default high-fidelity store data for Flipkart 3D Mall
// Guarantees zero blank/empty showrooms even if backend API is offline or loading

export const DEFAULT_FLOORS = [
  {
    floor_number: 0,
    name: 'Ground Floor – Grand Atrium & Lobby',
    short_title: 'LOBBY',
    subtitle: 'Category Gateways, Concierge & High-Speed Elevators',
    description: 'The magnificent central hub of Flipkart 3D Mall with expansive marble floors, interactive portals, and seamless floor navigation.',
    theme_color: '#2874F0'
  },
  {
    floor_number: 1,
    name: 'First Floor – Mobiles & Electronics',
    short_title: 'ELECTRONICS',
    subtitle: 'Flagship Smartphones, Pro Laptops & High-Fidelity Audio',
    description: 'Step into the futuristic tech pavilion featuring floating glass pedestals, metallic architecture, and tactile 3D product previews.',
    theme_color: '#0284C7'
  },
  {
    floor_number: 2,
    name: 'Second Floor – Fashion & Lifestyle',
    short_title: 'FASHION',
    subtitle: 'Haute Couture, Sneaker Vault & Designer Accessories',
    description: 'An elegant boutique gallery with mood lighting, runway podiums, and multi-angle 3D apparel and footwear displays.',
    theme_color: '#D946EF'
  },
  {
    floor_number: 3,
    name: 'Third Floor – Home & Living',
    short_title: 'HOME & LIVING',
    subtitle: 'Smart Living, Contemporary Furniture & Kitchen Innovations',
    description: 'A luxury penthouse showroom showcasing designer sofas, cinema displays, and modern smart appliances in real-world scale.',
    theme_color: '#10B981'
  }
];

export const DEFAULT_CATEGORIES = [
  {
    name: 'Electronics & Mobiles',
    slug: 'mobiles',
    floor_number: 1,
    icon: 'Smartphone',
    color: '#2874F0',
    description: 'Smartphones, Laptops, Tablets, Smartwatches & Audio'
  },
  {
    name: 'TVs & Appliances',
    slug: 'home-appliances',
    floor_number: 3,
    icon: 'Tv',
    color: '#0284C7',
    description: 'Smart TVs, Refrigerators, Washing Machines & Air Conditioners'
  },
  {
    name: 'Fashion & Lifestyle',
    slug: 'fashion',
    floor_number: 2,
    icon: 'Shirt',
    color: '#EC4899',
    description: "Men's & Women's Fashion, Footwear, Watches & Accessories"
  },
  {
    name: 'Home & Furniture',
    slug: 'furniture',
    floor_number: 3,
    icon: 'Armchair',
    color: '#10B981',
    description: 'Luxury Sofas, Beds, Dining, Decor & Smart Living'
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty',
    floor_number: 2,
    icon: 'Sparkles',
    color: '#F43F5E',
    description: 'Makeup, Skincare, Grooming & Fragrances'
  },
  {
    name: 'Grocery & Essentials',
    slug: 'grocery',
    floor_number: 3,
    icon: 'ShoppingBag',
    color: '#F59E0B',
    description: 'Daily Essentials, Gourmet Foods & Household Care'
  },
  {
    name: 'Sports & Gaming',
    slug: 'sports-gaming',
    floor_number: 1,
    icon: 'Gamepad2',
    color: '#8B5CF6',
    description: 'Fitness Equipment, Video Games, Consoles & Gear'
  },
  {
    name: 'Automotive & EVs',
    slug: 'automotive',
    floor_number: 1,
    icon: 'Zap',
    color: '#06B6D4',
    description: 'Electric Two-Wheelers, Helmets & Car Accessories'
  }
];

export const DEFAULT_PRODUCTS = [
  // ================= FLOOR 1: MOBILES & ELECTRONICS =================
  {
    id: 1,
    name: 'Apple iPhone 16 Pro Max',
    slug: 'iphone-16-pro-max',
    brand: 'Apple',
    floor_number: 1,
    floor: 1,
    price: 144900.00,
    original_price: 159900.00,
    discount_percentage: 9,
    rating: 4.9,
    review_count: 1840,
    stock: 45,
    is_featured: true,
    showroom_slot: 0,
    model_3d_type: 'smartphone',
    description: 'Forged in grade 5 titanium. Powered by the groundbreaking A18 Pro chip. Features the versatile Camera Control button and the longest battery life ever in an iPhone.',
    specifications: {
      'Display': '6.9-inch Super Retina XDR OLED with ProMotion 120Hz',
      'Processor': 'A18 Pro chip with 6-core GPU & Hardware Ray Tracing',
      'Camera': '48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto',
      'Battery': 'Up to 33 hours video playback, Qi2 & MagSafe wireless charging',
      'Build': 'Grade 5 Titanium frame with textured matte glass back',
      'Connectivity': 'USB-C (USB 3 up to 10Gb/s), Wi-Fi 7, 5G NR'
    },
    model_3d: {
      model_type: 'smartphone',
      color_options: [
        { name: 'Desert Titanium', hex: '#C2A385' },
        { name: 'Natural Titanium', hex: '#9E9A93' },
        { name: 'White Titanium', hex: '#E8E7E3' },
        { name: 'Black Titanium', hex: '#3C3B37' }
      ]
    },
    variants: [
      { id: 1, variant_type: 'Color', name: 'Desert Titanium', value: '#C2A385', price_modifier: 0 },
      { id: 2, variant_type: 'Color', name: 'Natural Titanium', value: '#9E9A93', price_modifier: 0 },
      { id: 3, variant_type: 'Color', name: 'Black Titanium', value: '#3C3B37', price_modifier: 0 },
      { id: 4, variant_type: 'Storage', name: '256 GB', value: '256GB', price_modifier: 0 },
      { id: 5, variant_type: 'Storage', name: '512 GB', value: '512GB', price_modifier: 20000 }
    ],
    features: [
      {
        name: 'camera',
        title: '48MP Pro Fusion Camera System',
        description: 'Second-generation sensor-shift optical image stabilisation with 4K 120 fps Dolby Vision recording for cinematic precision.',
        hotspot_position: { x: -0.32, y: 0.58, z: 0.12 },
        icon: 'Camera',
        badge_text: '4K 120 FPS',
        specs: { 'Sensor': '48MP Quad-Pixel', 'Zoom': '5x Optical Periscope' }
      },
      {
        name: 'display',
        title: '6.9" Super Retina XDR Display',
        description: 'Edge-to-edge borderless OLED display with ProMotion 120Hz refresh rate and 2000 nits outdoor peak brightness.',
        hotspot_position: { x: 0.0, y: 0.1, z: 0.15 },
        icon: 'Monitor',
        badge_text: '2000 NITS',
        specs: { 'Resolution': '2868 x 1320', 'Glass': 'Ceramic Shield 2' }
      },
      {
        name: 'processor',
        title: 'A18 Pro 3nm Bionic Processor',
        description: 'Industry-first 3-nanometer architecture featuring 6-core GPU, next-gen Neural Engine, and hardware ray tracing.',
        hotspot_position: { x: 0.1, y: 0.25, z: -0.1 },
        icon: 'Cpu',
        badge_text: '3NM ARCHITECTURE',
        specs: { 'Transistors': '20+ Billion', 'Ray Tracing': '2x Faster' }
      },
      {
        name: 'battery',
        title: '4,422 mAh Fast-Charging Battery',
        description: 'High-density battery cell providing up to 33 hours of video playback. Supports 25W MagSafe and fast Qi2 wireless charging.',
        hotspot_position: { x: 0.0, y: -0.4, z: -0.1 },
        icon: 'BatteryCharging',
        badge_text: '33H PLAYTIME',
        specs: { 'Capacity': '4422 mAh', 'Fast Charge': '50% in 30 mins' }
      },
      {
        name: 'build',
        title: 'Aerospace Grade 5 Titanium Body',
        description: 'Forged with aerospace-grade 5 titanium alloy frame, micro-blasted matte glass back, and IP68 water resistance.',
        hotspot_position: { x: 0.42, y: 0.0, z: 0.0 },
        icon: 'ShieldCheck',
        badge_text: 'GRADE 5 TITANIUM',
        specs: { 'Weight': '227 grams', 'Water Resistance': 'IP68 (6m depth)' }
      }
    ]
  },

  {
    id: 2,
    name: 'Apple MacBook Pro 16" (M4 Max)',
    slug: 'macbook-pro-16-m4-max',
    brand: 'Apple',
    floor_number: 1,
    floor: 1,
    price: 349900.00,
    original_price: 379900.00,
    discount_percentage: 8,
    rating: 4.95,
    review_count: 640,
    stock: 18,
    is_featured: true,
    showroom_slot: 1,
    model_3d_type: 'laptop',
    description: 'Engineered for monumental performance. M4 Max features up to 16 CPU cores, 40 GPU cores, and 128GB unified memory for uncompromising 3D rendering.',
    specifications: {
      'Chip': 'Apple M4 Max with 16-core CPU, 40-core GPU',
      'Display': '16.2-inch Liquid Retina XDR (3456 x 2234) 1600 nits HDR',
      'Memory': '64GB Unified Memory (configurable to 128GB)',
      'Storage': '1TB Ultra-fast NVMe SSD'
    },
    model_3d: {
      model_type: 'laptop',
      color_options: [
        { name: 'Space Black', hex: '#1C1D1F' },
        { name: 'Silver', hex: '#E3E4E5' }
      ]
    },
    variants: [
      { id: 6, variant_type: 'Color', name: 'Space Black', value: '#1C1D1F', price_modifier: 0 },
      { id: 7, variant_type: 'Color', name: 'Silver', value: '#E3E4E5', price_modifier: 0 }
    ],
    features: [
      {
        name: 'screen',
        title: 'Liquid Retina XDR Mini-LED Screen',
        description: '10,000 Mini-LED local dimming zones delivering 1,000,000:1 contrast ratio.',
        hotspot_position: { x: 0.0, y: 0.65, z: -0.4 },
        icon: 'Monitor',
        badge_text: '1600 NITS HDR',
        specs: { 'Resolution': '3456 x 2234' }
      }
    ]
  },

  {
    id: 3,
    name: 'Sony WH-1000XM5 Flagship Headphones',
    slug: 'sony-wh-1000xm5',
    brand: 'Sony',
    floor_number: 1,
    floor: 1,
    price: 26990.00,
    original_price: 34990.00,
    discount_percentage: 23,
    rating: 4.8,
    review_count: 3290,
    stock: 80,
    is_featured: true,
    showroom_slot: 2,
    model_3d_type: 'headphones',
    description: 'Industry-leading noise cancellation powered by two processors and eight microphones. Carbon fibre dome drivers deliver breathtaking High-Resolution Audio.',
    specifications: {
      'Driver Unit': '30mm precision-engineered Carbon Fibre composite',
      'Processors': 'HD Noise Cancelling Processor QN1 + Integrated Processor V1',
      'Battery Life': '30 hours with ANC ON (3 min quick charge for 3 hours)'
    },
    model_3d: {
      model_type: 'headphones',
      color_options: [
        { name: 'Midnight Blue', hex: '#1B263B' },
        { name: 'Silver Platinum', hex: '#D4D4D8' },
        { name: 'Matte Black', hex: '#18181B' }
      ]
    },
    variants: [
      { id: 8, variant_type: 'Color', name: 'Midnight Blue', value: '#1B263B', price_modifier: 0 },
      { id: 9, variant_type: 'Color', name: 'Silver Platinum', value: '#D4D4D8', price_modifier: 0 }
    ],
    features: [
      {
        name: 'anc',
        title: 'Dual-Processor Active Noise Cancelling',
        description: 'Auto NC Optimizer adjusts acoustic suppression in real time.',
        hotspot_position: { x: 0.45, y: 0.0, z: 0.0 },
        icon: 'Volume2',
        badge_text: '8 MICS',
        specs: { 'Microphones': '8 Beamforming Mics' }
      }
    ]
  },

  {
    id: 4,
    name: 'Apple Watch Ultra 2 Titanium',
    slug: 'apple-watch-ultra-2',
    brand: 'Apple',
    floor_number: 1,
    floor: 1,
    price: 89900.00,
    original_price: 89900.00,
    discount_percentage: 0,
    rating: 4.9,
    review_count: 510,
    stock: 30,
    is_featured: true,
    showroom_slot: 3,
    model_3d_type: 'smartwatch',
    description: 'The most capable and rugged Apple Watch. Built with 49mm corrosion-resistant aerospace titanium, brightest 3000-nit display, and dual-frequency GPS.',
    specifications: {
      'Case': '49mm Aerospace-grade Titanium with raised bezel',
      'Display': '3000 nits Always-On Retina display with Sapphire glass',
      'Water Resistance': '100m water resistant, EN13319 dive computer certified'
    },
    model_3d: {
      model_type: 'smartwatch',
      color_options: [
        { name: 'Natural Titanium', hex: '#B5AEA4' },
        { name: 'Black Titanium', hex: '#27272A' }
      ]
    },
    variants: [
      { id: 10, variant_type: 'Color', name: 'Natural Titanium', value: '#B5AEA4', price_modifier: 0 },
      { id: 11, variant_type: 'Color', name: 'Black Titanium', value: '#27272A', price_modifier: 0 }
    ],
    features: [
      {
        name: 'case',
        title: '49mm Titanium Armour & Action Button',
        description: 'Customisable international orange Action Button lets you start workouts or set waypoints.',
        hotspot_position: { x: -0.35, y: 0.1, z: 0.0 },
        icon: 'Shield',
        badge_text: 'MIL-STD 810H',
        specs: { 'Material': 'Aerospace Titanium' }
      }
    ]
  },

  // ================= FLOOR 2: FASHION & LIFESTYLE =================
  {
    id: 5,
    name: 'Nike Air Max 270 React Tech Vault',
    slug: 'nike-air-max-270-react',
    brand: 'Nike',
    floor_number: 2,
    floor: 2,
    price: 13995.00,
    original_price: 15995.00,
    discount_percentage: 12,
    rating: 4.75,
    review_count: 1120,
    stock: 60,
    is_featured: true,
    showroom_slot: 0,
    model_3d_type: 'shoe',
    description: 'Iconic lifestyle sneaker combining Nike highest 270 Max Air unit with resilient Nike React foam cushioning for surreal bounce.',
    specifications: {
      'Midsole': '270 Max Air heel unit + full-length Nike React foam',
      'Upper': 'Lightweight layered no-sew breathable synthetic textile',
      'Outsole': 'Durable full rubber coverage for multi-surface traction'
    },
    model_3d: {
      model_type: 'shoe',
      color_options: [
        { name: 'Laser Blue / White', hex: '#0090FF' },
        { name: 'Triple Black', hex: '#111827' },
        { name: 'Solar Crimson', hex: '#FF2D55' }
      ]
    },
    variants: [
      { id: 12, variant_type: 'Color', name: 'Laser Blue / White', value: '#0090FF', price_modifier: 0 },
      { id: 13, variant_type: 'Color', name: 'Triple Black', value: '#111827', price_modifier: 0 }
    ],
    features: [
      {
        name: 'air_unit',
        title: '270-Degree Max Air Heel Bubble',
        description: '32mm tall pressurized air chamber providing unmatched shock absorption and all-day energy return.',
        hotspot_position: { x: -0.4, y: -0.1, z: 0.0 },
        icon: 'Activity',
        badge_text: '32mm AIR',
        specs: { 'Height': '32mm cushion' }
      }
    ]
  },

  // ================= FLOOR 3: HOME & LIVING & APPLIANCES =================
  {
    id: 6,
    name: 'Nordic Cloud Velvet Ergonomic Sofa',
    slug: 'nordic-cloud-velvet-sofa',
    brand: 'Urban Living',
    floor_number: 3,
    floor: 3,
    price: 64999.00,
    original_price: 89999.00,
    discount_percentage: 27,
    rating: 4.85,
    review_count: 380,
    stock: 12,
    is_featured: true,
    showroom_slot: 0,
    model_3d_type: 'sofa',
    description: 'Handcrafted Scandinavian silhouette enveloped in spill-resistant Belgian velvet. Supported by kiln-dried oak wood frame and pocket-spring memory cushions.',
    specifications: {
      'Dimensions': 'W 220cm x D 95cm x H 82cm',
      'Frame': 'Kiln-dried solid German Oak with 10-year structural warranty',
      'Fabric': '100% Water-repellent Micro-velvet (Martindale: 50,000 rubs)',
      'Seating': 'High-resilience foam core with goose feather topper'
    },
    model_3d: {
      model_type: 'sofa',
      color_options: [
        { name: 'Royal Flipkart Blue', hex: '#1E3A8A' },
        { name: 'Emerald Green', hex: '#065F46' },
        { name: 'Warm Oatmeal', hex: '#D6D3D1' }
      ]
    },
    variants: [
      { id: 14, variant_type: 'Color', name: 'Royal Flipkart Blue', value: '#1E3A8A', price_modifier: 0 },
      { id: 15, variant_type: 'Color', name: 'Emerald Green', value: '#065F46', price_modifier: 0 }
    ],
    features: [
      {
        name: 'cushion',
        title: 'Dual-Density Cloud Cushioning',
        description: 'Combines 38-density high-resilience foam with a plush 3-inch feather-down layer.',
        hotspot_position: { x: 0.0, y: 0.1, z: 0.2 },
        icon: 'Smile',
        badge_text: 'MEMORY DOWNS',
        specs: { 'Foam': '38D High Resilience' }
      }
    ]
  },

  {
    id: 7,
    name: 'Samsung 75" Neo QLED 8K Smart Cinema TV',
    slug: 'samsung-75-neo-qled-8k',
    brand: 'Samsung',
    floor_number: 3,
    floor: 3,
    price: 429990.00,
    original_price: 529990.00,
    discount_percentage: 18,
    rating: 4.9,
    review_count: 195,
    stock: 8,
    is_featured: true,
    showroom_slot: 1,
    model_3d_type: 'television',
    description: 'Witness unimaginable 8K detail powered by NQ8 AI Gen3 Processor. Features Quantum Matrix Technology Pro with mini LEDs and Dolby Atmos 90W 6.2.4 channel spatial audio.',
    specifications: {
      'Resolution': 'Real 8K (7680 x 4320 pixels) with 33 Million Pixels',
      'Processor': 'NQ8 AI Gen3 Processor with 512 Neural Networks',
      'Audio': '90W 6.2.4CH with Object Tracking Sound Pro & Dolby Atmos',
      'Design': 'Infinity Air Design with 0.8mm border and Attachable Slim One Connect'
    },
    model_3d: {
      model_type: 'television',
      color_options: [
        { name: 'Titan Silver Metallic', hex: '#9CA3AF' },
        { name: 'Eclipse Black', hex: '#111827' }
      ]
    },
    variants: [
      { id: 16, variant_type: 'Size', name: '75 Inch', value: '75', price_modifier: 0 },
      { id: 17, variant_type: 'Size', name: '85 Inch', value: '85', price_modifier: 180000 }
    ],
    features: [
      {
        name: 'panel',
        title: 'Quantum Matrix Technology Pro (Quantum Mini LED)',
        description: '1.5x more lighting zones than normal Quantum Matrix, expressing deep pitch blacks and ultra-pure whites.',
        hotspot_position: { x: 0.0, y: 0.2, z: 0.05 },
        icon: 'Monitor',
        badge_text: '33 MILLION PIXELS',
        specs: { 'Backlight': 'Quantum Mini LED' }
      }
    ]
  },

  {
    id: 8,
    name: 'LG 655L InstaView French-Door Smart Refrigerator',
    slug: 'lg-655l-instaview-refrigerator',
    brand: 'LG',
    floor_number: 3,
    floor: 3,
    price: 169990.00,
    original_price: 214990.00,
    discount_percentage: 21,
    rating: 4.85,
    review_count: 412,
    stock: 15,
    is_featured: true,
    showroom_slot: 2,
    model_3d_type: 'refrigerator',
    description: 'Knock twice and see 23% more of what is inside without opening the door. Linear Cooling reduces temperature fluctuations, locking in flavour and freshness for up to 7 days.',
    specifications: {
      'Capacity': '655 Litres (Frost Free French Door)',
      'Compressor': 'Smart Inverter Compressor with 10-Year Warranty',
      'Cooling': 'DoorCooling+ & Linear Cooling with Hygiene Fresh+ air filter',
      'Smart Features': 'ThinQ Wi-Fi connectivity, smart temperature diagnostics',
      'Dispenser': 'UVnano water & cubed ice dispenser with self-sanitising nozzle'
    },
    model_3d: {
      model_type: 'refrigerator',
      color_options: [
        { name: 'Brushed Steel', hex: '#CBD5E1' },
        { name: 'Matte Charcoal Black', hex: '#334155' }
      ]
    },
    variants: [
      { id: 18, variant_type: 'Finish', name: 'Brushed Steel', value: '#CBD5E1', price_modifier: 0 },
      { id: 19, variant_type: 'Finish', name: 'Matte Charcoal', value: '#334155', price_modifier: 10000 }
    ],
    features: [
      {
        name: 'instaview',
        title: 'InstaView Door-in-Door Mirror Glass',
        description: 'Illuminates the interior with two quick knocks so you can view contents without releasing cool air.',
        hotspot_position: { x: 0.35, y: 0.45, z: 0.4 },
        icon: 'Eye',
        badge_text: 'KNOCK TWICE',
        specs: { 'Glass': 'Tempered Mirror Glass', 'Cold Loss': '-41% air loss' }
      }
    ]
  },

  {
    id: 9,
    name: 'Bosch Series 8 9kg i-DOS Smart Washing Machine',
    slug: 'bosch-series-8-9kg-idos',
    brand: 'Bosch',
    floor_number: 3,
    floor: 3,
    price: 68990.00,
    original_price: 84990.00,
    discount_percentage: 19,
    rating: 4.9,
    review_count: 620,
    stock: 22,
    is_featured: true,
    showroom_slot: 3,
    model_3d_type: 'washing_machine',
    description: 'Intelligent automatic dosing system determines the exact quantity of detergent and water down to the millilitre. EcoSilence Drive delivers whisper-quiet endurance.',
    specifications: {
      'Capacity': '9.0 kg (Front Loading Automatic)',
      'Motor': 'EcoSilence Drive brushless motor with AntiVibration side panels',
      'Spin Speed': '1400 RPM with Iron Assist steam smoothing',
      'Dosing': 'i-DOS automatic liquid detergent & softener calibration',
      'Programs': 'AllergyPlus, SpeedPerfect 65% faster, StainRemoval automatic'
    },
    model_3d: {
      model_type: 'washing_machine',
      color_options: [
        { name: 'Glacier White', hex: '#F8FAFC' },
        { name: 'Silver Inox', hex: '#94A3B8' }
      ]
    },
    variants: [
      { id: 20, variant_type: 'Color', name: 'Glacier White', value: '#F8FAFC', price_modifier: 0 },
      { id: 21, variant_type: 'Color', name: 'Silver Inox', value: '#94A3B8', price_modifier: 4000 }
    ],
    features: [
      {
        name: 'idos',
        title: 'i-DOS Precision Auto-Dosing System',
        description: 'Sensors detect fabric type, load volume, and soiling degree to dose detergent precisely.',
        hotspot_position: { x: -0.35, y: 0.55, z: 0.35 },
        icon: 'Droplets',
        badge_text: 'MILLILITRE ACCURACY',
        specs: { 'Tank Capacity': '1.3L Liquid Detergent' }
      }
    ]
  },

  // ================= NEW SHOWROOM TECH & FASHION PRODUCTS =================
  {
    id: 10,
    name: 'Sony Alpha A7 IV Mirrorless Camera',
    slug: 'sony-alpha-a7-iv',
    brand: 'Sony',
    floor_number: 1,
    floor: 1,
    price: 242990.00,
    original_price: 269990.00,
    discount_percentage: 10,
    rating: 4.9,
    review_count: 940,
    stock: 18,
    is_featured: true,
    showroom_slot: 4,
    model_3d_type: 'camera',
    description: 'Full-frame 33MP Exmor R back-illuminated CMOS sensor with BIONZ XR processing engine. 4K 60p 10-bit 4:2:2 recording and real-time eye AF for human, animal, and bird.',
    specifications: {
      'Sensor': '33MP Full-Frame Exmor R CMOS Sensor',
      'Processor': 'BIONZ XR High-Speed Image Engine',
      'Video': '4K 60p 10-bit 4:2:2 All-Intra recording',
      'Autofocus': '759 phase-detection points with AI subject tracking',
      'Stabilization': '5-axis in-body optical image stabilization (5.5 stops)'
    },
    model_3d: {
      model_type: 'camera',
      color_options: [
        { name: 'Matte Pro Black', hex: '#1C1D1F' },
        { name: 'Graphite Grey', hex: '#374151' }
      ]
    },
    variants: [
      { id: 22, variant_type: 'Kit', name: 'Body Only', value: 'body', price_modifier: 0 },
      { id: 23, variant_type: 'Kit', name: 'With 28-70mm Zoom Lens', value: 'kit', price_modifier: 20000 }
    ],
    features: [
      {
        name: 'sensor',
        title: '33MP Exmor R Full-Frame Sensor',
        description: 'Back-illuminated sensor with high sensitivity and low noise across ISO 50-204,800 range.',
        hotspot_position: { x: 0.0, y: 0.15, z: 0.45 },
        icon: 'Sparkles',
        badge_text: '33MP FULL FRAME',
        specs: { 'Dynamic Range': '15+ Stops', 'Shutter': '10 fps Mechanical' }
      },
      {
        name: 'display',
        title: 'Vari-Angle Side-Opening Touch LCD',
        description: '1.03-million-dot 3.0-type touch panel opens sideways for selfie and low-angle framing.',
        hotspot_position: { x: 0.0, y: 0.15, z: -0.45 },
        icon: 'Monitor',
        badge_text: 'VARI-ANGLE',
        specs: { 'Size': '3.0 Inch', 'Touch': 'Full Touch Menu' }
      }
    ]
  },

  {
    id: 11,
    name: 'JBL Charge 5 Pro Bluetooth Speaker',
    slug: 'jbl-charge-5',
    brand: 'JBL',
    floor_number: 1,
    floor: 1,
    price: 15999.00,
    original_price: 18999.00,
    discount_percentage: 16,
    rating: 4.8,
    review_count: 3200,
    stock: 55,
    is_featured: true,
    showroom_slot: 5,
    model_3d_type: 'speaker',
    description: 'Bold JBL Original Pro Sound with an optimized long excursion driver, separate tweeter and dual pumping JBL bass radiators. Up to 20 hours of playtime and built-in powerbank.',
    specifications: {
      'Output Power': '40W RMS (Woofer 30W + Tweeter 10W)',
      'Battery Life': 'Up to 20 Hours (7500 mAh battery)',
      'Waterproof': 'IP67 Waterproof & Dustproof',
      'Connectivity': 'Bluetooth 5.1 & PartyBoost multi-speaker'
    },
    model_3d: {
      model_type: 'speaker',
      color_options: [
        { name: 'Flipkart Blue', hex: '#2874F0' },
        { name: 'Squad Camo', hex: '#4B5563' },
        { name: 'Stealth Black', hex: '#18181B' }
      ]
    },
    variants: [
      { id: 24, variant_type: 'Color', name: 'Flipkart Blue', value: '#2874F0', price_modifier: 0 },
      { id: 25, variant_type: 'Color', name: 'Stealth Black', value: '#18181B', price_modifier: 0 }
    ],
    features: [
      {
        name: 'sound',
        title: 'JBL Original Pro Sound 40W',
        description: 'Dual passive radiators deliver deep, resonant punchy bass and crystalline high frequencies.',
        hotspot_position: { x: 0.0, y: 0.0, z: 0.4 },
        icon: 'Volume2',
        badge_text: '40W RMS',
        specs: { 'Frequency Response': '60 Hz - 20 kHz' }
      },
      {
        name: 'battery',
        title: '20-Hour Battery & Powerbank',
        description: 'Built-in 7500mAh lithium-ion powerbank charges your smartphone via USB-A without stopping music.',
        hotspot_position: { x: 0.0, y: -0.25, z: 0.0 },
        icon: 'BatteryCharging',
        badge_text: '7500 MAH',
        specs: { 'Playtime': '20 Hours', 'Charge Output': '5V/2A' }
      }
    ]
  },

  {
    id: 12,
    name: 'Apple AirPods Pro 2 (USB-C)',
    slug: 'apple-airpods-pro-2',
    brand: 'Apple',
    floor_number: 1,
    floor: 1,
    price: 24900.00,
    original_price: 26900.00,
    discount_percentage: 7,
    rating: 4.9,
    review_count: 5400,
    stock: 60,
    is_featured: true,
    showroom_slot: 6,
    model_3d_type: 'earbuds',
    description: 'Rebuilt from the sound up with the Apple-designed H2 chip. Up to 2x more Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio with dynamic head tracking.',
    specifications: {
      'Chip': 'Apple H2 headphone chip & Apple U1 in charging case',
      'ANC': 'Up to 2x more Active Noise Cancellation with Transparency mode',
      'Battery': 'Up to 6 hours listening (up to 30 hours with MagSafe case)',
      'Charging': 'MagSafe (USB-C), Apple Watch charger or Qi certified'
    },
    model_3d: {
      model_type: 'earbuds',
      color_options: [
        { name: 'Gloss White', hex: '#FFFFFF' }
      ]
    },
    variants: [
      { id: 26, variant_type: 'Edition', name: 'USB-C MagSafe Case', value: 'usbc', price_modifier: 0 }
    ],
    features: [
      {
        name: 'anc',
        title: 'Pro-Grade Active Noise Cancellation',
        description: 'Acoustic algorithms eliminate unwanted ambient sounds in real time with 48,000 noise reductions per second.',
        hotspot_position: { x: 0.25, y: 0.2, z: 0.1 },
        icon: 'Volume2',
        badge_text: '2X NOISE CANCELLATION',
        specs: { 'Driver': 'Custom high-excursion Apple driver' }
      }
    ]
  },

  {
    id: 13,
    name: 'Armani Exchange Tailored Slim Blazer',
    slug: 'armani-exchange-blazer',
    brand: 'Armani Exchange',
    floor_number: 2,
    floor: 2,
    price: 18990.00,
    original_price: 24990.00,
    discount_percentage: 24,
    rating: 4.7,
    review_count: 420,
    stock: 15,
    is_featured: true,
    showroom_slot: 1,
    model_3d_type: 'mannequin',
    description: 'Contemporary single-breasted blazer in fine stretch wool blend. Structured shoulders, notched lapels, and tailored European slim-fit silhouette.',
    specifications: {
      'Material': '70% Virgin Wool, 28% Viscose, 2% Elastane',
      'Cut': 'Slim Fit Single Breasted',
      'Lining': '100% Cupro Silk Blend',
      'Care': 'Dry Clean Only'
    },
    model_3d: {
      model_type: 'mannequin',
      color_options: [
        { name: 'Midnight Navy', hex: '#1E293B' },
        { name: 'Charcoal Black', hex: '#111827' }
      ]
    },
    variants: [
      { id: 27, variant_type: 'Size', name: 'Size 38 (M)', value: '38', price_modifier: 0 },
      { id: 28, variant_type: 'Size', name: 'Size 40 (L)', value: '40', price_modifier: 0 },
      { id: 29, variant_type: 'Size', name: 'Size 42 (XL)', value: '42', price_modifier: 0 }
    ],
    features: [
      {
        name: 'build',
        title: 'Italian Virgin Wool Fabric',
        description: 'Finely spun virgin wool blend offering natural wrinkle resistance, luxurious drape, and all-season breathability.',
        hotspot_position: { x: 0.0, y: 0.5, z: 0.25 },
        icon: 'Feather',
        badge_text: 'VIRGIN WOOL',
        specs: { 'Weave': 'Fine Twill', 'Feel': 'Soft Tailored' }
      }
    ]
  },

  {
    id: 14,
    name: 'Gucci Horsebit 1955 Leather Handbag',
    slug: 'gucci-horsebit-1955',
    brand: 'Gucci',
    floor_number: 2,
    floor: 2,
    price: 245000.00,
    original_price: 275000.00,
    discount_percentage: 11,
    rating: 4.9,
    review_count: 180,
    stock: 8,
    is_featured: true,
    showroom_slot: 2,
    model_3d_type: 'handbag',
    description: 'Introduced for Cruise 2020, the Gucci Horsebit 1955 bag is recreated from an archival design with the iconic double ring and bar horsebit hardware.',
    specifications: {
      'Material': 'Italian Grain Leather with Microfiber suede lining',
      'Hardware': 'Gold-toned Horsebit detail at front',
      'Strap': 'Adjustable shoulder strap with 25cm drop',
      'Origin': 'Made in Italy'
    },
    model_3d: {
      model_type: 'handbag',
      color_options: [
        { name: 'Cuir Brown Leather', hex: '#8B4513' },
        { name: 'Obsidian Black', hex: '#18181B' },
        { name: 'Ivory Cream', hex: '#FDFBF7' }
      ]
    },
    variants: [
      { id: 30, variant_type: 'Color', name: 'Cuir Brown', value: '#8B4513', price_modifier: 0 },
      { id: 31, variant_type: 'Color', name: 'Obsidian Black', value: '#18181B', price_modifier: 0 }
    ],
    features: [
      {
        name: 'build',
        title: 'Gold-Toned Equestrian Horsebit Clasp',
        description: 'Precision-milled brass hardware with 24K gold flash finish honoring the iconic archival equestrian motif.',
        hotspot_position: { x: 0.0, y: 0.2, z: 0.25 },
        icon: 'ShieldCheck',
        badge_text: 'ARCHIVAL HARDWARE',
        specs: { 'Material': '24K Gold-Flashed Brass' }
      }
    ]
  }
];
