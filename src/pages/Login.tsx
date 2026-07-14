import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { KeyRound, Mail, Loader2 } from "lucide-react"

export default function Login() {
  const loginStore = useAuthStore((state) => state.login)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // TODO: Aquí irá la llamada real a tu API Node.js con Axios
      // Simulemos un delay de red de 1.5 segundos
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (email === "admin@inveragro.com" && password === "admin123") {
        // Simulamos la respuesta del backend (JWT + Nombre del Admin)
        const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken..."
        loginStore(mockToken, "Admin General")
      } else {
        setError("Credenciales incorrectas. Intenta de nuevo.")
      }
    } catch (err) {
      setError("Error de conexión con el servidor.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
            Inveragro ERP
          </CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al panel de control
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center animate-in fade-in duration-200">
                {error}
              </div>
            )}
            
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="admin@inveragro.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Contraseña</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}