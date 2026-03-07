import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../../products/services/productsApi';
import api from '../../../lib/api';
import type { Order, PaginatedResponse } from '../../../types';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    navigate('/login?redirect=/mis-pedidos');
    return null;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get<PaginatedResponse<Order>>(
          `/orders/my-orders?page=${pagination.page}&limit=${pagination.limit}`
        );
        setOrders(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        setError('Error al cargar los pedidos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pagination.page]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Aprobado' },
      in_process: { color: 'bg-blue-100 text-blue-800', text: 'En proceso' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rechazado' },
      cancelled: { color: 'bg-gray-100 text-gray-800', text: 'Cancelado' },
      refunded: { color: 'bg-purple-100 text-purple-800', text: 'Reembolsado' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FiPackage className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes pedidos todavía
          </h2>
          <p className="text-gray-600 mb-6">
            ¡Explora nuestros productos y realiza tu primera compra!
          </p>
          <Link
            to="/productos"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Imagen del producto */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {order.product?.imagen ? (
                      <img
                        src={order.product.imagen}
                        alt={order.product.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiPackage className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Info del pedido */}
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.product?.nombre || `Pedido #${order.id}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      Cantidad: {order.quantity} • Pedido #{order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Estado */}
                  {getStatusBadge(order.status)}

                  {/* Total */}
                  <p className="font-bold text-lg text-blue-600">
                    {formatPrice(order.amount)}
                  </p>
                </div>
              </div>

              {/* Información adicional */}
              {order.mp_payment_id && (
                <p className="mt-3 text-xs text-gray-500">
                  ID de pago: {order.mp_payment_id}
                </p>
              )}
            </div>
          ))}

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-4 py-2">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
