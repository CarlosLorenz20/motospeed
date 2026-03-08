import api from '../../../lib/api';
import type { Product, Category, ApiResponse, PaginatedResponse } from '../../../types';

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  marca?: string;
  destacado?: boolean;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
}

// Obtener todos los productos con filtros y paginación
export const getProducts = async (
  page: number = 1,
  limit: number = 12,
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.marca) params.append('marca', filters.marca);
  if (filters.destacado) params.append('destacado', 'true');
  if (filters.orderBy) params.append('orderBy', filters.orderBy);
  if (filters.order) params.append('order', filters.order);

  const response = await api.get<PaginatedResponse<Product>>(`/products?${params.toString()}`);
  return response.data;
};

// Obtener un producto por ID o slug
export const getProduct = async (idOrSlug: string): Promise<Product> => {
  const response = await api.get<ApiResponse<{ product: Product }>>(`/products/${idOrSlug}`);
  return response.data.data.product;
};

// Obtener productos destacados
export const getFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
  const response = await api.get<ApiResponse<{ products: Product[] }>>(`/products/featured?limit=${limit}`);
  return response.data.data.products;
};

// Obtener productos por categoría
export const getProductsByCategory = async (
  categorySlug: string,
  page: number = 1,
  limit: number = 12
): Promise<PaginatedResponse<Product> & { category: Category }> => {
  const response = await api.get<PaginatedResponse<Product> & { category: Category }>(
    `/products/category/${categorySlug}?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Obtener todas las categorías
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<ApiResponse<{ categories: Category[] }>>('/products/categories');
  return response.data.data.categories;
};

// Buscar productos
export const searchProducts = async (query: string, limit: number = 10): Promise<Product[]> => {
  const response = await api.get<ApiResponse<{ products: Product[] }>>(
    `/products/search?q=${encodeURIComponent(query)}&limit=${limit}`
  );
  return response.data.data.products;
};

// Formatear precio (CLP)
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Obtener precio final (oferta o normal)
export const getFinalPrice = (product: Product): number => {
  return product.precio_oferta || product.precio;
};

// Verificar si tiene descuento
export const hasDiscount = (product: Product): boolean => {
  return !!product.precio_oferta && product.precio_oferta < product.precio;
};

// Calcular porcentaje de descuento
export const getDiscountPercent = (product: Product): number => {
  if (!hasDiscount(product)) return 0;
  return Math.round(((product.precio - product.precio_oferta!) / product.precio) * 100);
};
