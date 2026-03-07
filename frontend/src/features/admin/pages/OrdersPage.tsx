import { useState, useEffect } from 'react';
import { 
  FiSearch, FiEye, FiChevronLeft, FiChevronRight, FiX,
  FiPackage, FiUser, FiDollarSign, FiTruck
} from 'react-icons/fi';
import { getAdminOrders, getOrderDetail, updateOrderStatus } from '../services/adminApi';

interface OrderItem {
  id: number;
  quantity: number;
  unit_price: number;
  product: {
    nombre: string;
    imagen: string;
  };
}

interface Order {
  id: number;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  mercadopago_id: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_phone: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    nombre: string;
    email: string;
  };
  items?: OrderItem[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700'
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  paid: 'Pagado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  failed: 'Fallido',
  refunded: 'Reembolsado'
};

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
  refunded: 'bg-blue-100 text-blue-700'
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');

  // Detail modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Update status
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, search, filterStatus, filterPayment]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await getAdminOrders(pagination.page, pagination.limit, {
        status: filterStatus || undefined,
        payment_status: filterPayment || undefined,
        search: search || undefined
      });
      setOrders(result.data);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId: number) => {
    setLoadingDetail(true);
    try {
      const order = await getOrderDetail(orderId);
      setSelectedOrder(order);
    } catch (err) {
      console.error('Error fetching order detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al actualizar estado');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600">Historial de compras y gestión de pedidos</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por email o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="processing">Procesando</option>
            <option value="paid">Pagado</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
            <option value="failed">Fallido</option>
          </select>
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Estado de pago</option>
            <option value="pending">Pago pendiente</option>
            <option value="approved">Pago aprobado</option>
            <option value="rejected">Pago rechazado</option>
            <option value="cancelled">Pago cancelado</option>
          </select>
          <button
            onClick={() => { setSearch(''); setFilterStatus(''); setFilterPayment(''); }}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <p className="text-sm text-yellow-600 font-medium">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-700">
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-sm text-green-600 font-medium">Pagados</p>
          <p className="text-2xl font-bold text-green-700">
            {orders.filter(o => o.status === 'paid').length}
          </p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-sm text-red-600 font-medium">Fallidos</p>
          <p className="text-2xl font-bold text-red-700">
            {orders.filter(o => o.status === 'failed' || o.status === 'cancelled').length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className="text-sm text-purple-600 font-medium">Enviados</p>
          <p className="text-2xl font-bold text-purple-700">
            {orders.filter(o => o.status === 'shipped' || o.status === 'delivered').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pago</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-4 py-4">
                      <div className="animate-pulse h-4 bg-gray-200 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-gray-900">#{order.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{order.user?.nombre || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">{formatPrice(order.total)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${paymentStatusColors[order.payment_status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.payment_status === 'approved' ? 'Aprobado' : 
                         order.payment_status === 'rejected' ? 'Rechazado' :
                         order.payment_status === 'pending' ? 'Pendiente' :
                         order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {(selectedOrder || loadingDetail) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="fixed inset-0 bg-gray-900/50" onClick={() => !loadingDetail && setSelectedOrder(null)} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {loadingDetail ? (
                <div className="p-12 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : selectedOrder && (
                <>
                  <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between z-10">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Pedido #{selectedOrder.id}</h2>
                      <p className="text-sm text-gray-500">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Status and payment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <FiPackage className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Estado del pedido</p>
                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[selectedOrder.status]}`}>
                              {statusLabels[selectedOrder.status]}
                            </span>
                          </div>
                        </div>
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => handleUpdateStatus(e.target.value)}
                          disabled={updatingStatus}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="paid">Pagado</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                          <option value="failed">Fallido</option>
                          <option value="refunded">Reembolsado</option>
                        </select>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FiDollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Estado del pago</p>
                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${paymentStatusColors[selectedOrder.payment_status]}`}>
                              {selectedOrder.payment_status === 'approved' ? 'Aprobado' : 
                               selectedOrder.payment_status === 'rejected' ? 'Rechazado' :
                               selectedOrder.payment_status === 'pending' ? 'Pendiente' :
                               selectedOrder.payment_status}
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-gray-600">
                          <span className="font-medium">Método:</span> {selectedOrder.payment_method}
                        </p>
                        {selectedOrder.mercadopago_id && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">MP ID:</span> {selectedOrder.mercadopago_id}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Customer info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Cliente</p>
                            <p className="font-medium text-gray-900">{selectedOrder.user?.nombre}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{selectedOrder.user?.email}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FiTruck className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Dirección de envío</p>
                            <p className="font-medium text-gray-900">{selectedOrder.shipping_city}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{selectedOrder.shipping_address}</p>
                        <p className="text-sm text-gray-600">{selectedOrder.shipping_phone}</p>
                      </div>
                    </div>

                    {/* Order items */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos</h3>
                      <div className="space-y-3">
                        {selectedOrder.items?.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                              {item.product?.imagen ? (
                                <img
                                  src={item.product.imagen.startsWith('http') ? item.product.imagen : `${import.meta.env.VITE_API_URL?.replace('/api', '')}${item.product.imagen}`}
                                  alt={item.product.nombre}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FiPackage className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{item.product?.nombre}</p>
                              <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{formatPrice(item.unit_price * item.quantity)}</p>
                              <p className="text-sm text-gray-500">{formatPrice(item.unit_price)} c/u</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-primary-600">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
