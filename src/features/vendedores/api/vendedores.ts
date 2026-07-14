import { api } from "@/config/axios"

// Actualizado 100% fiel a tu base de datos PostgreSQL
export interface Vendedor {
  id: string;
  dni: string;
  nombre_completo: string;
  estado: boolean;
  clientes_asignados: number;
}

// Interfaz para los datos que enviaremos al crear
export interface CreateVendedorInput {
  dni: string;
  nombre_completo: string;
  password_hash: string;
}

// Interfaz para actualizar (no enviamos el password_hash aquí por seguridad)
export interface UpdateVendedorInput {
  dni: string;
  nombre_completo: string;
  estado: boolean;
}

export const getVendedores = async (): Promise<Vendedor[]> => {
  const { data } = await api.get("usuarios/vendedores") // Asegúrate de que esta ruta coincida con tu Node.js
  return data
}

// Petición POST para registrar el vendedor
export const createVendedor = async (vendedor: CreateVendedorInput): Promise<void> => {
  // Ajusta esta ruta si en tu backend el registro es /usuarios o /usuarios/registro
  await api.post("/usuarios", vendedor) 
}

export const updateVendedor = async ({ id, data }: { id: string; data: UpdateVendedorInput }): Promise<void> => {
  await api.put(`/usuarios/${id}`, data)
}

export const deleteVendedor = async (id: string): Promise<void> => {
  await api.delete(`/usuarios/${id}`)
}