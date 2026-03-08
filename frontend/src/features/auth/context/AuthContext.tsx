import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '../../../types';
import * as authApi from '../services/authApi';
import { useSessionManager } from '../hooks/useSessionManager';
import SessionAlert from '../components/SessionAlert';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  register: (name: string, email: string, password: string, telefono?: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionAlertType, setSessionAlertType] = useState<'expired' | 'inactive' | 'warning' | null>(null);

  const handleSessionExpired = useCallback(() => {
    authApi.clearAuth();
    setUser(null);
    setSessionAlertType('expired');
  }, []);

  const handleInactivityTimeout = useCallback(() => {
    authApi.clearAuth();
    setUser(null);
    setSessionAlertType('inactive');
  }, []);

  const { 
    sessionState, 
    showExpiryWarning, 
    dismissExpiryWarning 
  } = useSessionManager({
    onSessionExpired: handleSessionExpired,
    onInactivityTimeout: handleInactivityTimeout
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = authApi.getSavedUser();
      const savedToken = authApi.getSavedToken();

      if (savedUser && savedToken) {
        try {
          // Verificar que el token sigue siendo válido
          const currentUser = await authApi.getProfile();
          setUser(currentUser);
        } catch {
          // Token inválido, limpiar auth
          authApi.clearAuth();
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    authApi.saveAuth(response.user, response.token);
    setUser(response.user);
  };

  const loginWithGoogle = async (credential: string) => {
    const response = await authApi.loginWithGoogle(credential);
    authApi.saveAuth(response.user, response.token);
    setUser(response.user);
  };

  const register = async (name: string, email: string, password: string, telefono?: string) => {
    const response = await authApi.register(name, email, password, telefono);
    authApi.saveAuth(response.user, response.token);
    setUser(response.user);
  };

  const logout = () => {
    authApi.clearAuth();
    setUser(null);
  };

  const updateUser = async (data: Partial<User>) => {
    const updatedUser = await authApi.updateProfile(data);
    authApi.saveAuth(updatedUser, authApi.getSavedToken() || '');
    setUser(updatedUser);
  };

  const handleCloseAlert = () => {
    setSessionAlertType(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser
      }}
    >
      {children}
      
      {/* Alerta de sesión expirada */}
      <SessionAlert
        type="expired"
        show={sessionAlertType === 'expired'}
        onClose={handleCloseAlert}
      />
      
      {/* Alerta de inactividad */}
      <SessionAlert
        type="inactive"
        show={sessionAlertType === 'inactive'}
        onClose={handleCloseAlert}
      />
      
      {/* Advertencia de expiración próxima */}
      <SessionAlert
        type="warning"
        show={showExpiryWarning && sessionState.status === 'active'}
        onClose={dismissExpiryWarning}
        timeRemaining={sessionState.timeUntilExpiry}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
