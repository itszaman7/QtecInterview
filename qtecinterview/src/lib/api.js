/**
 * API utility — wraps fetch with credentials for cookie-based auth.
 */
const API_BASE = '/api';

export async function api(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(url, config);
  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.error || 'API request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Auth
export const authAPI = {
  login: (email, password) => api('/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => api('/auth/logout', { method: 'POST' }),
  getMe: () => api('/auth/me'),
};

// Jobs
export const jobsAPI = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api(`/jobs${query ? `?${query}` : ''}`);
  },
  get: (id) => api(`/jobs/${id}`),
  create: (data) => api('/jobs', { method: 'POST', body: data }),
  delete: (id) => api(`/jobs/${id}`, { method: 'DELETE' }),
};

// Applications
export const applicationsAPI = {
  create: (job_id) => api('/applications', { method: 'POST', body: { job_id } }),
};

// User Auth (Applicant)
export const userAuthAPI = {
  register: (data) => api('/users/register', { method: 'POST', body: data }),
  login: (email, password) => api('/users/login', { method: 'POST', body: { email, password } }),
  logout: () => api('/users/logout', { method: 'POST' }),
  getMe: () => api('/users/me'),
  updateProfile: (data) => api('/users/profile', { method: 'PUT', body: data }),
};

// Company Auth
export const companyAuthAPI = {
  register: (data) => api('/company/register', { method: 'POST', body: data }),
  login: (email, password) => api('/company/login', { method: 'POST', body: { email, password } }),
  logout: () => api('/company/logout', { method: 'POST' }),
  getMe: () => api('/company/me'),
  updateProfile: (data) => api('/company/profile', { method: 'PUT', body: data }),
};

// Company Jobs
export const companyJobsAPI = {
  list: () => api('/company/jobs'),
  get: (id) => api(`/company/jobs/${id}`),
  create: (data) => api('/company/jobs', { method: 'POST', body: data }),
  update: (id, data) => api(`/company/jobs/${id}`, { method: 'PUT', body: data }),
  delete: (id) => api(`/company/jobs/${id}`, { method: 'DELETE' }),
  updateApplicationStatus: (id, status) => api(`/company/jobs/applications/${id}/status`, { method: 'PUT', body: { status } }),
};

// Admin Companies
export const adminCompaniesAPI = {
  list: () => api('/admin/companies'),
  verify: (id) => api(`/admin/companies/${id}/verify`, { method: 'PATCH' }),
};
