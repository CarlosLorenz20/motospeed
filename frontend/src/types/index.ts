// Tipos para usuarios
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'cliente' | 'admin';
  telefono?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Tipos para categorías
export interface Category {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  icono?: string;
  activa: boolean;
  productCount?: number;
}

// Tipos para productos
export interface Product {
  id: number;
  category_id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  sku?: string;
  precio: number;
  precio_oferta?: number;
  // Aliases para compatibilidad
  precio_descuento?: number; // alias de precio_oferta
  imagen_url?: string; // alias de imagen
  descuento?: number; // calculado
  modelo?: string; // alias de modelo_compatible
  stock: number;
  imagen?: string;
  imagenes_adicionales?: string[];
  marca?: string;
  modelo_compatible?: string;
  destacado: boolean;
  activo: boolean;
  category?: Category;
  created_at: string;
  updated_at: string;
}

// Tipos para órdenes
export interface Order {
  id: number;
  user_id?: number;
  product_id?: number;
  quantity: number;
  mp_preference_id?: string;
  mp_payment_id?: string;
  mp_merchant_order_id?: string;
  mp_payment_type?: string;
  status: 'pending' | 'approved' | 'in_process' | 'rejected' | 'cancelled' | 'refunded';
  amount: number;
  currency: string;
  buyer_name?: string;
  buyer_email?: string;
  buyer_phone?: string;
  metadata?: Record<string, unknown>;
  product?: Product;
  user?: User;
  created_at: string;
  updated_at: string;
}

// Tipos para el carrito
export interface CartItem {
  product: Product;
  quantity: number;
}

// Tipos para respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para Mercado Pago
export interface PaymentPreference {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
  orderIds: number[];
  totalAmount: number;
}

export interface PayerInfo {
  name?: string;
  email?: string;
  phone?: string;
}

export interface CheckoutItem {
  productId: number;
  quantity: number;
}
