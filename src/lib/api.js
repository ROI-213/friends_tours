/**
 * Friends Tours & Travels - API Client
 * Direct PostgreSQL backend communication. Pure PostgreSQL.
 */

export function getApiBase() {
  if (typeof window !== 'undefined') {
    // 1. Explicit window override (can be injected in index.html if needed)
    if (window.__API_URL__) {
      return window.__API_URL__.replace(/\/+$/, '');
    }

    // 2. Custom localStorage override (for debugging or custom API endpoint)
    const stored = localStorage.getItem('ft_custom_api_url');
    if (stored) {
      return stored.replace(/\/+$/, '');
    }

    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0';

    const envUrl = import.meta.env.VITE_API_URL;

    // 3. When running on ANY live domain / production server (not localhost):
    if (!isLocalhost) {
      // If VITE_API_URL is an explicit remote server URL (not localhost), use it:
      if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
        return envUrl.replace(/\/+$/, '');
      }
      // On live domains, ALWAYS use relative '/api' - this guarantees:
      // - Zero CORS issues
      // - Zero Mixed-Content HTTPS issues
      // - Works automatically across any domain, subdomain, or IP
      return '/api';
    }

    // 4. On local development machine:
    return (envUrl || 'http://localhost:3001/api').replace(/\/+$/, '');
  }

  return (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/+$/, '');
}

export const API_BASE = getApiBase();

export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const base = getApiBase();
  if (base.startsWith('http://') || base.startsWith('https://')) {
    try {
      const urlObj = new URL(base);
      return `${urlObj.origin}${path.startsWith('/') ? '' : '/'}${path}`;
    } catch {
      // ignore
    }
  }
  return path;
}

function notifyLocalMutation(type, action) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ft:data-change', {
      detail: { type, action, timestamp: Date.now() }
    }));
  }
}

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('ft_admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = getApiBase();
  const url = `${base}${cleanPath}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    let response;
    try {
      response = await fetch(url, {
        cache: 'no-store',
        ...options,
        headers,
        signal: options.signal || controller.signal,
      });
    } catch (initialErr) {
      // If direct port connection had network error (or vice-versa), try alternate endpoint
      const alternateBase = base.includes('3001') ? '/api' : 'http://localhost:3001/api';
      const alternateUrl = `${alternateBase}${cleanPath}`;
      try {
        response = await fetch(alternateUrl, {
          cache: 'no-store',
          ...options,
          headers,
          signal: options.signal || controller.signal,
        });
      } catch {
        throw initialErr;
      }
    }

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      if (contentType.includes('application/json')) {
        const err = await response.json().catch(() => ({ error: `HTTP ${response.status}: Request failed` }));
        if (response.status === 401 && path.startsWith('/admin') && path !== '/admin/login') {
          localStorage.removeItem('ft_admin_token');
        }
        throw new Error(err.error || `HTTP ${response.status}`);
      } else {
        const text = await response.text().catch(() => '');
        throw new Error(`Server returned HTTP ${response.status}: ${text.substring(0, 120)}`);
      }
    }

    if (!contentType.includes('application/json')) {
      const text = await response.text().catch(() => '');
      if (text.includes('<!doctype') || text.includes('<html')) {
        throw new Error(
          'API returned HTML instead of JSON. Ensure your Node.js backend server is running on port 3001 and /api is properly routed.'
        );
      }
      throw new Error(`Unexpected server response: ${text.substring(0, 100)}`);
    }

    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Server took too long to respond. Please check your connection.');
    }
    throw err;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export const api = {
  // Vehicles
  getVehicles: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/vehicles${qs ? '?' + qs : ''}`);
  },
  getVehicle: (slug) => apiFetch(`/vehicles/${slug}`),

  // Packages
  getPackages: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/packages${qs ? '?' + qs : ''}`);
  },
  getPackage: (slug) => apiFetch(`/packages/${slug}`),

  // Enquiries
  submitEnquiry: (data) => apiFetch('/enquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  checkBookingStatus: (ref) => apiFetch(`/enquiries/status/${ref}`),

  // Testimonials
  getTestimonials: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/testimonials${qs ? '?' + qs : ''}`);
  },
  submitTestimonial: (data) => apiFetch('/testimonials', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Gallery
  getGallery: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/gallery${qs ? '?' + qs : ''}`);
  },

  // ── Public live data (admin-managed, no auth) ───────────────────────────────
  getLocalTariffs: () => apiFetch('/public/tariffs/local'),
  getOutstationTariffs: () => apiFetch('/public/tariffs/outstation'),
  getServices: () => apiFetch('/public/services'),
  getAirportAreas: () => apiFetch('/public/airport-areas'),
  getOutstationDestinations: () => apiFetch('/public/outstation-destinations'),
  getSiteSettings: () => apiFetch('/public/settings'),

  /**
   * Subscribe to server-side data mutations (Server-Sent Events) with fallback polling.
   * Ensures instant updates across all connected browsers, windows, and devices.
   */
  subscribeToSync: (onEvent) => {
    if (typeof window === 'undefined') return () => {};

    let evtSource = null;
    let pollInterval = null;
    let currentVersion = null;
    let isSubscribed = true;
    let reconnectTimeout = null;

    const base = getApiBase();

    const connectSSE = () => {
      if (!isSubscribed) return;
      try {
        const sseUrl = `${base}/public/events`;
        evtSource = new EventSource(sseUrl);

        evtSource.addEventListener('data-change', (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data.version) currentVersion = data.version;
            if (typeof onEvent === 'function') {
              onEvent(data);
            }
          } catch (err) {
            console.error('SSE data parse error:', err);
          }
        });

        evtSource.addEventListener('heartbeat', (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data.version && currentVersion !== null && data.version !== currentVersion) {
              currentVersion = data.version;
              if (typeof onEvent === 'function') {
                onEvent({ type: 'all', action: 'reload', version: data.version });
              }
            } else if (data.version) {
              currentVersion = data.version;
            }
          } catch (err) {}
        });

        evtSource.onerror = () => {
          if (evtSource) {
            evtSource.close();
            evtSource = null;
          }
          if (isSubscribed) {
            reconnectTimeout = setTimeout(connectSSE, 5000);
          }
        };
      } catch (err) {
        console.warn('SSE connection failed, relying on polling fallback:', err);
      }
    };

    const pollVersion = async () => {
      if (!isSubscribed) return;
      try {
        const res = await fetch(`${base}/public/version?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (res.ok) {
          const data = await res.json();
          if (currentVersion === null) {
            currentVersion = data.version;
          } else if (data.version > currentVersion) {
            currentVersion = data.version;
            if (typeof onEvent === 'function') {
              onEvent({ type: 'all', action: 'sync', version: data.version });
            }
          }
        }
      } catch (err) {
        // network error / offline, ignore
      }
    };

    connectSSE();
    pollInterval = setInterval(pollVersion, 25000);

    return () => {
      isSubscribed = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (evtSource) {
        evtSource.close();
        evtSource = null;
      }
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    };
  },
};


// ── Admin API ─────────────────────────────────────────────────────────────────

export const adminApi = {
  // Auth
  login: (email, password) => apiFetch('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  getMe: () => apiFetch('/admin/me'),

  // Dashboard
  getDashboard: () => apiFetch('/admin/dashboard'),

  // Enquiries
  getEnquiries: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/admin/enquiries${qs ? '?' + qs : ''}`);
  },
  updateEnquiry: (id, data) => apiFetch(`/admin/enquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteEnquiry: (id) => apiFetch(`/admin/enquiries/${id}`, { method: 'DELETE' }),

  // Vehicles
  getVehicles: () => apiFetch('/admin/vehicles'),
  createVehicle: async (data) => {
    const res = await apiFetch('/admin/vehicles', { method: 'POST', body: JSON.stringify(data) });
    notifyLocalMutation('vehicles', 'create');
    return res;
  },
  updateVehicle: async (id, data) => {
    const res = await apiFetch(`/admin/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    notifyLocalMutation('vehicles', 'update');
    return res;
  },
  deleteVehicle: async (id) => {
    const res = await apiFetch(`/admin/vehicles/${id}`, { method: 'DELETE' });
    notifyLocalMutation('vehicles', 'delete');
    return res;
  },

  // Packages
  getPackages: () => apiFetch('/admin/packages'),
  createPackage: async (data) => {
    const res = await apiFetch('/admin/packages', { method: 'POST', body: JSON.stringify(data) });
    notifyLocalMutation('packages', 'create');
    return res;
  },
  updatePackage: async (id, data) => {
    const res = await apiFetch(`/admin/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    notifyLocalMutation('packages', 'update');
    return res;
  },
  deletePackage: async (id) => {
    const res = await apiFetch(`/admin/packages/${id}`, { method: 'DELETE' });
    notifyLocalMutation('packages', 'delete');
    return res;
  },

  // Tariffs
  getLocalTariffs: () => apiFetch('/admin/tariff/local'),
  createLocalTariff: async (data) => {
    const res = await apiFetch('/admin/tariff/local', { method: 'POST', body: JSON.stringify(data) });
    notifyLocalMutation('tariffs', 'create');
    return res;
  },
  updateLocalTariff: async (id, data) => {
    const res = await apiFetch(`/admin/tariff/local/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    notifyLocalMutation('tariffs', 'update');
    return res;
  },
  deleteLocalTariff: async (id) => {
    const res = await apiFetch(`/admin/tariff/local/${id}`, { method: 'DELETE' });
    notifyLocalMutation('tariffs', 'delete');
    return res;
  },

  getOutstationTariffs: () => apiFetch('/admin/tariff/outstation'),
  createOutstationTariff: async (data) => {
    const res = await apiFetch('/admin/tariff/outstation', { method: 'POST', body: JSON.stringify(data) });
    notifyLocalMutation('tariffs', 'create');
    return res;
  },
  updateOutstationTariff: async (id, data) => {
    const res = await apiFetch(`/admin/tariff/outstation/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    notifyLocalMutation('tariffs', 'update');
    return res;
  },
  deleteOutstationTariff: async (id) => {
    const res = await apiFetch(`/admin/tariff/outstation/${id}`, { method: 'DELETE' });
    notifyLocalMutation('tariffs', 'delete');
    return res;
  },

  // Services
  getServices: () => apiFetch('/admin/services'),
  createService: async (data) => {
    const res = await apiFetch('/admin/services', { method: 'POST', body: JSON.stringify(data) });
    notifyLocalMutation('services', 'create');
    return res;
  },
  updateService: async (id, data) => {
    const res = await apiFetch(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    notifyLocalMutation('services', 'update');
    return res;
  },
  deleteService: async (id) => {
    const res = await apiFetch(`/admin/services/${id}`, { method: 'DELETE' });
    notifyLocalMutation('services', 'delete');
    return res;
  },

  // Airport Localities & Fares
  getAirportAreas: () => apiFetch('/admin/airport-areas'),
  createAirportArea: async (data) => {
    const res = await apiFetch('/admin/airport-areas', { method: 'POST', body: JSON.stringify(data) });
    notifyLocalMutation('airport-areas', 'create');
    return res;
  },
  updateAirportArea: async (id, data) => {
    const res = await apiFetch(`/admin/airport-areas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    notifyLocalMutation('airport-areas', 'update');
    return res;
  },
  deleteAirportArea: async (id) => {
    const res = await apiFetch(`/admin/airport-areas/${id}`, { method: 'DELETE' });
    notifyLocalMutation('airport-areas', 'delete');
    return res;
  },

  // Outstation Destinations
  getOutstationDestinations: () => apiFetch('/admin/outstation-destinations'),
  createOutstationDestination: async (data) => {
    const res = await apiFetch('/admin/outstation-destinations', { method: 'POST', body: JSON.stringify(data) });
    notifyLocalMutation('outstation-destinations', 'create');
    return res;
  },
  updateOutstationDestination: async (id, data) => {
    const res = await apiFetch(`/admin/outstation-destinations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    notifyLocalMutation('outstation-destinations', 'update');
    return res;
  },
  deleteOutstationDestination: async (id) => {
    const res = await apiFetch(`/admin/outstation-destinations/${id}`, { method: 'DELETE' });
    notifyLocalMutation('outstation-destinations', 'delete');
    return res;
  },

  // Testimonials
  getTestimonials: () => apiFetch('/admin/testimonials'),
  createTestimonial: async (data) => {
    const res = await apiFetch('/admin/testimonials', { method: 'POST', body: JSON.stringify(data) });
    notifyLocalMutation('testimonials', 'create');
    return res;
  },
  updateTestimonial: async (id, data) => {
    const res = await apiFetch(`/admin/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    notifyLocalMutation('testimonials', 'update');
    return res;
  },
  deleteTestimonial: async (id) => {
    const res = await apiFetch(`/admin/testimonials/${id}`, { method: 'DELETE' });
    notifyLocalMutation('testimonials', 'delete');
    return res;
  },

  // Gallery
  getGallery: () => apiFetch('/admin/gallery'),
  addGalleryItem: async (data) => {
    const res = await apiFetch('/admin/gallery', { method: 'POST', body: JSON.stringify(data) });
    notifyLocalMutation('gallery', 'create');
    return res;
  },
  deleteGalleryItem: async (id) => {
    const res = await apiFetch(`/admin/gallery/${id}`, { method: 'DELETE' });
    notifyLocalMutation('gallery', 'delete');
    return res;
  },

  // Settings
  getSettings: () => apiFetch('/admin/settings'),
  updateSettings: async (settings) => {
    const res = await apiFetch('/admin/settings', { method: 'PUT', body: JSON.stringify({ settings }) });
    notifyLocalMutation('settings', 'update');
    return res;
  },

  // Messages
  getMessages: () => apiFetch('/admin/messages'),

  // Upload
  uploadImage: async (file, options = {}) => {
    const token = localStorage.getItem('ft_admin_token');
    const formData = new FormData();
    formData.append('image', file);
    if (options.category) formData.append('category', options.category);
    if (options.title) formData.append('title', options.title);
    if (options.save_to_gallery) formData.append('save_to_gallery', 'true');

    const base = getApiBase();
    const response = await fetch(`${base}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Upload failed');
    }
    const result = await response.json();
    if (options.save_to_gallery) {
      notifyLocalMutation('gallery', 'create');
    }
    return result;
  },
};

export default api;
