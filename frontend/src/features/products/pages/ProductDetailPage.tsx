import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';
import { getProduct, formatPrice, getFinalPrice, hasDiscount, getDiscountPercent } from '../services/productsApi';
import { useCart } from '../../cart/context/CartContext';
import type { Product } from '../../../types';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);

      try {
        const data = await getProduct(slug);
        setProduct(data);
        // Construir URL correcta para la imagen
        const imageUrl = data.imagen 
          ? (data.imagen.startsWith('http') ? data.imagen : `${import.meta.env.VITE_API_URL?.replace('/api', '')}${data.imagen}`)
          : null;
        setSelectedImage(imageUrl);
      } catch (err) {
        setError('Producto no encontrado');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
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

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <button 
            onClick={() => navigate('/productos')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Ver todos los productos
          </button>
        </div>
      </div>
    );
  }

  const finalPrice = getFinalPrice(product);
  const hasOffer = hasDiscount(product);
  const discountPercent = getDiscountPercent(product);
  
  // Helper para construir URL de imagen
  const getImageUrl = (img: string) => {
    if (!img) return '';
    return img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL?.replace('/api', '')}${img}`;
  };
  
  const allImages = [product.imagen, ...(product.imagenes_adicionales || [])]
    .filter(Boolean)
    .map(img => getImageUrl(img as string));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div>
          {/* Imagen principal */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                    selectedImage === img ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div>
          {/* Categoría */}
          {product.category && (
            <span className="text-sm text-gray-500 uppercase tracking-wide">
              {product.category.nombre}
            </span>
          )}

          {/* Nombre */}
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.nombre}</h1>

          {/* SKU */}
          {product.sku && (
            <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
          )}

          {/* Marca y modelo */}
          {(product.marca || product.modelo_compatible) && (
            <div className="mt-2 text-gray-600">
              {product.marca && <span>Marca: {product.marca}</span>}
              {product.marca && product.modelo_compatible && <span> | </span>}
              {product.modelo_compatible && <span>Compatible: {product.modelo_compatible}</span>}
            </div>
          )}

          {/* Precios */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-blue-600">
              {formatPrice(finalPrice)}
            </span>
            {hasOffer && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.precio)}
                </span>
                <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="mt-4">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <FiCheck className="w-4 h-4" /> En stock ({product.stock} disponibles)
              </span>
            ) : (
              <span className="text-red-600 font-medium flex items-center gap-1">
                <FiX className="w-4 h-4" /> Sin stock
              </span>
            )}
          </div>

          {/* Selector de cantidad */}
          {product.stock > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-20 h-10 text-center border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          {product.stock > 0 && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Agregar al carrito
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Comprar ahora
              </button>
            </div>
          )}

          {/* Descripción */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h2>
            <div className="prose prose-sm text-gray-600">
              <p>{product.descripcion}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
