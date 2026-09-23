const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = `${API_URL}/api`;

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Lỗi yêu cầu: ${res.statusText}`);
  }
  return data;
}

export const api = {
  // Categories
  async getCategories() {
    const res = await request(`${API_BASE}/categories`);
    return res.data;
  },

  async createCategory({ name, color, icon }) {
    const res = await request(`${API_BASE}/categories`, {
      method: 'POST',
      body: JSON.stringify({ name, color, icon }),
    });
    return res.data;
  },

  async updateCategory(id, { name, color, icon }) {
    const res = await request(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, color, icon }),
    });
    return res.data;
  },

  async deleteCategory(id) {
    const res = await request(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
    });
    return res;
  },

  // Links
  async getLinks({ category_id, search } = {}) {
    const params = new URLSearchParams();
    if (category_id !== undefined && category_id !== null && category_id !== '') {
      params.append('category_id', category_id);
    }
    if (search) {
      params.append('search', search);
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await request(`${API_BASE}/links${queryString}`);
    return res.data;
  },

  async createLink({ name, url, category_id }) {
    const res = await request(`${API_BASE}/links`, {
      method: 'POST',
      body: JSON.stringify({ name, url, category_id: category_id || null }),
    });
    return res.data;
  },

  async updateLink(id, { name, url, category_id }) {
    const res = await request(`${API_BASE}/links/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, url, category_id: category_id !== undefined ? category_id : null }),
    });
    return res.data;
  },

  async deleteLink(id) {
    const res = await request(`${API_BASE}/links/${id}`, {
      method: 'DELETE',
    });
    return res;
  },

  // Health
  async checkHealth() {
    const res = await fetch(`${API_URL}/health`);
    return res.json();
  }
};
