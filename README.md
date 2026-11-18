# Flipkart 3D – Immersive Virtual Shopping Mall 🛒🏢✨

> **Disclaimer**: This is an independent 3D portfolio and architectural concept. It is not an official product of or affiliated with Flipkart Internet Private Limited.

---

## 🌟 Executive Overview

**Flipkart 3D** transforms traditional e-commerce into a multi-storey, interactive 3D virtual shopping mall. Instead of static 2D grid catalogs, shoppers enter a futuristic shopping mall, take express glass elevators across four specialized departments, inspect realistic 3D products in 360 degrees, trigger interactive contextual hotspots (camera optics, processor chips, high-density batteries, cushioning soles), and complete a full checkout process directly inside the 3D environment.

---

## 🏗️ Architecture & Technology Stack

### Frontend
- **React 18** with **Vite 6**
- **Three.js** & **React Three Fiber (R3F)**: WebGL 3D rendering pipeline
- **@react-three/drei**: Camera rigs, OrbitControls, 3D HTML markers, ContactShadows
- **Framer Motion**: Smooth 2D HUD overlays, modals, and screen transitions
- **Tailwind CSS**: Modern glassmorphism, responsive styling, Flipkart theme palette
- **Zustand**: Reactive state management across 3D scene phases and shopping cart
- **Web Audio API**: Procedural sound synthesizer for sliding doors, elevator chimes, button clicks, and ambient synthesizer mall soundtrack
- **Canvas Confetti**: Celebratory particle effects on successful order placement

### Backend
- **Python Django** & **Django REST Framework (DRF)**
- **SQLite / PostgreSQL**: Relational database supporting products, variants, 3D hotspots, orders, and reviews
- **SimpleJWT**: Token authentication for customer accounts
- **Django CORS Headers**: Seamless cross-origin REST communication
- **Pillow**: Image and asset processing pipeline

---

## 🏢 Mall Navigation & Department Map

```
                  ┌───────────────────────────────────────────────┐
                  │   3RD FLOOR: HOME & LIVING                    │
                  │   • Luxury Sofas • 8K Neo QLED TVs • Living   │
                  └───────────────────────▲───────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  │   2ND FLOOR: FASHION & LIFESTYLE              │
                  │   • Designer Apparel • Sneakers • Luxury Bags │
                  └───────────────────────▲───────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  │   1ST FLOOR: MOBILES & ELECTRONICS            │
                  │   • Flagship Phones • Pro Laptops • Audio     │
                  └───────────────────────▲───────────────────────┘
                                          │  [ EXPRESS 3D ELEVATOR ]
                  ┌───────────────────────┴───────────────────────┐
                  │   GROUND FLOOR: GRAND ATRIUM & LOBBY          │
                  │   • 10 Category Portals • Concierge Desk      │
                  └───────────────────────▲───────────────────────┘
                                          │  [ AUTOMATIC SLIDING DOORS ]
                  ┌───────────────────────┴───────────────────────┐
                  │   MALL EXTERIOR & PLAZA                       │
                  │   • Multi-Storey Facade • Animated Pedestrians│
                  └───────────────────────────────────────────────┘
```

---

## 🚀 Key Features

1. **Cinematic 3D Entrance**:
   - Futuristic shopping mall with blue and white architecture, glass curtain walls, and illuminated Flipkart 3D signage.
   - Animated pedestrians walking into the mall.
   - Clicking **ENTER STORE** smoothly slides the automatic doors open and propels the camera into the grand lobby.

2. **Ground Floor Category Selection**:
   - 10 interactive category pedestals with floating 3D holographic icons (Mobiles, Laptops, Audio, Wearables, Fashion, Shoes, Beauty, Accessories, Furniture, Appliances).
   - Selecting a category displays a department transition notice and automatically walks the customer to the express elevator.

3. **Multi-Floor Express Elevator**:
   - Motorized sliding elevator doors with floor selection buttons (G, 1, 2, 3).
   - Real-time digital LED floor matrix displaying current level.
   - Camera steps into the elevator, doors close, motor hums with gentle transit vibration, chime dings, doors slide open, and camera steps out onto the selected floor.

4. **3D Product Inspection Showroom**:
   - Real 3D products displayed on floating glass pedestals with underglow.
   - Clicking a product opens the **360° Inspection Viewer**:
     - Drag to rotate 360°
     - Zoom in and zoom out (pinch-to-zoom on mobile)
     - Front, Back, Side, Top, and Reset camera presets
     - Real-time color switcher updating 3D model materials instantaneously
     - Storage, RAM, and Size variant pickers with dynamic price adjustments

5. **Interactive 3D Product Hotspots**:
   - Pulsing 3D markers pinned to physical coordinates on models:
     - **Smartphone**: 48MP Pro Triple Camera, 6.9" ProMotion OLED Screen, A18 Pro Chip, 33-Hour Battery
     - **Laptop**: Liquid Retina XDR Screen, M4 Max Chip, Magic Keyboard
     - **Headphones**: Dual-Processor ANC, 30mm Carbon Fibre Drivers
     - **Smartwatch**: Titanium Case & Action Button, 3000 nits Sapphire Display
     - **Sneaker**: 270 Max Air Bubble, React Resilient Foam Sole
     - **Sofa**: Dual-Density Memory Cushions, German Kiln-Dried Oak Frame
     - **TV**: Quantum Mini LED Panel, NQ8 AI Gen3 Neural Processor
   - Clicking any hotspot animates a high-tech glassmorphic specs card.

6. **Full E-Commerce Workflow**:
   - Add to cart directly from 3D showroom without page reload.
   - Persistent cart with quantity counters, discounts, and delivery calculations.
   - Express Checkout with shipping address inputs and payment methods (UPI, Card, Net Banking, COD).
   - Confetti celebration with order number, tracking ID, and delivery estimate.
   - Smart Search with automatic elevator teleportation to matching products.
   - 2D Catalog Fallback toggle for low-power devices.

---

## 🛠️ Installation & Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 1. Backend Setup (Django)
```bash
# Navigate to backend directory
cd backend

# Create & activate virtual environment (if not already active)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
# (or: pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow)

# Run migrations & seed catalog data
python manage.py migrate
python seed_data.py

# Start Django Development Server (runs on http://127.0.0.1:8000)
python manage.py runserver 8000
```

> **Default Admin Credentials**:
> - Username: `admin`
> - Password: `admin123`
> - Admin Dashboard: `http://127.0.0.1:8000/admin/`

---

### 2. Frontend Setup (React + Three.js)
```bash
# Navigate to frontend directory
cd frontend

# Install packages
npm install

# Start Vite Development Server (runs on http://localhost:5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser to experience **Flipkart 3D**!

---

## 📡 REST API Documentation

| Endpoint | Method | Description |
|---|---|---|
| `/api/floors/` | GET | List all 4 mall floors with themes and camera coordinates |
| `/api/categories/` | GET | List all 10 product categories with floor references |
| `/api/products/` | GET | List products (supports `?floor=`, `?category=`, `?search=`) |
| `/api/products/<slug>/` | GET | Product detail with 3D model config, hotspots, variants, reviews |
| `/api/products/<slug>/add_review/` | POST | Submit customer rating and review |
| `/api/cart/` | GET | Get active customer cart with calculated totals |
| `/api/cart/items/add/` | POST | Add product and variant to cart |
| `/api/cart/items/<id>/` | PATCH/DEL | Update quantity or remove cart item |
| `/api/cart/wishlist/` | GET/POST | View or toggle wishlist items |
| `/api/orders/checkout/` | POST | Place order, record payment, and generate tracking ID |
| `/api/auth/register/` | POST | Customer account registration |
| `/api/auth/login/` | POST | Customer login returning JWT access and refresh tokens |

---

## 🎮 Controls & Interactions

- **Left Mouse Click / Tap**: Select categories, inspect products, trigger hotspots, interact with UI
- **Left Mouse Drag (in 3D Viewer)**: Orbit and rotate 3D products 360 degrees
- **Scroll Wheel / Pinch-to-Zoom**: Zoom in for macro inspection and zoom out
- **Audio Control**: Mute / Unmute toggle at top right (synthesizes ambient music and sound effects)
- **Search Bar**: Type any product name to preview results and teleport directly to its floor showroom
- **2D / 3D Switch**: Toggle accessibility mode anytime

---

*Designed & Architected as an immersive 3D Web experience.*
