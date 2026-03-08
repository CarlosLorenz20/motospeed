import { Link } from 'react-router-dom';
import { getImageUrl } from '../../../lib/imageUtils';
import type { Product } from '../../../types';
import { formatPrice, getFinalPrice, hasDiscount, getDiscountPercent } from '../services/productsApi';
import { useCart } from '../../cart/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const finalPrice = getFinalPrice(product);
  const hasOffer = hasDiscount(product);
  const discountPercent = getDiscountPercent(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link 
      to={`/productos/${product.slug}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.imagen ? (
          <img
            src={getImageUrl(product.imagen) ?? ''}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Badge de descuento */}
        {hasOffer && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercent}%
          </span>
        )}
        
        {/* Badge de destacado */}
        {product.destacado && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            ⭐ Destacado
          </span>
        )}
        
        {/* Badge de sin stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold px-4 py-2 rounded">
              Sin Stock
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Categoría */}
        {product.category && (
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category.nombre}
          </span>
        )}
        
        {/* Nombre */}
        <h3 className="mt-1 text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.nombre}
        </h3>
        
        {/* Marca */}
        {product.marca && (
          <p className="mt-1 text-sm text-gray-500">{product.marca}</p>
        )}

        {/* Precios */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(finalPrice)}
          </span>
          {hasOffer && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.precio)}
            </span>
          )}
        </div>

        {/* Stock */}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="mt-1 text-xs text-orange-600">
            ¡Solo quedan {product.stock} unidades!
          </p>
        )}

        {/* Botón agregar al carrito */}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Agregar al carrito
          </button>
        )}
      </div>
    </Link>
  );
}
