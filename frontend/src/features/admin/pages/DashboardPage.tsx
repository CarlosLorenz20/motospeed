import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiPackage, FiShoppingCart, FiUsers, FiTag, 
  FiTrendingUp, FiAlertTriangle, FiArrowRight, FiPlus,
  FiDollarSign, FiActivity, FiClock, FiHelpCircle
} from 'react-icons/fi';
import { getDashboardStats } from '../services/adminApi';

interface DashboardStats {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalCategories: number;
    monthlyRevenue: number;
  };
  recentOrders: Array<{
    id: number;
    estado: string;
    total: number;
    created_at: string;
    user: { name: string; email: string };
    product: { nombre: string; imagen: string };
  }>;
  lowStockProducts: Array<{
    id: number;
    nombre: string;
    stock: number;
    imagen: string;
    precio: number;
  }>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardStats();
        setData(result);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price || 0);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-yellow-100 text-yellow-800',
      pagado: 'bg-green-100 text-green-800',
      paid: 'bg-green-100 text-green-800',
      enviado: 'bg-blue-100 text-blue-800',
      shipped: 'bg-blue-100 text-blue-800',
      entregado: 'bg-purple-100 text-purple-800',
      delivered: 'bg-purple-100 text-purple-800',
      cancelado: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-gray-100 text-gray-800',
      fallido: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const stats = data ? [
    { 
      name: 'Productos', 
      value: data.stats.totalProducts, 
      icon: FiPackage, 
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      link: '/admin/products'
    },
    { 
      name: 'Pedidos', 
      value: data.stats.totalOrders, 
      icon: FiShoppingCart, 
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      link: '/admin/orders'
    },
    { 
      name: 'Clientes', 
      value: data.stats.totalUsers, 
      icon: FiUsers, 
      color: 'from-violet-500 to-violet-600',
      bgLight: 'bg-violet-50',
      link: '#'
    },
    { 
      name: 'Categorías', 
      value: data.stats.totalCategories, 
      icon: FiTag, 
      color: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50',
      link: '/admin/categories'
    },
  ] : [];

  // Skeleton loading
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
              <div className="h-8 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  // Error or empty state - show welcome screen
  if (error || !data) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">¡Bienvenido al Panel de Administración!</h1>
          <p className="text-gray-600">Administra tu tienda desde aquí</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/admin/products"
            className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <FiPackage className="w-6 h-6" />
              </div>
              <FiArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-semibold text-lg">Productos</h3>
            <p className="text-blue-100 text-sm mt-1">Gestiona tu catálogo</p>
          </Link>

          <Link 
            to="/admin/orders"
            className="group bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <FiShoppingCart className="w-6 h-6" />
              </div>
              <FiArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-semibold text-lg">Pedidos</h3>
            <p className="text-emerald-100 text-sm mt-1">Ver historial de ventas</p>
          </Link>

          <Link 
            to="/admin/categories"
            className="group bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <FiTag className="w-6 h-6" />
              </div>
              <FiArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-semibold text-lg">Categorías</h3>
            <p className="text-violet-100 text-sm mt-1">Organiza tus productos</p>
          </Link>

          <Link 
            to="/admin/products"
            className="group bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <FiPlus className="w-6 h-6" />
              </div>
              <FiArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-semibold text-lg">Nuevo Producto</h3>
            <p className="text-amber-100 text-sm mt-1">Agregar al catálogo</p>
          </Link>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <FiActivity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado del Sistema</p>
                <p className="text-lg font-semibold text-green-600">Operativo</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <FiDollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Mercado Pago</p>
                <p className="text-lg font-semibold text-emerald-600">Conectado</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-xl">
                <FiClock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Última actualización</p>
                <p className="text-lg font-semibold text-gray-900">Ahora</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FiHelpCircle className="w-5 h-5 text-primary-400" />
            Consejos para empezar
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-primary-400">•</span>
              Crea categorías para organizar tus productos
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400">•</span>
              Agrega productos con imágenes de alta calidad
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400">•</span>
              Configura los precios y stock de cada producto
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400">•</span>
              Revisa los pedidos regularmente para procesarlos
            </li>
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen de tu tienda</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              to={stat.link}
              className="block bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.bgLight}`}>
                  {stat.name}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">Total {stat.name.toLowerCase()}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue Card */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute left-0 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm font-medium">Ingresos del mes</p>
            <p className="text-4xl font-bold mt-2">{formatPrice(data.stats.monthlyRevenue)}</p>
            <p className="text-primary-200 text-sm mt-2">
              Basado en pedidos pagados
            </p>
          </div>
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
            <FiTrendingUp className="w-10 h-10" />
          </div>
        </div>
      </motion.div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Pedidos recientes</h2>
            <Link 
              to="/admin/orders" 
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
            >
              Ver todos <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data.recentOrders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FiShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No hay pedidos aún</p>
                <p className="text-gray-400 text-sm mt-1">Los pedidos aparecerán aquí</p>
              </div>
            ) : (
              data.recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">#{order.id}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.user?.name || 'Cliente'}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                      <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadge(order.estado)}`}>
                        {order.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Low Stock Products */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FiAlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="font-semibold text-gray-900">Stock bajo</h2>
            </div>
            <Link 
              to="/admin/products" 
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
            >
              Ver productos <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data.lowStockProducts.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FiPackage className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-gray-500 font-medium">¡Todo en orden!</p>
                <p className="text-gray-400 text-sm mt-1">No hay productos con stock bajo</p>
              </div>
            ) : (
              data.lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.imagen ? (
                          <img 
                            src={product.imagen.startsWith('http') ? product.imagen : `${import.meta.env.VITE_API_URL?.replace('/api', '')}${product.imagen}`} 
                            alt={product.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiPackage className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                          {product.nombre}
                        </p>
                        <p className="text-xs text-gray-500">{formatPrice(product.precio)}</p>
                      </div>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                      product.stock === 0 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {product.stock} uds
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link 
          to="/admin/products"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all group"
        >
          <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
            <FiPlus className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Nuevo Producto</p>
            <p className="text-sm text-gray-500">Agregar al catálogo</p>
          </div>
        </Link>

        <Link 
          to="/admin/categories"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all group"
        >
          <div className="p-3 bg-violet-50 rounded-xl group-hover:bg-violet-100 transition-colors">
            <FiTag className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Nueva Categoría</p>
            <p className="text-sm text-gray-500">Organizar productos</p>
          </div>
        </Link>

        <Link 
          to="/admin/orders"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all group"
        >
          <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
            <FiShoppingCart className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Ver Pedidos</p>
            <p className="text-sm text-gray-500">Gestionar ventas</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
