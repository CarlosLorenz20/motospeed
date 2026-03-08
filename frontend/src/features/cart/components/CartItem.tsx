import { Link } from 'react-router-dom';
import type { CartItem } from '../../../types';
import { formatPrice, getFinalPrice } from '../../products/services/productsApi';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItem;
}

export default function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;
  const finalPrice = getFinalPrice(product);

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      {/* Imagen */}
      <Link to={`/productos/${product.slug}`} className="flex-shrink-0">
        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
          {product.imagen ? (
            <img
              src={product.imagen}
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Información */}
      <div className="flex-grow">
        <Link 
          to={`/productos/${product.slug}`}
          className="font-medium text-gray-900 hover:text-blue-600"
        >
          {product.nombre}
        </Link>
        
        {product.marca && (
          <p className="text-sm text-gray-500">{product.marca}</p>
        )}
        
        <p className="text-blue-600 font-semibold mt-1">
          {formatPrice(finalPrice)}
        </p>
      </div>

      {/* Selector de cantidad */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(product.id, quantity - 1)}
          className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          -
        </button>
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => {
            const newQty = parseInt(e.target.value) || 1;
            updateQuantity(product.id, newQty);
          }}
          className="w-16 h-8 text-center border border-gray-300 rounded"
        />
        <button
          onClick={() => updateQuantity(product.id, quantity + 1)}
          disabled={quantity >= product.stock}
          className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="w-32 text-right">
        <p className="font-semibold text-gray-900">
          {formatPrice(finalPrice * quantity)}
        </p>
      </div>

      {/* Eliminar */}
      <button
        onClick={() => removeFromCart(product.id)}
        className="p-2 text-gray-400 hover:text-red-600"
        title="Eliminar del carrito"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
