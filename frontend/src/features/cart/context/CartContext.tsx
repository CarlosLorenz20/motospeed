import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product, CartItem } from '../../../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
  isInCart: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getCartKey(userId?: number | null): string {
  return userId ? `motospeed_cart_${userId}` : '';
}

interface CartProviderProps {
  children: ReactNode;
  userId?: number | null;
}

export function CartProvider({ children, userId }: CartProviderProps) {
  const cartKey = getCartKey(userId);

  const [items, setItems] = useState<CartItem[]>(() => {
    if (!cartKey) return [];
    const saved = localStorage.getItem(cartKey);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  // Cuando cambia el usuario (login/logout), cargar su carrito o limpiar
  useEffect(() => {
    if (!cartKey) {
      setItems([]);
      return;
    }
    const saved = localStorage.getItem(cartKey);
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch { setItems([]); }
    } else {
      setItems([]);
    }
  }, [cartKey]);

  // Guardar carrito en localStorage por usuario
  useEffect(() => {
    if (!cartKey) return;
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, cartKey]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
        return currentItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      return [...currentItems, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    if (cartKey) localStorage.removeItem(cartKey);
  };

  const getTotal = () => {
    return items.reduce((total, item) => {
      const price = item.product.precio_oferta || item.product.precio;
      return total + price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => items.reduce((total, item) => total + item.quantity, 0);

  const isInCart = (productId: number) => items.some((item) => item.product.id === productId);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getTotalItems, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
}
