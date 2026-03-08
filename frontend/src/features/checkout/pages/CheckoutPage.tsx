import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/context/CartContext';
import { useAuth } from '../../auth/context/AuthContext';
import { formatPrice } from '../../products/services/productsApi';
import { 
  createPaymentPreference, 
  getMercadoPagoUrl, 
  openMercadoPagoPopup,
  checkOrderStatus,
  type OrderStatusResponse
} from '../services/checkoutApi';
import { getImageUrl } from '../../../lib/imageUtils';
import type { PayerInfo } from '../../../types';


export default function CheckoutPage() {
  const { items, getTotal, getTotalItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [orderDetails, setOrderDetails] = useState<OrderStatusResponse['orderDetails'] | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popupRef = useRef<Window | null>(null);
  const orderIdsRef = useRef<string[]>([]);
  
  const [payerInfo, setPayerInfo] = useState<PayerInfo>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.telefono || ''
  });

  // Limpiar polling al desmontar
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Actualizar datos del pagador cuando el usuario cambie
  useEffect(() => {
    if (user) {
      setPayerInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.telefono || ''
      });
    }
  }, [user]);

  // Función para verificar el estado del pago
  const checkPayment = useCallback(async () => {
    if (orderIdsRef.current.length === 0) return;
    
    try {
      const result = await checkOrderStatus(orderIdsRef.current);
      
      if (result.status === 'approved') {
        // Pago exitoso
        setPaymentStatus('success');
        setOrderDetails(result.orderDetails);
        setPaymentId(result.paymentId);
        clearCart();
        
        // Detener polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        
        // Cerrar popup si está abierto
        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close();
        }
      } else if (result.status === 'rejected') {
        // Pago rechazado
        setPaymentStatus('failed');
        setError('El pago fue rechazado. Por favor, intenta con otro medio de pago.');
        
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
      // Si está pending, seguir haciendo polling
    } catch (err) {
      console.error('Error verificando pago:', err);
    }
  }, [clearCart]);

  // Verificar si el popup se cerró
  useEffect(() => {
    if (paymentStatus === 'processing' && popupRef.current) {
      const checkPopupClosed = setInterval(() => {
        if (popupRef.current?.closed) {
          clearInterval(checkPopupClosed);
          // Hacer una última verificación
          checkPayment();
        }
      }, 500);
      
      return () => clearInterval(checkPopupClosed);
    }
  }, [paymentStatus, checkPayment]);

  // Redirigir si el carrito está vacío (solo si no estamos procesando)
  if (items.length === 0 && paymentStatus === 'idle') {
    navigate('/carrito');
    return null;
  }

  const handleInputChange = (field: keyof PayerInfo, value: string) => {
    setPayerInfo({ ...payerInfo, [field]: value });
  };

  const handleCheckout = async () => {
    // Validar datos del comprador
    if (!payerInfo.email) {
      setError('El email es requerido');
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentStatus('idle');

    try {
      // Preparar items para enviar
      const checkoutItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));

      // Crear preferencia de pago
      const preference = await createPaymentPreference(checkoutItems, payerInfo);
      
      // Guardar orderIds para polling
      orderIdsRef.current = preference.orderIds.map(String);

      // Obtener URL de MP
      const mpUrl = getMercadoPagoUrl(preference);
      
      // Abrir en ventana emergente
      popupRef.current = openMercadoPagoPopup(mpUrl);
      
      if (!popupRef.current) {
        // Si el popup fue bloqueado, redirigir normalmente
        window.location.href = mpUrl;
        return;
      }

      // Cambiar estado a procesando
      setPaymentStatus('processing');
      setLoading(false);

      // Iniciar polling cada 3 segundos
      pollingIntervalRef.current = setInterval(checkPayment, 3000);
      
    } catch (err: unknown) {
      console.error('Error en checkout:', err);
      if (err instanceof Error) {
        setError(err.message || 'Error al procesar el pago. Intenta de nuevo.');
      } else {
        setError('Error al procesar el pago. Intenta de nuevo.');
      }
      setPaymentStatus('idle');
      setLoading(false);
    }
  };

  // Si el pago fue exitoso, mostrar pantalla de éxito
  if (paymentStatus === 'success') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          {/* Icono de éxito animado */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Pago exitoso!
          </h1>

          <p className="text-gray-600 mb-6">
            Tu compra ha sido procesada correctamente. Te hemos enviado un email de confirmación con los detalles.
          </p>

          {/* Detalles */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">Resumen de tu compra</h2>
            
            {paymentId && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">ID de pago:</span>
                <span className="font-medium">{paymentId}</span>
              </div>
            )}
            
            {orderDetails && (
              <>
                <div className="py-4 space-y-2">
                  {orderDetails.products.map((product, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{product.name} x{product.quantity}</span>
                      <span className="font-medium">{formatPrice(product.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">{formatPrice(orderDetails.total)}</span>
                </div>
              </>
            )}
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/mis-pedidos')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Ver mis pedidos
            </button>
            <button
              onClick={() => navigate('/productos')}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
            >
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si estamos procesando el pago
  if (paymentStatus === 'processing') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          {/* Animación de procesamiento */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Procesando tu pago...
          </h2>
          
          <p className="text-gray-600 mb-6">
            Completa el pago en la ventana de Mercado Pago.<br/>
            Esta página se actualizará automáticamente.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> Si no ves la ventana de pago, revisa si tu navegador 
              bloqueó la ventana emergente.
            </p>
          </div>

          {/* Botón para abrir de nuevo */}
          <button
            onClick={() => {
              if (popupRef.current && !popupRef.current.closed) {
                popupRef.current.focus();
              }
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Abrir ventana de pago
          </button>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                if (pollingIntervalRef.current) {
                  clearInterval(pollingIntervalRef.current);
                }
                if (popupRef.current && !popupRef.current.closed) {
                  popupRef.current.close();
                }
                setPaymentStatus('idle');
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Cancelar y volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Información del comprador */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Información de contacto
            </h2>

            {!isAuthenticated && (
              <p className="text-sm text-gray-500 mb-4">
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => navigate('/login?redirect=/checkout')}
                  className="text-blue-600 hover:underline"
                >
                  Inicia sesión
                </button>
              </p>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={payerInfo.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={payerInfo.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={payerInfo.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </div>
          </div>

          {/* Información sobre el pago */}
          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <h3 className="font-medium text-blue-900 mb-2">Pago seguro</h3>
            <p className="text-sm text-blue-700">
              El pago se procesa de forma segura a través de Mercado Pago.
              Se abrirá una ventana para completar el pago.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
              <span className="text-sm text-blue-700">
                Protección al comprador garantizada
              </span>
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Resumen del pedido
            </h2>

            {/* Lista de productos */}
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {items.map((item) => {
                const price = item.product.precio_oferta || item.product.precio;
                const imageUrl = getImageUrl(item.product.imagen);
                return (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.product.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900 text-sm line-clamp-2">
                        {item.product.nombre}
                      </p>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(price * item.quantity)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totales */}
            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({getTotalItems()} productos)</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span className="text-green-600">Gratis</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(getTotal())}</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Botón de pago */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-6 bg-[#009ee3] hover:bg-[#007eb5] text-white py-3 px-4 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Iniciando pago...
                </>
              ) : (
                <>
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" fill="white"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="#009ee3"/>
                  </svg>
                  <span>Pagar con Mercado Pago</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Se abrirá una ventana segura de Mercado Pago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
