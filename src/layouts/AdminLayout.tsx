import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  LogOut, 
  Menu,
  ChevronLeft,
  ChevronRight,
  CalendarCheck, // Para Visitas
  BarChart3,    // Para Reportes
  Settings,     // Para Configuración
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout) // Agrega esto arriba con los estados

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Vendedores", path: "/vendedores", icon: Users },
    { name: "Rutas/Clientes", path: "/clientes", icon: MapPin },
    { name: "Visitas", icon: CalendarCheck, path: "/visitas" },
  { name: "Reportes", icon: BarChart3, path: "/reportes" },
  { name: "Configuración", icon: Settings, path: "/configuracion" },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar Lateral */}
      <aside 
        className={cn(
          "bg-white border-r border-slate-200 hidden md:flex flex-col transition-all duration-300 relative",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header del Sidebar */}
        <div className={cn(
          "h-16 flex items-center border-b border-slate-200 transition-all",
          isCollapsed ? "justify-center px-0" : "justify-between px-6"
        )}>
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-emerald-600 truncate animate-in fade-in duration-200">
              Inveragro ERP
            </h2>
          )}
          {isCollapsed && (
            <span className="text-xl font-black text-emerald-600 animate-in zoom-in duration-200">
              I
            </span>
          )}
        </div>

        {/* Botón de Colapsar de Shadcn (Flotante en el borde) */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-3 top-10 h-6 w-6 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-100 z-10 hidden md:flex items-center justify-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-500" />
          )}
        </Button>
        
        {/* Navegación */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative",
                  isActive 
                    ? "bg-emerald-50 text-emerald-700 font-medium" 
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-emerald-700" : "text-slate-500")} />
                
                {/* Texto del Menú (Se oculta suavemente al colapsar) */}
                <span className={cn(
                  "transition-all duration-300 truncate",
                  isCollapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto"
                )}>
                  {item.name}
                </span>

                {/* Tooltip Flotante (Solo visible cuando está colapsado y haces hover) */}
                {isCollapsed && (
                  <div className="absolute left-14 rounded-md px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer del Sidebar con Botón de Cerrar Sesión de Shadcn */}
        <div className="p-3 border-t border-slate-200">
          <Button 
            variant="ghost" 
            onClick={logout}
            className={cn(
              "w-full flex items-center justify-start gap-3 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors px-3 py-2.5 h-auto group relative",
              isCollapsed ? "justify-center px-0" : "justify-start"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={cn(
              "transition-all duration-300 truncate",
              isCollapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto"
            )}>
              Cerrar Sesión
            </span>

            {/* Tooltip de Cerrar Sesión */}
            {isCollapsed && (
              <div className="absolute left-14 rounded-md px-2.5 py-1.5 bg-red-600 text-white text-xs font-semibold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                Cerrar Sesión
              </div>
            )}
          </Button>
        </div>
      </aside>

      {/* Área Principal (min-w-0 evita que el flexbox se desborde) */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Navbar Superior con Botón de Shadcn */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <Button variant="ghost" size="icon" className="md:hidden text-slate-500">
            <Menu className="w-6 h-6" />
          </Button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">Admin General</span>
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
              A
            </div>
          </div>
        </header>

        {/* Contenedor Dinámico de las Páginas */}
        <div className="p-6 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}