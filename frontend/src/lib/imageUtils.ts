const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');

export function getImageUrl(imagen: string | null | undefined): string | null {
  if (!imagen) return null;
  if (imagen.startsWith('http://') || imagen.startsWith('https://')) return imagen;
  return `${API_BASE_URL}${imagen}`;
}
