import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  token: string | null;
  adminName: string | null;
  isAuthenticated: boolean;
  login: (token: string, adminName: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      adminName: null,
      isAuthenticated: false,
      login: (token, adminName) => 
        set({ token, adminName, isAuthenticated: true }),
      logout: () => 
        set({ token: null, adminName: null, isAuthenticated: false }),
    }),
    {
      name: "inveragro-auth-storage", // Nombre de la clave en LocalStorage
    }
  )
)