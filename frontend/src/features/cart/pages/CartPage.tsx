import { Link } from 'react-router-dom';
import CartItemComponent from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../../products/services/productsApi';

export default function CartPage() {
  const { items, clearCart, getTotal, getTotalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-6">
            ¡Agrega productos para comenzar tu compra!
          </p>
          <Link
            to="/productos"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="hidden md:flex items-center gap-4 px-6 py-3 border-b border-gray-200 text-sm font-medium text-gray-500">
              <div className="flex-grow">Producto</div>
              <div className="w-32 text-center">Cantidad</div>
              <div className="w-32 text-right">Subtotal</div>
              <div className="w-8"></div>
            </div>

            {/* Items */}
            <div className="px-6">
              {items.map((item) => (
                <CartItemComponent key={item.product.id} item={item} />
              ))}
            </div>
          </div>

          {/* Seguir comprando */}
          <Link
            to="/productos"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mt-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Seguir comprando
          </Link>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Productos ({getTotalItems()})</span>
                <span className="font-medium">{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(getTotal())}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 mt-6"
            >
              Proceder al pago
            </Link>

            {/* Métodos de pago */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 text-center mb-2">Métodos de pago aceptados</p>
              <div className="flex justify-center gap-2">
                <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs">
                  MP
                </div>
                <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs">
                  💳
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
