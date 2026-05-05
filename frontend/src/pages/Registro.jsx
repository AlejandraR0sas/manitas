import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'

export default function Registro() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const res = await authService.registro({ nombre, email, password })
      login(res.data.token, res.data.usuario)
      navigate('/inicio')
    } catch {
      setError('Error al registrarse, intenta con otro email')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(circle at top, #4CAF50 0%, #2E7D32 40%, #0f172a 100%)' }}
    >
      <div className="w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo.png"
            alt="Manitas"
            className="w-40 h-40 object-contain mb-4"
            style={{ filter: 'drop-shadow(0 0 20px rgba(76, 175, 80, 0.7))' }}
          />
          <p className="text-lg font-semibold text-green-200 tracking-wide">
            Crea tu cuenta y empieza a aprender
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/30">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            ¡Únete a Manitas! 
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition text-gray-700"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition text-gray-700"
                placeholder="tucorreo@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition text-gray-700"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-center">
                <p className="text-red-500 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full text-white font-bold py-4 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl text-lg"
              style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}
            >
              {cargando ? '⏳ Creando cuenta...' : '¡Crear mi cuenta gratis! '}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="font-bold hover:underline"
              style={{ color: '#4CAF50' }}
            >
              Inicia sesión
            </Link>
          </p>
        </div>

        <p className="text-center mt-6 text-sm font-medium" style={{ color: '#4FC3F7' }}>
          🤟 Aprender LSM es aprender a incluir
        </p>

      </div>
    </div>
  )
}