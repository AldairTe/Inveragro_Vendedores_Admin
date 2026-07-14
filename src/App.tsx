import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AdminLayout from "./layouts/AdminLayout"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Vendedores from "./pages/Vendedores"
import ProtectedRoute from "./shared/ProtectedRoute"
import Clientes from "./pages/Clientes"
import Configuracion from "./pages/Configuracion"
import Reportes from "./pages/Reportes"
import Visitas from "./pages/Visitas"

// Instanciamos el cliente de React Query
const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute reverse />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Dashboard />} />
              {<Route path="/vendedores" element={<Vendedores />} /> }
              {<Route path="/clientes" element={<Clientes />} /> }
              {<Route path="/visitas" element={<Visitas />} /> }
              {<Route path="/reportes" element={<Reportes />} /> }
              {<Route path="/configuracion" element={<Configuracion />} /> }
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}