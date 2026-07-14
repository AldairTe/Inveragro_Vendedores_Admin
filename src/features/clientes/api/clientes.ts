import { api } from "@/config/axios"

export interface Cliente {
  id: string;
  nombre_fundo: string;
  nombre_contacto: string;
  telefono: string;
  latitud: number;
  longitud: number;
  vendedor_id: string;
  vendedor_nombre?: string;
  estado?: boolean; // Añadimos el estado aquí
}

export interface CreateClienteInput {
  nombre_fundo: string;
  nombre_contacto: string;
  telefono: string;
  latitud: number;
  longitud: number;
  vendedor_id: string;
}

export interface UpdateClienteInput extends CreateClienteInput {
  estado: boolean;
}

export const getClientes = async (): Promise<Cliente[]> => {
  const { data } = await api.get("/clientes")
  return data
}

export const createCliente = async (cliente: CreateClienteInput): Promise<void> => {
  await api.post("/clientes", cliente)
}

// Nuevas peticiones
export const updateCliente = async ({ id, data }: { id: string; data: UpdateClienteInput }): Promise<void> => {
  await api.put(`/clientes/${id}`, data)
}

export const deleteCliente = async (id: string): Promise<void> => {
  await api.delete(`/clientes/${id}`)
}