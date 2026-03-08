import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getImageUrl } from '../../../lib/imageUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiX, FiStar, FiChevronDown, 
  FiPackage, FiTool, FiSettings, FiZap
} from 'react-icons/fi';
import { FaMotorcycle, FaOilCan } from 'react-icons/fa';
import { GiCarWheel, GiFullMotorcycleHelmet } from 'react-icons/gi';
import { getProducts, getCategories, type ProductFilters } from '../services/productsApi';
import type { Product, Category } from '../../../types';

// Skeleton component
const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
    <div className="aspect-square bg-gray-100 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
    <div className="p-5 space-y-3">
      <div className="h-4 w-24 bg-gray-100 rounded relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.1 }}
        />
      </div>
      <div className="h-5 w-full bg-gray-100 rounded relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
        />
      </div>
      <div className="h-4 w-32 bg-gray-100 rounded relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.3 }}
        />
      </div>
      <div className="flex items-end justify-between pt-2">
        <div className="space-y-1">
          <div className="h-3 w-16 bg-gray-100 rounded relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.4 }}
            />
          </div>
          <div className="h-6 w-24 bg-gray-100 rounded relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
            />
          </div>
        </div>
        <div className="h-10 w-24 bg-gray-100 rounded-xl relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.6 }}
          />
        </div>
      </div>
    </div>
  </div>
);

// Category icons mapping
const getCategoryIcon = (slug: string): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    'motos': <FaMotorcycle className="w-5 h-5" />,
    'repuestos-motor': <FiSettings className="w-5 h-5" />,
    'frenos-suspension': <FiTool className="w-5 h-5" />,
    'electrico': <FiZap className="w-5 h-5" />,
    'accesorios': <FiPackage className="w-5 h-5" />,
    'cascos-seguridad': <GiFullMotorcycleHelmet className="w-5 h-5" />,
    'lubricantes': <FaOilCan className="w-5 h-5" />,
    'neumaticos': <GiCarWheel className="w-5 h-5" />
  };
  return icons[slug] || <FiPackage className="w-5 h-5" />;
};

export default function ProductListPage() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(500000);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Obtener filtros de URL
  const filters: ProductFilters = {
    category: categorySlug || searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    marca: searchParams.get('marca') || undefined,
    orderBy: searchParams.get('orderBy') || 'created_at',
    order: (searchParams.get('order') as 'ASC' | 'DESC') || 'DESC'
  };

  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [productsResponse, categoriesData] = await Promise.all([
          getProducts(page, pagination.limit, filters),
          getCategories()
        ]);

        setProducts(productsResponse.data);
        setPagination(productsResponse.pagination);
        setCategories(categoriesData);
      } catch (err) {
        setError('Error al cargar los productos. Por favor, intenta de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug, searchParams.toString()]);

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePriceFilter = () => {
    handleFilterChange('maxPrice', priceRange.toString());
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange(500000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryCount = (categorySlug: string) => {
    const category = categories.find(c => c.slug === categorySlug);
    return category?.productCount || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de página */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Nuestra Tienda
          </h1>
          <p className="text-gray-600">
            {loading ? (
              <span className="inline-block w-40 h-5 bg-gray-200 rounded animate-pulse" />
            ) : (
              `${pagination.total} producto(s) encontrado(s)`
            )}
          </p>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros - Desktop */}
          <motion.aside 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block lg:w-72 flex-shrink-0"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              {/* Búsqueda */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  BUSCAR
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nombre, marca, modelo"
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full px-4 py-3 pl-10 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Categorías */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  CATEGORIA
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.category}
                      onChange={() => handleFilterChange('category', '')}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <FiPackage className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Todas</span>
                  </label>
                  {categories.map((category) => (
                    <label 
                      key={category.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category.slug}
                        onChange={() => handleFilterChange('category', category.slug)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-primary-600">{getCategoryIcon(category.slug)}</span>
                      <span className="text-sm text-gray-700 flex-1">{category.nombre}</span>
                      <span className="text-xs text-gray-400">{getCategoryCount(category.slug)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rango de precio */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  PRECIO MAXIMO: <span className="text-primary-600">{formatPrice(priceRange)}</span>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="500000"
                  step="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>$1.000</span>
                  <span>$500.000</span>
                </div>
              </div>

              {/* Ordenar por */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  ORDENAR POR
                </label>
                <div className="relative">
                  <select
                    value={`${filters.orderBy}-${filters.order}`}
                    onChange={(e) => {
                      const [orderBy, order] = e.target.value.split('-');
                      handleFilterChange('orderBy', orderBy);
                      handleFilterChange('order', order);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm appearance-none cursor-pointer"
                  >
                    <option value="created_at-DESC">Mas recientes</option>
                    <option value="created_at-ASC">Mas antiguos</option>
                    <option value="precio-ASC">Precio: menor a mayor</option>
                    <option value="precio-DESC">Precio: mayor a menor</option>
                    <option value="nombre-ASC">Nombre: A-Z</option>
                    <option value="nombre-DESC">Nombre: Z-A</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePriceFilter}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Filtrar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                  className="px-4 py-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Limpiar
                </motion.button>
              </div>
            </div>
          </motion.aside>

          {/* Botón filtros móvil */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all"
          >
            <FiFilter className="w-5 h-5" />
            Filtros
          </motion.button>

          {/* Modal de filtros móvil */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-50 bg-black/50"
              >
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: "spring", damping: 25 }}
                  className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Filtros</h2>
                      <button 
                        onClick={() => setShowFilters(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>
                    
                    {/* Contenido de filtros móvil */}
                    <div className="space-y-6">
                      {/* Búsqueda */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">BUSCAR</label>
                        <input
                          type="text"
                          placeholder="Nombre, marca, modelo"
                          value={filters.search || ''}
                          onChange={(e) => handleFilterChange('search', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl"
                        />
                      </div>

                      {/* Categorías */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">CATEGORIA</label>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <label key={category.id} className="flex items-center gap-3 p-2">
                              <input
                                type="radio"
                                name="category-mobile"
                                checked={filters.category === category.slug}
                                onChange={() => handleFilterChange('category', category.slug)}
                                className="w-4 h-4 text-primary-600"
                              />
                              <span className="text-primary-600">{getCategoryIcon(category.slug)}</span>
                              <span>{category.nombre}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Precio */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          PRECIO MAXIMO: {formatPrice(priceRange)}
                        </label>
                        <input
                          type="range"
                          min="1000"
                          max="500000"
                          step="1000"
                          value={priceRange}
                          onChange={(e) => setPriceRange(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => {
                            handlePriceFilter();
                            setShowFilters(false);
                          }}
                          className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium"
                        >
                          Aplicar filtros
                        </button>
                        <button
                          onClick={() => {
                            clearFilters();
                            setShowFilters(false);
                          }}
                          className="px-6 py-3 bg-gray-100 rounded-xl font-medium"
                        >
                          Limpiar
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contenido principal */}
          <div className="flex-1 min-w-0 w-full">
            {loading ? (
              /* Skeleton Loading Grid */
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-4 lg:gap-6"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductSkeleton />
                  </motion.div>
                ))}
              </motion.div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-primary-600 text-white rounded-xl"
                >
                  Reintentar
                </button>
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <FiSearch className="w-12 h-12 text-gray-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600 mb-6">Intenta con otros filtros de busqueda</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
                >
                  Limpiar filtros
                </motion.button>
              </motion.div>
            ) : (
              <>
                {/* Grid de productos con animaciones */}
                <div 
                  className="grid gap-4 lg:gap-6"
                  style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -8 }}
                    >
                      <Link 
                        to={`/productos/${product.slug}`}
                        className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all duration-300"
                      >
                        {/* Imagen */}
                        <div className="relative aspect-square bg-gray-50 overflow-hidden">
                          {/* Badges */}
                          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                            {product.destacado && (
                              <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full"
                              >
                                <FiStar className="w-3 h-3" />
                                Destacado
                              </motion.span>
                            )}
                            {product.precio_oferta && product.precio > product.precio_oferta && (
                              <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                                -{Math.round((1 - product.precio_oferta / product.precio) * 100)}%
                              </span>
                            )}
                          </div>

                          {product.imagen ? (
                            <img 
                              src={getImageUrl(product.imagen) ?? ''} 
                              alt={product.nombre}
                              className="w-full h-full object-contain p-4 transform group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center text-gray-300">
                                <FiPackage className="w-16 h-16 mx-auto mb-2" />
                                <span className="text-sm">Sin imagen</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Contenido */}
                        <div className="p-5">
                          {/* Categoría */}
                          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span>{getCategoryIcon(product.category?.slug || '')}</span>
                            {product.category?.nombre || 'Producto'}
                          </p>

                          {/* Nombre */}
                          <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {product.nombre}
                          </h3>

                          {/* Marca y modelo */}
                          {product.marca && (
                            <p className="text-sm text-gray-500 mb-4">
                              {product.marca} {product.modelo_compatible && `| ${product.modelo_compatible}`}
                            </p>
                          )}

                          {/* Precio y botón */}
                          <div className="flex items-end justify-between">
                            <div>
                              {product.precio_oferta ? (
                                <>
                                  <p className="text-xs text-gray-400 line-through">
                                    {formatPrice(product.precio)}
                                  </p>
                                  <p className="text-xl font-bold text-primary-600">
                                    {formatPrice(product.precio_oferta)}
                                  </p>
                                </>
                              ) : (
                                <p className="text-xl font-bold text-gray-900">
                                  {formatPrice(product.precio)}
                                </p>
                              )}
                              <p className="text-xs text-gray-500">IVA incluido</p>
                            </div>
                            
                            <motion.span 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2"
                            >
                              <span className="hidden sm:inline">Ver</span> Detalle
                            </motion.span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Paginación */}
                {pagination.totalPages > 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 flex justify-center"
                  >
                    <nav className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Anterior
                      </motion.button>
                      
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter(p => Math.abs(p - pagination.page) <= 2 || p === 1 || p === pagination.totalPages)
                        .map((p, i, arr) => {
                          const elements = [];
                          if (i > 0 && p - arr[i - 1] > 1) {
                            elements.push(<span key={`ellipsis-${p}`} className="px-2 text-gray-400">...</span>);
                          }
                          elements.push(
                            <motion.button
                              key={p}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handlePageChange(p)}
                              className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                                p === pagination.page
                                  ? 'bg-primary-600 text-white'
                                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {p}
                            </motion.button>
                          );
                          return elements;
                        })}
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Siguiente
                      </motion.button>
                    </nav>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
