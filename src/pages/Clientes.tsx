import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getClientes, createCliente, updateCliente, deleteCliente, type CreateClienteInput, type UpdateClienteInput } from "@/features/clientes/api/clientes"
import { getVendedores } from "@/features/vendedores/api/vendedores"
import { cn } from "@/lib/utils"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MapPin, Plus, Loader2, Check, ChevronsUpDown, Pencil, Trash2, AlertTriangle } from "lucide-react"

export default function Clientes() {
  const queryClient = useQueryClient()
  
  // Estados de Modales
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<{ id: string; nombre: string } | null>(null)
  const [openCombo, setOpenCombo] = useState(false)
  
  // Estado del formulario
  const [nombreFundo, setNombreFundo] = useState("")
  const [nombreContacto, setNombreContacto] = useState("")
  const [telefono, setTelefono] = useState("")
  const [latitud, setLatitud] = useState("")
  const [longitud, setLongitud] = useState("")
  const [vendedorId, setVendedorId] = useState("")
  const [estadoActivo, setEstadoActivo] = useState(true)

  // Queries
  const { data: clientes, isLoading: isLoadingClientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: getClientes,
  })

  const { data: vendedores } = useQuery({
    queryKey: ["vendedores"],
    queryFn: getVendedores,
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      setIsOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      setIsOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      setIsDeleteOpen(false)
    },
  })

  const resetForm = () => {
    setNombreFundo("")
    setNombreContacto("")
    setTelefono("")
    setLatitud("")
    setLongitud("")
    setVendedorId("")
    setEstadoActivo(true)
    setIsEditing(false)
    setEditingId(null)
  }

  const handleOpenCreate = () => {
    resetForm()
    setIsOpen(true)
  }

  const handleOpenEdit = (cliente: any) => {
    setNombreFundo(cliente.nombre_fundo)
    setNombreContacto(cliente.nombre_contacto || "")
    setTelefono(cliente.telefono || "")
    setLatitud(cliente.latitud.toString())
    setLongitud(cliente.longitud.toString())
    setVendedorId(cliente.vendedor_id)
    setEstadoActivo(cliente.estado ?? true)
    setEditingId(cliente.id)
    setIsEditing(true)
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendedorId) return alert("Debes asignar un vendedor")

    const clienteData = {
      nombre_fundo: nombreFundo,
      nombre_contacto: nombreContacto,
      telefono,
      latitud: parseFloat(latitud),
      longitud: parseFloat(longitud),
      vendedor_id: vendedorId
    }

    if (isEditing && editingId) {
      updateMutation.mutate({
        id: editingId,
        data: { ...clienteData, estado: estadoActivo }
      })
    } else {
      createMutation.mutate(clienteData)
    }
  }

  const handleOpenDelete = (id: string, nombre: string) => {
    setClienteToDelete({ id, nombre })
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (clienteToDelete) deleteMutation.mutate(clienteToDelete.id)
  }

  const vendedorSeleccionado = vendedores?.find(v => v.id === vendedorId)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gestión de Clientes (Fundos)</h1>

        <Button onClick={handleOpenCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Plus className="w-4 h-4" /> Nuevo Fundo
        </Button>

        {/* MODAL DE CREACIÓN / EDICIÓN */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                {isEditing ? "Editar Fundo" : "Registrar Fundo"}
              </DialogTitle>
              <DialogDescription>
                {isEditing ? "Modifica los datos y asignación del fundo." : "Ingresa los datos geográficos y asigna un vendedor."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nombre del Fundo</label>
                  <Input placeholder="Ej. Hacienda Las Lomas" value={nombreFundo} onChange={(e) => setNombreFundo(e.target.value)} required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Contacto</label>
                  <Input placeholder="Nombre del encargado" value={nombreContacto} onChange={(e) => setNombreContacto(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Teléfono</label>
                  <Input placeholder="Ej. 987654321" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Latitud</label>
                  <Input type="number" step="any" placeholder="-12.04318" value={latitud} onChange={(e) => setLatitud(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Longitud</label>
                  <Input type="number" step="any" placeholder="-77.02824" value={longitud} onChange={(e) => setLongitud(e.target.value)} required />
                </div>

                {/* COMBOBOX DE VENDEDORES */}
                <div className="col-span-2 space-y-2 flex flex-col">
                  <label className="text-sm font-medium text-slate-700">Vendedor Asignado</label>
                  <Popover open={openCombo} onOpenChange={setOpenCombo}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={openCombo} className={cn("w-full justify-between font-normal", !vendedorId && "text-slate-500")}>
                        {vendedorId ? vendedorSeleccionado?.nombre_completo : "Buscar un vendedor..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[450px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Escribe para filtrar vendedores..." />
                        <CommandList>
                          <CommandEmpty>No se encontró ningún vendedor.</CommandEmpty>
                          <CommandGroup>
                            {vendedores?.filter(v => v.estado).map((vendedor) => ( // Filtramos para solo asignar a activos
                              <CommandItem key={vendedor.id} value={vendedor.nombre_completo} onSelect={() => { setVendedorId(vendedor.id); setOpenCombo(false); }}>
                                <Check className={cn("mr-2 h-4 w-4 text-emerald-600", vendedorId === vendedor.id ? "opacity-100" : "opacity-0")} />
                                {vendedor.nombre_completo} <span className="text-slate-400 text-xs ml-2">({vendedor.dni})</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* BOTÓN DE ESTADO (SOLO EDICIÓN) */}
                {isEditing && (
                  <div className="col-span-2 flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50 mt-2">
                    <label className="text-sm font-medium text-slate-700">Estado del Fundo</label>
                    <Button 
                      type="button" 
                      variant={estadoActivo ? "default" : "destructive"}
                      className={estadoActivo ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-red-100 text-red-700 hover:bg-red-200"}
                      onClick={() => setEstadoActivo(!estadoActivo)}
                    >
                      {estadoActivo ? "Activo" : "Inactivo"}
                    </Button>
                  </div>
                )}
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={createMutation.isPending || updateMutation.isPending || !vendedorId}>
                  {(createMutation.isPending || updateMutation.isPending) ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : "Guardar Fundo"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ALERT DIALOG ELIMINAR */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                ¿Confirmas dar de baja este fundo?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Estás a punto de inactivar a <strong className="text-slate-900">{clienteToDelete?.nombre}</strong>. El vendedor ya no lo verá en su ruta móvil, pero su historial de visitas quedará guardado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setClienteToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white" disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : "Sí, dar de baja"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* TABLA DE CLIENTES */}
      <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Nombre Fundo</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Vendedor Asignado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingClientes ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-[80px]" /></TableCell>
                </TableRow>
              ))
            ) : clientes?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-500 py-6">
                  No hay fundos registrados.
                </TableCell>
              </TableRow>
            ) : (
              clientes?.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium text-slate-800">{cliente.nombre_fundo}</TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-700">{cliente.nombre_contacto || "Sin contacto"}</div>
                    <div className="text-xs text-slate-500">{cliente.telefono}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      {cliente.vendedor_nombre || "Sin asignar"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${cliente.estado !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {cliente.estado !== false ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:border-blue-200" onClick={() => handleOpenEdit(cliente)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50 hover:border-red-200" onClick={() => handleOpenDelete(cliente.id, cliente.nombre_fundo)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}