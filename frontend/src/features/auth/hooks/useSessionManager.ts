import { useEffect, useCallback, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: number;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

interface SessionState {
  isExpired: boolean;
  isInactive: boolean;
  timeRemaining: number;
  status: 'active' | 'expired' | 'inactive';
  timeUntilExpiry: number;
}

interface UseSessionManagerOptions {
  onSessionExpired?: () => void;
  onInactivityTimeout?: () => void;
}

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutos de inactividad
const CHECK_INTERVAL = 30 * 1000; // Verificar cada 30 segundos
const WARNING_BEFORE_EXPIRY = 2 * 60 * 1000; // Avisar 2 minutos antes de expirar

// Obtener token del localStorage
const getToken = () => localStorage.getItem('token');

export function useSessionManager(options: UseSessionManagerOptions = {}) {
  const { onSessionExpired, onInactivityTimeout } = options;
  
  const [sessionState, setSessionState] = useState<SessionState>({
    isExpired: false,
    isInactive: false,
    timeRemaining: 0,
    status: 'active',
    timeUntilExpiry: 0
  });
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  
  const lastActivityRef = useRef<number>(Date.now());
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warningShownRef = useRef(false);

  // Actualizar última actividad
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    // Si ya estaba marcado como inactivo, resetear
    if (sessionState.isInactive) {
      setSessionState(prev => ({ ...prev, isInactive: false }));
    }
  }, [sessionState.isInactive]);

  // Verificar si el token ha expirado
  const checkTokenExpiry = useCallback(() => {
    const token = getToken();
    if (!token) return { expired: false, timeRemaining: 0, hasToken: false };

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const expiryTime = decoded.exp * 1000; // Convertir a milisegundos
      const now = Date.now();
      const timeRemaining = expiryTime - now;

      return {
        expired: timeRemaining <= 0,
        timeRemaining: Math.max(0, timeRemaining),
        hasToken: true
      };
    } catch {
      return { expired: true, timeRemaining: 0, hasToken: true };
    }
  }, []);

  // Verificar inactividad
  const checkInactivity = useCallback(() => {
    const timeSinceLastActivity = Date.now() - lastActivityRef.current;
    return timeSinceLastActivity >= INACTIVITY_TIMEOUT;
  }, []);

  // Verificación periódica de sesión
  useEffect(() => {
    const checkSession = () => {
      const token = getToken();
      
      // Si no hay token, no verificar nada
      if (!token) {
        setSessionState({ 
          isExpired: false, 
          isInactive: false, 
          timeRemaining: 0,
          status: 'active',
          timeUntilExpiry: 0
        });
        setShowExpiryWarning(false);
        return;
      }

      // Verificar expiración del token
      const { expired, timeRemaining, hasToken } = checkTokenExpiry();
      
      if (!hasToken) return;
      
      if (expired) {
        setSessionState(prev => ({ 
          ...prev, 
          isExpired: true, 
          timeRemaining: 0,
          status: 'expired',
          timeUntilExpiry: 0
        }));
        onSessionExpired?.();
        return;
      }

      // Mostrar advertencia si queda poco tiempo
      if (timeRemaining <= WARNING_BEFORE_EXPIRY && !warningShownRef.current) {
        setShowExpiryWarning(true);
        warningShownRef.current = true;
      }

      // Verificar inactividad
      if (checkInactivity()) {
        setSessionState(prev => ({ 
          ...prev, 
          isInactive: true, 
          timeRemaining,
          status: 'inactive',
          timeUntilExpiry: timeRemaining
        }));
        onInactivityTimeout?.();
        return;
      }

      setSessionState({ 
        timeRemaining,
        isExpired: false,
        isInactive: false,
        status: 'active',
        timeUntilExpiry: timeRemaining
      });
    };

    // Verificación inicial
    checkSession();

    // Configurar verificación periódica
    checkIntervalRef.current = setInterval(checkSession, CHECK_INTERVAL);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [checkTokenExpiry, checkInactivity, onSessionExpired, onInactivityTimeout]);

  // Escuchar eventos de actividad del usuario
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [updateActivity]);

  // Reset warning flag cuando se cierra la advertencia
  const dismissExpiryWarning = useCallback(() => {
    setShowExpiryWarning(false);
  }, []);

  return {
    sessionState,
    showExpiryWarning,
    dismissExpiryWarning,
    updateActivity
  };
}
