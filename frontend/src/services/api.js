const API_BASE = '/api';

function getAuthHeaders() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('pngpoint_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  };
  
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Request failed');
  }
  
  return response.json();
}

export async function login(email, password) {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function register(data) {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function getProfile() {
  return fetchAPI('/auth/me');
}

export async function updateProfile(data) {
  return fetchAPI('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function changePassword(currentPassword, newPassword) {
  return fetchAPI('/auth/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword })
  });
}

export async function getCategories() {
  return fetchAPI('/categories');
}

export async function getCategoryBySlug(slug) {
  return fetchAPI(`/categories/${slug}`);
}

export async function getImages(params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/images?${query}`);
}

export async function getImageBySlug(slug) {
  return fetchAPI(`/images/${slug}`);
}

export async function searchImages(q, page = 1, limit = 20) {
  return fetchAPI(`/images/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
}

export async function getTrendingImages(limit = 10) {
  return fetchAPI(`/images/trending?limit=${limit}`);
}

export async function downloadImage(slug) {
  return fetchAPI(`/images/${slug}/download`, { method: 'POST' });
}

export async function getContributorDashboard() {
  return fetchAPI('/contributor/dashboard');
}

export async function getContributorImages(params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/contributor/images?${query}`);
}

export async function uploadImage(formData) {
  return fetchAPI('/contributor/upload', {
    method: 'POST',
    body: formData,
    headers: {}
  });
}

export async function updateContributorImage(id, data) {
  return fetchAPI(`/contributor/images/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteContributorImage(id) {
  return fetchAPI(`/contributor/images/${id}`, { method: 'DELETE' });
}

export async function getAdminStats() {
  return fetchAPI('/admin/stats');
}

export async function getAdminImages(params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/admin/images?${query}`);
}

export async function updateImageStatus(id, data) {
  return fetchAPI(`/admin/images/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function updateImageKeywords(id, keywords) {
  return fetchAPI(`/admin/images/${id}/keywords`, {
    method: 'PUT',
    body: JSON.stringify({ keywords })
  });
}

export async function bulkUpdateImages(imageIds, status) {
  return fetchAPI('/admin/images/bulk-update', {
    method: 'POST',
    body: JSON.stringify({ imageIds, status })
  });
}

export async function deleteAdminImage(id) {
  return fetchAPI(`/admin/images/${id}`, { method: 'DELETE' });
}

export async function getAdminUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/admin/users?${query}`);
}

export async function updateUserRole(id, data) {
  return fetchAPI(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function createCategory(data) {
  return fetchAPI('/categories', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateCategory(id, data) {
  return fetchAPI(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteCategory(id) {
  return fetchAPI(`/categories/${id}`, { method: 'DELETE' });
}

export async function createSubcategory(data) {
  return fetchAPI('/categories/subcategories', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateSubcategory(id, data) {
  return fetchAPI(`/categories/subcategories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteSubcategory(id) {
  return fetchAPI(`/categories/subcategories/${id}`, { method: 'DELETE' });
}

export async function fetchFiles() {
  try {
    const result = await getImages({ limit: 20 });
    return result;
  } catch {
    return { images: [] };
  }
}
