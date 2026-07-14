import axios from "axios"
import { useAuthStore } from "@/store/authStore"

export const api = axios.create({
  // Vite expone las variables de entorno dentro de import.meta.env
  baseURL: import.meta.env.VITE_API_URL, 
})

// Interceptor: Antes de que salga la petición, le pegamos el Token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})