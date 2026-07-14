import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Users, MapPin } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta de Vendedores usando Shadcn */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">
              Vendedores Activos
            </CardTitle>
            <Users className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">12</div>
          </CardContent>
        </Card>

        {/* Tarjeta de Clientes usando Shadcn */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">
              Clientes Totales
            </CardTitle>
            <MapPin className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">148</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}