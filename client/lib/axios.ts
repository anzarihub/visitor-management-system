import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

export const api = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL,
   withCredentials: true, // sends the session cookie automatically on every request
   headers: {
      'Content-Type': 'application/json',
   },
});

const PUBLIC_AUTH_PATHS = ['/auth/login'];

api.interceptors.response.use(
   (response) => response,
   (error) => {
      const url = error.config?.url ?? '';
      const isPublicAuthCall = PUBLIC_AUTH_PATHS.some((p) => url.includes(p));

      if (error.response?.status === 401 && !isPublicAuthCall) {
         useAuthStore.getState().clearAuth();
         if (window.location.pathname !== '/login') {
            window.location.href = '/login';
         }
      }
      return Promise.reject(error);
   },
);
