import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo y descripción */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">MS</span>
              </div>
              <div>
                <span className="text-xl font-bold">Motos y Repuestos Speed</span>
                <p className="text-[10px] text-gray-400 -mt-1">Tu aliado en moto & repuestos - Chile</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Tu tienda de confianza para motos, repuestos y accesorios. Calidad garantizada y los mejores precios del mercado chileno.
            </p>
            {/* Redes sociales */}
            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/56912345678" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-lg font-semibold mb-4">NAVEGACIÓN</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/tienda" className="text-gray-400 hover:text-white transition-colors">
                  Tienda
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="text-gray-400 hover:text-white transition-colors">
                  Servicios
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">CONTACTO</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Santiago, Chile</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <a href="tel:+56912345678" className="text-gray-400 hover:text-white transition-colors">
                  +56 9 1234 5678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <a href="mailto:contacto@motosyrepuestosspeed.cl" className="text-gray-400 hover:text-white transition-colors">
                  contacto@motosyrepuestosspeed.cl
                </a>
              </li>
            </ul>
          </div>

          {/* Métodos de pago */}
          <div>
            <h3 className="text-lg font-semibold mb-4">PAGOS</h3>
            <p className="text-gray-400 text-sm mb-4">Pagos procesados por:</p>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-[#009EE3] text-white px-3 py-1.5 rounded text-sm font-medium">
                  Mercado Pago
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                <span className="bg-gray-700 px-2 py-1 rounded">Débito</span>
                <span className="bg-gray-700 px-2 py-1 rounded">Crédito</span>
                <span className="bg-gray-700 px-2 py-1 rounded">Transferencia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Motos y Repuestos Speed. Todos los derechos reservados.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Hecho con <span className="text-red-500">❤</span> en Venezuela
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
