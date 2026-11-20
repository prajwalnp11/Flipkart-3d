// API Service for Flipkart 3D Mall
// Seamless integration with Django REST Framework backend

const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) return '/api';
  return envUrl.endsWith('/api') ? envUrl : envUrl.replace(/\/$/, '') + '/api';
};

const API_BASE = getApiBase();

// Generate or retrieve persistent anonymous session ID for cart
function getSessionId() {
  let sid = localStorage.getItem('fk3d_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('fk3d_session_id', sid);
  }
  return sid;
}

function getAuthHeaders() {
  const token = localStorage.getItem('fk3d_token');
  const headers = {
    'Content-Type': 'application/json',
    'X-Session-ID': getSessionId(),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Floors
  async getFloors() {
    try {
      const res = await fetch(`${API_BASE}/floors/`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch floors');
      return await res.json();
    } catch (err) {
      console.warn('API getFloors fallback:', err.message);
      return [];
    }
  },

  // Categories
  async getCategories(floorNumber = null) {
    try {
      const url = floorNumber !== null 
        ? `${API_BASE}/categories/?floor=${floorNumber}` 
        : `${API_BASE}/categories/`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch categories');
      return await res.json();
    } catch (err) {
      console.warn('API getCategories fallback:', err.message);
      return [];
    }
  },

  // Products
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.floor !== undefined && params.floor !== null) query.append('floor', params.floor);
      if (params.category) query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.featured) query.append('featured', 'true');

      const res = await fetch(`${API_BASE}/products/?${query.toString()}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (err) {
      console.warn('API getProducts fallback:', err.message);
      return [];
    }
  },

  // Product Detail
  async getProductDetail(slug) {
    try {
      const res = await fetch(`${API_BASE}/products/${slug}/`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch product detail');
      return await res.json();
    } catch (err) {
      console.warn('API getProductDetail fallback:', err.message);
      return null;
    }
  },

  // Add Product Review
  async addReview(slug, reviewData) {
    try {
      const res = await fetch(`${API_BASE}/products/${slug}/add_review/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reviewData)
      });
      return await res.json();
    } catch (err) {
      console.error('Error adding review:', err);
      return null;
    }
  },

  // Cart
  async getCart() {
    try {
      const res = await fetch(`${API_BASE}/cart/`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch cart');
      return await res.json();
    } catch (err) {
      console.warn('API getCart fallback:', err.message);
      return { items: [], total_items: 0, subtotal: 0, discount: 0, delivery_fee: 0, total_amount: 0 };
    }
  },

  async addToCart(productId, variantId = null, quantity = 1) {
    try {
      const res = await fetch(`${API_BASE}/cart/items/add/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ product_id: productId, variant_id: variantId, quantity })
      });
      return await res.json();
    } catch (err) {
      console.error('API addToCart error:', err);
      return null;
    }
  },

  async updateCartItem(itemId, quantity) {
    try {
      const res = await fetch(`${API_BASE}/cart/items/${itemId}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity })
      });
      return await res.json();
    } catch (err) {
      console.error('API updateCartItem error:', err);
      return null;
    }
  },

  async removeCartItem(itemId) {
    try {
      const res = await fetch(`${API_BASE}/cart/items/${itemId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch (err) {
      console.error('API removeCartItem error:', err);
      return null;
    }
  },

  async clearCart() {
    try {
      const res = await fetch(`${API_BASE}/cart/clear/`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Wishlist
  async getWishlist() {
    try {
      const res = await fetch(`${API_BASE}/cart/wishlist/`, { headers: getAuthHeaders() });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async toggleWishlist(productId) {
    try {
      const res = await fetch(`${API_BASE}/cart/wishlist/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ product_id: productId })
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Checkout
  async checkout(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders/checkout/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Checkout failed');
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  },

  // Authentication
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    if (data.tokens && data.tokens.access) {
      localStorage.setItem('fk3d_token', data.tokens.access);
    }
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Registration failed');
    const data = await res.json();
    if (data.tokens && data.tokens.access) {
      localStorage.setItem('fk3d_token', data.tokens.access);
    }
    return data;
  },

  logout() {
    localStorage.removeItem('fk3d_token');
  }
};
