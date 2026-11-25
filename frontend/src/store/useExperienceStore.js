import { create } from 'zustand';
import { api } from '../services/api';
import { sounds } from '../services/soundEffects';
import { DEFAULT_FLOORS, DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from './initialMallData';

/**
 * Robust Category-to-Floor resolver using Django metadata, floor references, and department heuristics.
 * Guarantees that category IDs are never falsely assumed to match floor numbers.
 */
export function resolveCategoryFloor(category) {
  if (!category) return 1;

  if (typeof category.floor_number === 'number') {
    return category.floor_number;
  }
  if (typeof category.floor?.floor_number === 'number') {
    return category.floor.floor_number;
  }

  const slug = (category.slug || category.name || '').toLowerCase();
  if (/mobile|smartphone|laptop|computer|electronic|wearable|smartwatch|audio|tech|gaming|sports/.test(slug)) {
    return 1;
  }
  if (/fashion|apparel|shoe|sneaker|beauty|cosmetic|accessory|accessories|lifestyle/.test(slug)) {
    return 2;
  }
  if (/furniture|home|living|appliance|tv|television|kitchen|grocery/.test(slug)) {
    return 3;
  }

  if (typeof category.floor === 'number' && category.floor >= 1 && category.floor <= 3) {
    return category.floor;
  }

  return 1;
}

// App State Machine Phases:
// loading -> exterior -> entering -> lobby -> toElevator -> riding -> arriving -> showroom -> inspecting
export const useExperienceStore = create((set, get) => ({
  // Core State Machine
  phase: 'exterior', // 'loading' | 'exterior' | 'entering' | 'lobby' | 'toElevator' | 'riding' | 'arriving' | 'showroom' | 'inspecting'
  previousPhase: 'exterior',
  currentView: 'EXTERIOR', // legacy compatibility mirror
  previousView: 'EXTERIOR',
  currentFloor: 0,
  selectedFloor: 0, // legacy compatibility mirror
  targetFloor: 0,
  selectedCategory: null,
  selectedProduct: null,
  selectedVariant: null,
  inspectionColor: null,
  activeHotspot: null,
  quality: 'high', // 'high' | 'medium' | 'low'
  isMuted: false,
  audioMuted: false, // legacy compatibility mirror
  isClassicView: false,
  is2DFallback: false, // legacy compatibility mirror
  cameraLock: false,
  cinematicProgress: 0, // 0 to 1

  // Door and mechanical indicators
  doorOpen: false,
  elevatorDoorOpen: false,
  elevatorMoving: false,
  elevatorFloorDisplay: 'G',
  elevatorStatus: 'idle', // 'idle' | 'approaching' | 'doors_opening' | 'boarding' | 'moving' | 'arrived' | 'exiting'
  _elevatorTimers: [],

  // Customer Avatar & Navigation Mode (Section 4)
  navigationMode: 'guided', // 'guided' | 'avatar'
  avatarPosition: [0, 0, 10],
  avatarRotation: 0,
  avatarMoving: false,
  interactionPrompt: null, // { text, action }

  // Brand Storefront State (Section 6)
  selectedBrand: null, // null | 'apple' | 'samsung' | 'google' | 'oneplus' | 'xiaomi' | 'nothing'
  brandDoorOpen: false,

  // 3D Exploded Product State (Section 9)
  isExplodedView: false,
  explosionProgress: 0, // 0 (assembled) to 1 (fully separated)
  selectedExplodedComponent: null,

  // Active Data
  floors: DEFAULT_FLOORS,
  categories: DEFAULT_CATEGORIES,
  categoriesLoading: false,
  categoriesError: null,
  products: DEFAULT_PRODUCTS,
  cart: { items: [], total_items: 0, subtotal: 0, discount: 0, delivery_fee: 0, total_amount: 0 },
  wishlist: [],
  searchResults: [],
  toasts: [], // { id, title, message, type: 'info' | 'success' | 'warn' }

  // Modals & Panels
  cartOpen: false,
  checkoutOpen: false,
  orderSuccessOpen: false,
  lastOrder: null,
  searchOpen: false,
  searchQuery: '',
  quickNavOpen: false,
  user: null,

  // Toast notification helper
  addToast: (title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    set((state) => ({
      toasts: [...state.toasts, { id, title, message, type }]
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, 3500);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  },

  // Initialize data from Django API with fallback preservation
  initData: async () => {
    set({ categoriesLoading: true, categoriesError: null });
    try {
      const [floors, categories, products, cart] = await Promise.all([
        api.getFloors(),
        api.getCategories(),
        api.getProducts(),
        api.getCart()
      ]);
      const validCategories = Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
      set({
        floors: Array.isArray(floors) && floors.length > 0 ? floors : DEFAULT_FLOORS,
        categories: validCategories,
        categoriesLoading: false,
        categoriesError: null,
        products: Array.isArray(products) && products.length > 0 ? products : DEFAULT_PRODUCTS,
        cart: cart && cart.items ? cart : get().cart
      });
    } catch (err) {
      console.warn('Init data using cached defaults:', err);
      set({
        categories: get().categories?.length > 0 ? get().categories : DEFAULT_CATEGORIES,
        categoriesLoading: false,
        categoriesError: err.message || 'Network connection offline'
      });
    }
  },

  // On-demand Category reload with error handling & retry
  fetchCategories: async () => {
    set({ categoriesLoading: true, categoriesError: null });
    try {
      const data = await api.getCategories();
      if (Array.isArray(data) && data.length > 0) {
        set({ categories: data, categoriesLoading: false, categoriesError: null });
        get().addToast('Directory Updated', `Loaded ${data.length} shopping departments`, 'success');
      } else if (Array.isArray(data) && data.length === 0) {
        set({ categories: [], categoriesLoading: false, categoriesError: null });
      } else {
        set({
          categories: get().categories?.length > 0 ? get().categories : DEFAULT_CATEGORIES,
          categoriesLoading: false,
          categoriesError: 'Server returned invalid department data'
        });
      }
    } catch (err) {
      set({
        categories: get().categories?.length > 0 ? get().categories : DEFAULT_CATEGORIES,
        categoriesLoading: false,
        categoriesError: err.message || 'Failed to fetch categories'
      });
    }
  },

  // Quality Preset Setter
  setQuality: (quality) => set({ quality }),

  // Audio mute toggle
  toggleMute: () => {
    const next = !get().isMuted;
    sounds.setMuted(next);
    set({ isMuted: next, audioMuted: next });
  },

  // 2D Classic View Toggle
  toggleClassicView: () => {
    const next = !get().isClassicView;
    set({ isClassicView: next, is2DFallback: next });
  },
  toggle2DFallback: () => {
    get().toggleClassicView();
  },

  // Set Camera Lock
  setCameraLock: (locked) => set({ cameraLock: locked }),

  // 1. ENTER STORE Cinematic Timeline
  enterStore: () => {
    sounds.playClick();
    sounds.startMallAmbient();
    sounds.playDoorOpen();

    set({
      phase: 'entering',
      currentView: 'ENTERING',
      cameraLock: true,
      doorOpen: true
    });

    // Camera dollys through entrance doors into the Grand Lobby
    const timer = setTimeout(() => {
      set({
        phase: 'lobby',
        currentView: 'GROUND_LOBBY',
        currentFloor: 0,
        selectedFloor: 0,
        targetFloor: 0,
        cameraLock: false,
        doorOpen: false,
        elevatorFloorDisplay: 'G'
      });
      sounds.playElevatorDing();
    }, 1600);

    get()._currentCinematicTimer = timer;
  },

  // Return to Mall Plaza Exterior
  exitToExterior: () => {
    sounds.playClick();
    set({
      phase: 'exterior',
      currentView: 'EXTERIOR',
      currentFloor: 0,
      selectedFloor: 0,
      targetFloor: 0,
      selectedCategory: null,
      selectedProduct: null,
      cameraLock: false,
      doorOpen: false,
      activeHotspot: null
    });
  },

  // 2. Select Category (Triggers Elevator Ride to Category's Floor)
  selectCategory: (category) => {
    sounds.playClick();
    sounds.playPortalWhoosh();
    set({ selectedCategory: category });

    const destFloor = resolveCategoryFloor(category);
    const floorNames = { 1: '1F Electronics & Gadgets', 2: '2F Fashion & Lifestyle', 3: '3F Home & Appliances' };
    get().addToast(
      category.name || 'Department Selected',
      `Taking panoramic glass elevator to ${floorNames[destFloor] || `Floor ${destFloor}`}`,
      'info'
    );
    get().travelToFloor(destFloor);
  },

  // Clear selected category filter
  clearSelectedCategory: () => {
    set({ selectedCategory: null });
  },

  // 3. Complete Glass Elevator Master Sequence
  travelToFloor: (destinationFloor) => {
    const currentFloor = get().currentFloor;
    if (destinationFloor === currentFloor && (get().phase === 'showroom' || get().phase === 'lobby')) {
      return;
    }

    // Clear any active elevator or cinematic timers
    if (get()._currentCinematicTimer) {
      clearTimeout(get()._currentCinematicTimer);
    }
    const oldTimers = get()._elevatorTimers || [];
    oldTimers.forEach((t) => clearTimeout(t));

    const displayMap = { 0: 'G', 1: '1F', 2: '2F', 3: '3F' };
    const startFloor = currentFloor;
    const floorDiff = Math.abs(destinationFloor - startFloor);
    const travelDuration = Math.max(1600, floorDiff * 950); // Scale vertical transit time by floors traveled
    const timers = [];

    sounds.playClick();
    set({
      targetFloor: destinationFloor,
      phase: 'toElevator',
      currentView: 'TRANSITION_ELEVATOR',
      cameraLock: true,
      activeHotspot: null,
      selectedBrand: null,
      elevatorDoorOpen: false,
      elevatorMoving: false,
      elevatorStatus: 'approaching',
      elevatorFloorDisplay: displayMap[startFloor] || `${startFloor}F`
    });

    // Step A: Customer reaches elevator & doors slide open
    timers.push(setTimeout(() => {
      sounds.playDoorOpen();
      set({ elevatorDoorOpen: true, elevatorStatus: 'doors_opening' });
    }, 650));

    // Step B: Customer enters cabin & doors close
    timers.push(setTimeout(() => {
      set({ elevatorStatus: 'boarding' });
    }, 1150));

    timers.push(setTimeout(() => {
      set({
        phase: 'riding',
        currentView: 'IN_ELEVATOR',
        elevatorDoorOpen: false,
        elevatorMoving: true,
        elevatorStatus: 'moving'
      });
    }, 1600));

    // Step C: Progressive floor indicator updates during vertical travel
    if (floorDiff > 0) {
      const stepDirection = destinationFloor > startFloor ? 1 : -1;
      for (let step = 1; step <= floorDiff; step++) {
        const intermediateFloor = startFloor + step * stepDirection;
        const stepTime = 1600 + Math.round((travelDuration * step) / (floorDiff + 0.35));
        timers.push(setTimeout(() => {
          set({ elevatorFloorDisplay: displayMap[intermediateFloor] || `${intermediateFloor}F` });
        }, stepTime));
      }
    }

    // Step D: Arrive at destination floor, arrival chime & doors open
    const arriveTime = 1600 + travelDuration;
    timers.push(setTimeout(() => {
      sounds.playElevatorDing();
      sounds.playDoorOpen();
      set({
        phase: 'arriving',
        currentView: 'IN_ELEVATOR',
        elevatorMoving: false,
        elevatorDoorOpen: true,
        elevatorStatus: 'arrived',
        currentFloor: destinationFloor,
        selectedFloor: destinationFloor,
        elevatorFloorDisplay: displayMap[destinationFloor] || `${destinationFloor}F`
      });
    }, arriveTime));

    // Step E: Customer exits into destination floor showroom or ground lobby
    const exitStartTime = arriveTime + 650;
    timers.push(setTimeout(() => {
      set({ elevatorStatus: 'exiting' });
    }, exitStartTime));

    const endTimer = setTimeout(() => {
      const activeCat = get().selectedCategory;
      set({
        phase: destinationFloor === 0 ? 'lobby' : 'showroom',
        currentView: destinationFloor === 0 ? 'GROUND_LOBBY' : 'SHOWROOM',
        elevatorDoorOpen: false,
        elevatorStatus: 'idle',
        cameraLock: false,
        avatarPosition: [0, destinationFloor * 8, destinationFloor === 0 ? 7.8 : -4.2],
        avatarRotation: destinationFloor === 0 ? 0 : Math.PI
      });
      if (destinationFloor > 0 && activeCat) {
        get().addToast(
          `Arrived at ${displayMap[destinationFloor]}`,
          `Showroom ready for ${activeCat.name}`,
          'success'
        );
      }
    }, arriveTime + 1350);

    timers.push(endTimer);
    set({ _elevatorTimers: timers, _currentCinematicTimer: endTimer });
  },

  // Return to Ground Floor via Panoramic Elevator
  returnToGroundFloor: () => {
    get().travelToFloor(0);
  },

  // Quick Skip active cinematic transition (UX Principle #2)
  skipCinematic: () => {
    if (get()._currentCinematicTimer) {
      clearTimeout(get()._currentCinematicTimer);
    }
    const oldTimers = get()._elevatorTimers || [];
    oldTimers.forEach((t) => clearTimeout(t));

    const { phase, targetFloor } = get();

    if (phase === 'entering') {
      set({
        phase: 'lobby',
        currentView: 'GROUND_LOBBY',
        currentFloor: 0,
        selectedFloor: 0,
        targetFloor: 0,
        doorOpen: false,
        cameraLock: false,
        elevatorStatus: 'idle',
        elevatorFloorDisplay: 'G'
      });
    } else if (phase === 'toElevator' || phase === 'riding' || phase === 'arriving') {
      const displayMap = { 0: 'G', 1: '1F', 2: '2F', 3: '3F' };
      set({
        phase: targetFloor === 0 ? 'lobby' : 'showroom',
        currentView: targetFloor === 0 ? 'GROUND_LOBBY' : 'SHOWROOM',
        currentFloor: targetFloor,
        selectedFloor: targetFloor,
        elevatorMoving: false,
        elevatorDoorOpen: false,
        elevatorStatus: 'idle',
        cameraLock: false,
        elevatorFloorDisplay: displayMap[targetFloor] || `${targetFloor}F`,
        avatarPosition: [0, targetFloor * 8, targetFloor === 0 ? 7.8 : -4.2],
        avatarRotation: targetFloor === 0 ? 0 : Math.PI,
        _elevatorTimers: []
      });
      sounds.playElevatorDing();
    }
  },

  // Quick Jump from Floor HUD (Cinematic elevator travel)
  quickJumpToFloor: (floorNum) => {
    get().travelToFloor(floorNum);
  },

  // Instant Teleport to Floor (0ms delay for UI Shortcuts & Direct Jump)
  instantJumpToFloor: (floorNum) => {
    if (get()._currentCinematicTimer) {
      clearTimeout(get()._currentCinematicTimer);
    }
    const oldTimers = get()._elevatorTimers || [];
    oldTimers.forEach((t) => clearTimeout(t));
    sounds.playClick();
    sounds.playElevatorDing();
    const displayMap = { 0: 'G', 1: '1F', 2: '2F', 3: '3F' };
    set({
      currentFloor: floorNum,
      selectedFloor: floorNum,
      targetFloor: floorNum,
      phase: floorNum === 0 ? 'lobby' : 'showroom',
      currentView: floorNum === 0 ? 'GROUND_LOBBY' : 'SHOWROOM',
      doorOpen: false,
      cameraLock: false,
      elevatorMoving: false,
      elevatorDoorOpen: false,
      elevatorStatus: 'idle',
      selectedBrand: null,
      elevatorFloorDisplay: displayMap[floorNum] || `${floorNum}F`,
      avatarPosition: [0, floorNum * 8, floorNum === 0 ? 7.8 : -4.2],
      avatarRotation: floorNum === 0 ? 0 : Math.PI,
      _elevatorTimers: []
    });
    get().addToast('Teleported', `Arrived at ${displayMap[floorNum] || floorNum} Floor`, 'success');
  },

  // Instant Teleport to Brand Boutique on Floor 1
  instantJumpToBrand: (brandSlug) => {
    if (get()._currentCinematicTimer) {
      clearTimeout(get()._currentCinematicTimer);
    }
    sounds.playClick();
    sounds.playDoorOpen();
    set({
      currentFloor: 1,
      selectedFloor: 1,
      targetFloor: 1,
      phase: 'showroom',
      currentView: 'SHOWROOM',
      selectedBrand: brandSlug,
      doorOpen: false,
      brandDoorOpen: false,
      cameraLock: false,
      elevatorMoving: false,
      elevatorDoorOpen: false,
      elevatorFloorDisplay: '1F'
    });
    get().addToast('Brand Boutique', `Entered the official ${brandSlug.toUpperCase()} Storefront`, 'success');
  },

  // 4. Open 3D Product Inspector (Phase: inspecting)
  openProductInspect: async (product) => {
    sounds.playClick();
    sounds.playHotspotPing();

    set({
      selectedProduct: product,
      previousPhase: get().phase,
      previousView: get().currentView,
      phase: 'inspecting',
      currentView: 'PRODUCT_INSPECT',
      cameraLock: false,
      activeHotspot: null
    });

    try {
      const detail = await api.getProductDetail(product.slug);
      if (detail) {
        set({
          selectedProduct: detail,
          selectedVariant: detail.variants?.[0] || null,
          inspectionColor: detail.model_3d?.color_options?.[0]?.hex || null
        });
      }
    } catch (err) {
      console.warn('Using offline product details:', err);
    }
  },

  closeProductInspect: () => {
    sounds.playClick();
    const prevPhase = get().previousPhase === 'lobby' ? 'lobby' : 'showroom';
    set({
      phase: prevPhase,
      currentView: prevPhase === 'lobby' ? 'GROUND_LOBBY' : 'SHOWROOM',
      selectedProduct: null,
      activeHotspot: null,
      isExplodedView: false,
      explosionProgress: 0,
      selectedExplodedComponent: null
    });
  },

  setInspectionColor: (hex) => set({ inspectionColor: hex }),
  setSelectedVariant: (variant) => set({ selectedVariant: variant }),
  setActiveHotspot: (hotspot) => {
    if (hotspot) sounds.playHotspotPing();
    set({ activeHotspot: hotspot });
  },

  // Avatar and Navigation Mode Actions
  setNavigationMode: (mode) => {
    sounds.playClick();
    set({ navigationMode: mode });
    get().addToast('Navigation Mode', mode === 'avatar' ? '🎮 Free Avatar Mode (Use WASD / Arrows to walk)' : '🎥 Cinematic Guided Mode');
  },
  toggleNavigationMode: () => {
    const next = get().navigationMode === 'guided' ? 'avatar' : 'guided';
    get().setNavigationMode(next);
  },
  updateAvatarState: (pos, rot, isMoving) => {
    set({ avatarPosition: pos, avatarRotation: rot, avatarMoving: isMoving });
  },
  setInteractionPrompt: (prompt) => {
    set({ interactionPrompt: prompt });
  },

  // Brand Boutique Store Actions
  enterBrandStore: (brandSlug) => {
    sounds.playDoorOpen();
    sounds.playPortalWhoosh();
    set({
      selectedBrand: brandSlug,
      brandDoorOpen: true,
      cameraLock: true
    });
    get().addToast('Flagship Storefront', `Entering the official ${brandSlug.toUpperCase()} Showroom`, 'info');
    setTimeout(() => {
      set({ brandDoorOpen: false, cameraLock: false });
    }, 1600);
  },
  exitBrandStore: () => {
    sounds.playDoorOpen();
    set({
      brandDoorOpen: true,
      cameraLock: true
    });
    setTimeout(() => {
      set({
        selectedBrand: null,
        brandDoorOpen: false,
        cameraLock: false
      });
      sounds.playClick();
    }, 1200);
  },

  // 3D Exploded Product View Actions
  toggleExplodedView: () => {
    sounds.playClick();
    const next = !get().isExplodedView;
    set({
      isExplodedView: next,
      explosionProgress: next ? 1 : 0,
      selectedExplodedComponent: next ? 'camera' : null
    });
    sounds.playHotspotPing();
  },
  setExplosionProgress: (progress) => {
    set({
      explosionProgress: progress,
      isExplodedView: progress > 0.02
    });
  },
  setSelectedExplodedComponent: (compKey) => {
    sounds.playClick();
    sounds.playHotspotPing();
    set({ selectedExplodedComponent: compKey });
  },
  resetExplodedView: () => {
    sounds.playClick();
    set({
      isExplodedView: false,
      explosionProgress: 0,
      selectedExplodedComponent: null
    });
  },

  // 5. Cart Actions
  addToCart: async (product, variant = null, quantity = 1) => {
    sounds.playCartAdd();
    try {
      const cart = await api.addToCart(product.id, variant?.id || null, quantity);
      if (cart && cart.items) {
        set({ cart });
      } else {
        // Optimistic offline update
        const existing = get().cart.items.find(
          (i) => i.product.id === product.id && i.variant?.id === variant?.id
        );
        let items = [];
        if (existing) {
          items = get().cart.items.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          items = [...get().cart.items, { id: Date.now(), product, variant, quantity }];
        }
        const total_items = items.reduce((acc, i) => acc + i.quantity, 0);
        const subtotal = items.reduce((acc, i) => {
          const price = Number(i.product.price) + (i.variant ? Number(i.variant.price_modifier || 0) : 0);
          return acc + price * i.quantity;
        }, 0);
        set({
          cart: {
            items,
            total_items,
            subtotal,
            discount: Math.round(subtotal * 0.1),
            delivery_fee: 0,
            total_amount: Math.round(subtotal * 0.9)
          }
        });
      }
      get().addToast('Added to Cart', `${product.name} is in your shopping cart.`, 'success');
    } catch (err) {
      console.error('Cart error:', err);
      get().addToast('Added to Cart', `${product.name} added.`, 'success');
    }
  },

  updateCartQuantity: async (itemId, quantity) => {
    try {
      const cart = await api.updateCartItem(itemId, quantity);
      if (cart && cart.items) set({ cart });
    } catch (err) {
      const items = get().cart.items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
      const total_items = items.reduce((acc, i) => acc + i.quantity, 0);
      set({ cart: { ...get().cart, items, total_items } });
    }
  },

  removeFromCart: async (itemId) => {
    try {
      const cart = await api.removeFromCart(itemId);
      if (cart && cart.items) set({ cart });
    } catch (err) {
      const items = get().cart.items.filter((i) => i.id !== itemId);
      set({ cart: { ...get().cart, items, total_items: items.length } });
    }
  },
  removeCartItem: async (itemId) => {
    get().removeFromCart(itemId);
  },
  clearCart: () => {
    set({
      cart: { items: [], total_items: 0, subtotal: 0, discount: 0, delivery_fee: 0, total_amount: 0 }
    });
  },

  // 6. Wishlist Actions
  toggleWishlist: async (product) => {
    sounds.playClick();
    const isPresent = get().wishlist.some((p) => p.id === product.id);
    if (isPresent) {
      set({ wishlist: get().wishlist.filter((p) => p.id !== product.id) });
      get().addToast('Removed from Wishlist', product.name, 'info');
    } else {
      set({ wishlist: [...get().wishlist, product] });
      get().addToast('Added to Wishlist', product.name, 'success');
    }
  },

  // 7. Modals
  toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),
  setCheckoutOpen: (open) => set({ checkoutOpen: open }),
  setOrderSuccessOpen: (open, order = null) => set({ orderSuccessOpen: open, lastOrder: order }),
  closeOrderSuccess: () => set({ orderSuccessOpen: false, lastOrder: null }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setQuickNavOpen: (open) => set({ quickNavOpen: open }),

  // 8. Search & Teleport System
  flipkartLiveResults: [],
  flipkartLiveLoading: false,
  flipkartLiveHasApiKey: false,

  fetchFlipkartLive: async (query) => {
    set({ flipkartLiveLoading: true });
    try {
      const data = await api.searchFlipkartLive(query);
      set({
        flipkartLiveResults: data.results || [],
        flipkartLiveHasApiKey: !!data.has_api_key,
        flipkartLiveLoading: false
      });
    } catch (err) {
      set({ flipkartLiveLoading: false });
    }
  },

  importAndInspectFlipkartProduct: async (productData) => {
    try {
      get().addToast('Importing to 3D Mall', `Binding 3D model for ${productData.title}...`, 'info');
      const resp = await api.importFlipkartProduct(productData);
      const newProduct = resp.product;
      
      // Add to local product list if not present
      set((state) => ({
        products: [newProduct, ...state.products.filter((p) => p.slug !== newProduct.slug)],
        searchOpen: false
      }));

      get().addToast('3D Model Ready', `${newProduct.name} placed in showroom!`, 'success');

      // Instantly jump to floor and open 3D inspector
      const floorNum = newProduct.floor_number !== undefined ? newProduct.floor_number : (newProduct.floor?.floor_number ?? 1);
      get().instantJumpToFloor(floorNum);
      setTimeout(() => {
        get().openProductInspect(newProduct);
      }, 400);
    } catch (err) {
      get().addToast('Import Failed', 'Could not import product to 3D mall.', 'warn');
    }
  },

  searchProducts: (query) => {
    set({ searchQuery: query });
    if (!query || !query.trim()) {
      set({ searchResults: [] });
      return;
    }
    const q = query.toLowerCase().trim();
    const results = get().products.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchBrand = p.brand?.toLowerCase().includes(q);
      const matchCat = p.category?.name?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      return matchName || matchBrand || matchCat || matchDesc;
    });
    set({ searchResults: results });
  },

  teleportToProduct: (product) => {
    sounds.playPortalWhoosh();
    set({ searchOpen: false });
    const productFloor = product.floor_number !== undefined ? product.floor_number : (product.floor || 1);
    
    // If not already on product's floor, ride elevator there
    if (get().currentFloor !== productFloor || get().phase !== 'showroom') {
      get().travelToFloor(productFloor);
      setTimeout(() => {
        get().openProductInspect(product);
      }, 5500);
    } else {
      get().openProductInspect(product);
    }
  },

  // 9. Checkout Flow
  processCheckout: async (formData) => {
    try {
      const order = await api.checkout(formData);
      sounds.playOrderSuccess();
      set({
        lastOrder: order,
        checkoutOpen: false,
        cartOpen: false,
        orderSuccessOpen: true,
        cart: { items: [], total_items: 0, subtotal: 0, discount: 0, delivery_fee: 0, total_amount: 0 }
      });
      return order;
    } catch (err) {
      console.warn('API checkout failed, creating local order confirmation:', err);
      const mockOrder = {
        order_number: 'FK3D-' + Math.floor(100000 + Math.random() * 900000),
        tracking_number: 'FKT-' + Date.now().toString(36).toUpperCase(),
        full_name: formData.full_name || 'Valued Customer',
        city: formData.city || 'Bengaluru',
        payment_method: formData.payment_method || 'UPI',
        payment_status: 'PAID',
        total_amount: get().cart.total_amount || 144900
      };
      sounds.playOrderSuccess();
      set({
        lastOrder: mockOrder,
        checkoutOpen: false,
        cartOpen: false,
        orderSuccessOpen: true,
        cart: { items: [], total_items: 0, subtotal: 0, discount: 0, delivery_fee: 0, total_amount: 0 }
      });
      return mockOrder;
    }
  }
}));

// Export both useExperienceStore and useStore for backwards-compatibility
export const useStore = useExperienceStore;
export default useExperienceStore;
