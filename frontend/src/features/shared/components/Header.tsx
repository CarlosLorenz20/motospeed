import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/context/CartContext';
import { useAuth } from '../../auth/context/AuthContext';
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';

export default function Header() {
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tienda?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors ${
      isActive 
        ? 'text-primary-600' 
        : 'text-gray-700 hover:text-primary-600'
    }`;

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md' 
          : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">MS</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">MotoSpeed</span>
              <p className="text-[10px] text-gray-500 -mt-1">Repuestos & Accesorios</p>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              Inicio
            </NavLink>
            <NavLink to="/tienda" className={navLinkClass}>
              Tienda
            </NavLink>
            <NavLink to="/servicios" className={navLinkClass}>
              Servicios
            </NavLink>
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Buscador Desktop */}
            <div className="hidden md:block relative">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="w-48 lg:w-64 px-4 py-2 pl-10 text-sm bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </form>
            </div>

            {/* Búsqueda Móvil */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {/* Carrito */}
            <Link 
              to="/carrito" 
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <FiShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Usuario Desktop */}
            {isAuthenticated ? (
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                </button>

                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/perfil"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiUser className="w-4 h-4" />
                        Mi perfil
                      </Link>
                      <Link
                        to="/mis-pedidos"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiPackage className="w-4 h-4" />
                        Mis pedidos
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiSettings className="w-4 h-4" />
                          Panel Admin
                        </Link>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Menú Móvil Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Barra de búsqueda móvil */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 animate-slide-down">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full px-4 py-3 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </form>
          </div>
        )}

        {/* Menú Móvil */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-slide-down">
            <nav className="space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
                end
              >
                Inicio
              </NavLink>
              <NavLink
                to="/tienda"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Tienda
              </NavLink>
              <NavLink
                to="/servicios"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </NavLink>
            </nav>

            {/* Acciones móviles */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Hola, {user?.name}
                  </div>
                  <Link
                    to="/perfil"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi perfil
                  </Link>
                  <Link
                    to="/mis-pedidos"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mis pedidos
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-lg"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-4">
                  <Link
                    to="/login"
                    className="block w-full py-3 text-center text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/registro"
                    className="block w-full py-3 text-center text-white bg-primary-600 rounded-lg hover:bg-primary-700 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
