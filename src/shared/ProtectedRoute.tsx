import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"

interface ProtectedRouteProps {
  reverse?: boolean; // Si es true, protege a los logueados de entrar al login (ej: pantalla de login)
}

export default function ProtectedRoute({ reverse = false }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (reverse) {
    // Si ya está autenticado e intenta ir al login, lo mandamos al dashboard
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
  }

  // Si NO está autenticado e intenta entrar al panel, lo mandamos al login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}