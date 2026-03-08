import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../features/auth/context/AuthContext';
import { CartProvider } from '../features/cart/context/CartContext';
import { useAuth } from '../features/auth/context/AuthContext';
import Header from '../features/shared/components/Header';
import Footer from '../features/shared/components/Footer';

// Pages
import HomePage from '../features/home/pages/HomePage';
import ServicesPage from '../features/services/pages/ServicesPage';
import ProductListPage from '../features/products/pages/ProductListPage';
import ProductDetailPage from '../features/products/pages/ProductDetailPage';
import CartPage from '../features/cart/pages/CartPage';
import CheckoutPage from '../features/checkout/pages/CheckoutPage';
import SuccessPage from '../features/checkout/pages/SuccessPage';
import FailurePage from '../features/checkout/pages/FailurePage';
import PendingPage from '../features/checkout/pages/PendingPage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ProfilePage from '../features/auth/pages/ProfilePage';
import OrdersPage from '../features/auth/pages/OrdersPage';

// Admin
import AdminLayout from '../features/admin/components/AdminLayout';
import ProtectedAdminRoute from '../features/admin/components/ProtectedAdminRoute';
import AdminLoginPage from '../features/admin/pages/AdminLoginPage';
import DashboardPage from '../features/admin/pages/DashboardPage';
import ProductsAdminPage from '../features/admin/pages/ProductsPage';
import OrdersAdminPage from '../features/admin/pages/OrdersPage';
import CategoriesPage from '../features/admin/pages/CategoriesPage';

// Layout para páginas públicas - usa el userId del contexto de auth
function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <CartProvider userId={user?.id}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Admin login (sin layout público) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          
          {/* Admin routes (protegidas, sin layout público) */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsAdminPage />} />
            <Route path="orders" element={<OrdersAdminPage />} />
            <Route path="categories" element={<CategoriesPage />} />
          </Route>

          {/* Rutas públicas con Header/Footer */}
          <Route path="/*" element={
            <PublicLayout>
              <Routes>
                {/* Inicio */}
                <Route path="/" element={<HomePage />} />
                
                {/* Tienda */}
                <Route path="/tienda" element={<ProductListPage />} />
                <Route path="/productos" element={<ProductListPage />} />
                <Route path="/productos/:slug" element={<ProductDetailPage />} />
                <Route path="/categoria/:categorySlug" element={<ProductListPage />} />
                
                {/* Servicios */}
                <Route path="/servicios" element={<ServicesPage />} />
                
                {/* Carrito y Checkout */}
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout/success" element={<SuccessPage />} />
                <Route path="/checkout/failure" element={<FailurePage />} />
                <Route path="/checkout/pending" element={<PendingPage />} />
                
                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/mis-pedidos" element={<OrdersPage />} />
              </Routes>
            </PublicLayout>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
