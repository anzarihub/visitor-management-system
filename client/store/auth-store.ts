import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types/user.types';

type AuthState = {
   user: User | null;
   isAuthenticated: boolean;
   isHydrated: boolean; // true once Zustand has rehydrated from localStorage

   setUser: (user: User) => void;
   clearAuth: () => void;
   setHydrated: () => void;
};

export const useAuthStore = create<AuthState>()(
   persist(
      (set) => ({
         user: null,
         isAuthenticated: false,
         isHydrated: false,

         setUser: (user) => set({ user, isAuthenticated: true }),
         clearAuth: () => set({ user: null, isAuthenticated: false }),
         setHydrated: () => set({ isHydrated: true }),
      }),
      {
         name: 'vms-auth',
         storage: createJSONStorage(() => localStorage),
         partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
         }),
         onRehydrateStorage: () => (state) => {
            state?.setHydrated();
         },
      },
   ),
);
