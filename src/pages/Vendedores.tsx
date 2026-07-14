import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getVendedores, createVendedor, updateVendedor, deleteVendedor, type CreateVendedorInput, type UpdateVendedorInput } from "@/features/vendedores/api/vendedores"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Plus, UserPlus, Loader2, Pencil, Trash2, AlertTriangle } from "lucide-react"

export default function Vendedores() {
  const queryClient = useQueryClient()
  
  // Estado para modal de Creación/Edición
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Estado para modal de Confirmación de Eliminar (Borrado Lógico)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [vendedorToDelete, setVendedorToDelete] = useState<{ id: string; nombre: string } | null>(null)

  // Estado del formulario
  const [nombre, setNombre] = useState("")
  const [dni, setDni] = useState("")
  const [password, setPassword] = useState("")
  const [estadoActivo, setEstadoActivo] = useState(true)

  const { data: vendedores, isLoading, isError } = useQuery({
    queryKey: ["vendedores"],
    queryFn: getVendedores,
  })

  const resetForm = () => {
    setNombre("")
    setDni("")
    setPassword("")
    setEstadoActivo(true)
    setEditingId(null)
    setIsEditing(false)
  }

  const handleOpenCreate = () => {
    resetForm()
    setIsOpen(true)
  }

  const handleOpenEdit = (vendedor: any) => {
    setNombre(vendedor.nombre_completo)
    setDni(vendedor.dni)
    setEstadoActivo(vendedor.estado)
    setEditingId(vendedor.id)
    setIsEditing(true)
    setIsOpen(true)
  }

  // Mutaciones
  const createMutation = useMutation({
    mutationFn: createVendedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendedores"] })
      setIsOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateVendedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendedores"] })
      setIsOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteVendedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendedores"] })
      setIsDeleteOpen(false)
      setVendedorToDelete(null)
    },
    onError: (error: any) => {
      setIsDeleteOpen(false)
      alert(error.response?.data?.error || "Error al desactivar el vendedor")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && editingId) {
      updateMutation.mutate({
        id: editingId,
        data: { nombre_completo: nombre, dni, estado: estadoActivo }
      })
    } else {
      createMutation.mutate({ nombre_completo: nombre, dni, password_hash: password })
    }
  }

  // Abre el nuevo modal de confirmación elegante
  const handleOpenDeleteConfirm = (id: string, nombre: string) => {
    setVendedorToDelete({ id, nombre })
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (vendedorToDelete) {
      deleteMutation.mutate(vendedorToDelete.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gestión de Vendedores</h1>

        <Button onClick={handleOpenCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Plus className="w-4 h-4" /> Nuevo Vendedor
        </Button>

        {/* 📝 DIALOG DE CREACIÓN Y EDICIÓN */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                {isEditing ? "Editar Vendedor" : "Registrar Vendedor"}
              </DialogTitle>
              <DialogDescription>
                {isEditing ? "Modifica los datos del vendedor." : "Ingresa los datos para dar de alta al vendedor."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nombre Completo</label>
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">DNI</label>
                <Input value={dni} onChange={(e) => setDni(e.target.value)} required />
              </div>
              
              {!isEditing && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Contraseña de acceso</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              )}

              {isEditing && (
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
                  <label className="text-sm font-medium text-slate-700">Estado del Vendedor</label>
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

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                  ) : (
                    "Guardar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 🚨 ALERT DIALOG DE CONFIRMACIÓN (BORRADO LÓGICO ESTILIZADO) */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                ¿Confirmas dar de baja al vendedor?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  Estás a punto de inactivar a <strong className="text-slate-900">{vendedorToDelete?.nombre}</strong>.
                </p>
                <p className="text-xs text-slate-500">
                  Esto le bloqueará el acceso a la aplicación móvil inmediatamente, pero conservaremos todos sus registros históricos de clientes y visitas intactos en la base de datos.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setVendedorToDelete(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                ) : (
                  "Sí, dar de baja"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="rounded-md border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Nombre Completo</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Clientes Asignados</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-[80px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-[80px]" /></TableCell>
                </TableRow>
              ))
            ) : (
              vendedores?.map((vendedor) => (
                <TableRow key={vendedor.id}>
                  <TableCell className="font-medium text-slate-700">{vendedor.nombre_completo}</TableCell>
                  <TableCell className="text-slate-500 font-mono">{vendedor.dni}</TableCell>
                  <TableCell><span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-sm font-semibold">{vendedor.clientes_asignados}</span></TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${vendedor.estado ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {vendedor.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:border-blue-200" onClick={() => handleOpenEdit(vendedor)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:border-red-200" 
                        onClick={() => handleOpenDeleteConfirm(vendedor.id, vendedor.nombre_completo)}
                      >
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