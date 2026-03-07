import api from '../../../lib/api';

const API_URL = '/admin';

// Dashboard
export const getDashboardStats = async () => {
  const response = await api.get(`${API_URL}/dashboard`);
  return response.data.data;
};

// Productos
export const getAdminProducts = async (page = 1, limit = 10, filters?: {
  search?: string;
  category?: number;
  status?: string;
}) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.category) params.append('category', filters.category.toString());
  if (filters?.status !== undefined) params.append('status', filters.status);
  
  const response = await api.get(`${API_URL}/products?${params.toString()}`);
  return response.data.data;
};

export const createProduct = async (formData: FormData) => {
  // Debug: mostrar contenido del FormData
  console.log('=== CREATING PRODUCT ===');
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  
  const response = await api.post(`${API_URL}/products`, formData);
  return response.data.data;
};

export const updateProduct = async (id: number, formData: FormData) => {
  const response = await api.put(`${API_URL}/products/${id}`, formData);
  return response.data.data;
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`${API_URL}/products/${id}`);
  return response.data;
};

// Órdenes
export const getAdminOrders = async (page = 1, limit = 10, filters?: {
  status?: string;
  payment_status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (filters?.status) params.append('status', filters.status);
  if (filters?.payment_status) params.append('payment_status', filters.payment_status);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters?.dateTo) params.append('dateTo', filters.dateTo);
  
  const response = await api.get(`${API_URL}/orders?${params.toString()}`);
  return response.data.data;
};

export const getOrderDetail = async (id: number) => {
  const response = await api.get(`${API_URL}/orders/${id}`);
  return response.data.data;
};

export const updateOrderStatus = async (id: number, estado: string) => {
  const response = await api.patch(`${API_URL}/orders/${id}/status`, { estado });
  return response.data.data;
};

// Categorías
export const getAdminCategories = async () => {
  const response = await api.get(`${API_URL}/categories`);
  return response.data.data;
};

export const createCategory = async (data: { nombre: string; descripcion?: string }) => {
  const response = await api.post(`${API_URL}/categories`, data);
  return response.data.data;
};

export const updateCategory = async (id: number, data: { nombre?: string; descripcion?: string; activa?: boolean }) => {
  const response = await api.put(`${API_URL}/categories/${id}`, data);
  return response.data.data;
};

export const deleteCategory = async (id: number) => {
  const response = await api.delete(`${API_URL}/categories/${id}`);
  return response.data;
};
