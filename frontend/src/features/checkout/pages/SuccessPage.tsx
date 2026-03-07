import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../cart/context/CartContext';
import { confirmPaymentSuccess } from '../services/checkoutApi';

interface OrderDetails {
  products: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  buyerEmail: string;
}

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
  const status = searchParams.get('status') || searchParams.get('collection_status');
  const externalReference = searchParams.get('external_reference');

  // Confirmar pago y limpiar carrito al cargar
  useEffect(() => {
    const confirmPayment = async () => {
      try {
        // Obtener todos los params de la URL
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        // Llamar al backend para confirmar y actualizar stock
        const result = await confirmPaymentSuccess(params);
        
        if (result.orderDetails) {
          setOrderDetails(result.orderDetails);
        }
        
        setConfirmed(true);
        
        // Limpiar carrito después de confirmación exitosa
        clearCart();
      } catch (error) {
        console.error('Error confirmando pago:', error);
        // Aún así limpiar el carrito si el pago fue exitoso en MP
        if (status === 'approved') {
          clearCart();
        }
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams, clearCart, status]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando tu compra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        {/* Icono de éxito */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Pago exitoso!
        </h1>

        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente. 
          {confirmed && ' Te hemos enviado un email de confirmación con los detalles de tu compra.'}
        </p>

        {/* Detalles de la transacción */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
          <h2 className="font-semibold text-gray-900 mb-3">Detalles de la transacción</h2>
          <div className="space-y-2 text-sm">
            {paymentId && (
              <div className="flex justify-between">
                <span className="text-gray-600">ID de pago:</span>
                <span className="font-medium">{paymentId}</span>
              </div>
            )}
            {status && (
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="font-medium text-green-600">
                  {status === 'approved' ? 'Aprobado' : status}
                </span>
              </div>
            )}
            {externalReference && (
              <div className="flex justify-between">
                <span className="text-gray-600">N de orden:</span>
                <span className="font-medium">{externalReference}</span>
              </div>
            )}
          </div>

          {/* Detalle de productos si está disponible */}
          {orderDetails && orderDetails.products.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Productos comprados:</h3>
              {orderDetails.products.map((product, index) => (
                <div key={index} className="flex justify-between text-sm py-1">
                  <span className="text-gray-600">{product.name} x{product.quantity}</span>
                  <span className="font-medium">${product.price.toLocaleString('es-CL')}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span>${orderDetails.total.toLocaleString('es-CL')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/mis-pedidos"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Ver mis pedidos
          </Link>
          <Link
            to="/productos"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
