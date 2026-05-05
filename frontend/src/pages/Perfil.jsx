import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Perfil() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: '#f0faf0' }}>

      {/* HEADER */}
      <div
        className="w-full px-6 pt-8 pb-14 mb-[-30px]"
        style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <span className="text-3xl">👤</span>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Mi perfil
            </h1>
            <p className="text-green-100 text-sm">
              Tu progreso en LSM 📈
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6">

        {/* CARD PRINCIPAL */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-4 border border-gray-100">

          {/* INFO USUARIO */}
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-sm">
              🤙
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">
                {usuario?.nombre}
              </p>
              <p className="text-gray-400 text-sm">
                {usuario?.email}
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-3 text-center">

            <div className="bg-orange-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-orange-500">
                🔥 {usuario?.rachaActual || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Racha actual
              </p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-yellow-500">
                ⭐ {usuario?.puntosTotales || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Puntos
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-green-500">
                🏅 {usuario?.rachaMaxima || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Racha máxima
              </p>
            </div>

          </div>
        </div>

        {/* ACCIONES */}
        <div className="space-y-3">

          <button
            onClick={handleLogout}
            className="w-full bg-white border border-red-200 text-red-500 font-semibold py-3 rounded-xl transition hover:bg-red-50"
          >
            Cerrar sesión
          </button>

        </div>

      </div>
    </div>
  )
}