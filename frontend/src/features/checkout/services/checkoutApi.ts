import api from '../../../lib/api';
import type { PaymentPreference, CheckoutItem, PayerInfo, ApiResponse } from '../../../types';

// Crear preferencia de pago en Mercado Pago
export const createPaymentPreference = async (
  items: CheckoutItem[],
  payer?: PayerInfo,
  metadata?: Record<string, unknown>
): Promise<PaymentPreference> => {
  const response = await api.post<ApiResponse<PaymentPreference>>('/payments/create-preference', {
    items,
    payer,
    metadata
  });
  return response.data.data;
};

// Obtener estado de un pago
export const getPaymentStatus = async (paymentId: string) => {
  const response = await api.get<ApiResponse<{ payment: unknown }>>(`/payments/status/${paymentId}`);
  return response.data.data.payment;
};

// Redirigir a Mercado Pago
export const redirectToMercadoPago = (initPoint: string) => {
  window.location.href = initPoint;
};

// Obtener URL de Mercado Pago (usar init_point normal, sandbox tiene bugs)
export const getMercadoPagoUrl = (preference: PaymentPreference): string => {
  // Usar init_point normal - con credenciales de cuenta de prueba
  // se puede pagar con tarjetas de prueba sin problemas
  console.log('MP URL:', preference.initPoint);
  return preference.initPoint;
};

// Confirmar pago exitoso (llamar después de regresar de MP)
export const confirmPaymentSuccess = async (params: {
  payment_id?: string;
  collection_id?: string;
  status?: string;
  collection_status?: string;
  external_reference?: string;
  payment_type?: string;
  merchant_order_id?: string;
  preference_id?: string;
}) => {
  const response = await api.get<ApiResponse<{
    paymentId: string;
    status: string;
    orderId: string;
    orderDetails?: {
      products: Array<{ name: string; quantity: number; price: number }>;
      total: number;
      buyerEmail: string;
    };
  }>>('/payments/success', { params });
  return response.data.data;
};

// Verificar estado de órdenes (para polling)
export interface OrderStatusResponse {
  status: 'pending' | 'approved' | 'rejected' | 'in_process';
  paymentId: string | null;
  orderDetails: {
    products: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    buyerEmail: string | null;
    buyerName: string | null;
  };
}

export const checkOrderStatus = async (orderIds: string[]): Promise<OrderStatusResponse> => {
  const response = await api.get<ApiResponse<OrderStatusResponse>>('/payments/check-orders', {
    params: { orderIds: orderIds.join(',') }
  });
  return response.data.data;
};

// Abrir Mercado Pago en ventana emergente
export const openMercadoPagoPopup = (url: string): Window | null => {
  const width = 500;
  const height = 700;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  
  return window.open(
    url,
    'MercadoPago',
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
  );
};
