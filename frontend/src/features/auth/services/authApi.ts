import api from '../../../lib/api';
import type { User, AuthResponse, ApiResponse } from '../../../types';

// Registro de usuario
export const register = async (
  name: string,
  email: string,
  password: string,
  telefono?: string
): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
    name,
    email,
    password,
    telefono
  });
  return response.data.data;
};

// Login de usuario
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
    email,
    password
  });
  return response.data.data;
};

// Obtener perfil del usuario
export const getProfile = async (): Promise<User> => {
  const response = await api.get<ApiResponse<{ user: User }>>('/auth/profile');
  return response.data.data.user;
};

// Actualizar perfil
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put<ApiResponse<{ user: User }>>('/auth/profile', data);
  return response.data.data.user;
};

// Cambiar contraseña
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  await api.put('/auth/change-password', { currentPassword, newPassword });
};

// Login con Google (envia el access_token al backend)
export const loginWithGoogle = async (token: string): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/google', { token });
  return response.data.data;
};

// Guardar auth en localStorage
export const saveAuth = (user: User, token: string): void => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

// Limpiar auth de localStorage
export const clearAuth = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Obtener usuario de localStorage
export const getSavedUser = (): User | null => {
  const saved = localStorage.getItem('user');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

// Obtener token de localStorage
export const getSavedToken = (): string | null => {
  return localStorage.getItem('token');
};
