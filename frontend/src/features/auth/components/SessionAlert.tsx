import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiClock, FiX, FiLogIn } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface SessionAlertProps {
  type: 'expired' | 'inactive' | 'warning';
  show: boolean;
  onClose?: () => void;
  timeRemaining?: number;
}

export default function SessionAlert({ type, show, onClose, timeRemaining }: SessionAlertProps) {
  const navigate = useNavigate();

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLogin = () => {
    navigate('/login');
    onClose?.();
  };

  const configs = {
    expired: {
      title: 'Sesión Expirada',
      message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente para continuar.',
      icon: FiClock,
      bgColor: 'bg-red-500',
      borderColor: 'border-red-600',
      showLoginButton: true
    },
    inactive: {
      title: 'Sesión Cerrada por Inactividad',
      message: 'Tu sesión ha sido cerrada debido a inactividad prolongada. Por favor, inicia sesión nuevamente.',
      icon: FiAlertTriangle,
      bgColor: 'bg-amber-500',
      borderColor: 'border-amber-600',
      showLoginButton: true
    },
    warning: {
      title: 'Sesión por Expirar',
      message: `Tu sesión expirará en ${timeRemaining ? formatTime(timeRemaining) : 'poco tiempo'}. Guarda tu trabajo o realiza alguna acción para mantener la sesión activa.`,
      icon: FiClock,
      bgColor: 'bg-amber-500',
      borderColor: 'border-amber-600',
      showLoginButton: false
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[9998]"
            onClick={type === 'warning' ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-t-4 ${config.borderColor}`}>
              {/* Header */}
              <div className={`${config.bgColor} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold">{config.title}</h2>
                  </div>
                  {type === 'warning' && onClose && (
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  {config.message}
                </p>

                <div className="flex gap-3">
                  {config.showLoginButton && (
                    <button
                      onClick={handleLogin}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                      <FiLogIn className="w-5 h-5" />
                      Iniciar Sesión
                    </button>
                  )}
                  {type === 'warning' && onClose && (
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Entendido
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
