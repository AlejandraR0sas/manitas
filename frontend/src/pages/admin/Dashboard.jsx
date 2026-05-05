import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await adminService.obtenerEstadisticas()
        setStats(res.data)
      } catch {
        console.error('Error al cargar estadísticas')
      }
    }
    cargar()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: '#f0faf0' }}>
      <div className="w-full px-6 pt-8 pb-14 mb-[-30px]"
        style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛠️</span>
              <div>
                <h1 className="text-2xl font-bold text-white">Panel administrador</h1>
                <p className="text-green-100 text-sm">Control total de la app</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl transition flex items-center gap-2 text-sm"
            >
              🚪 Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-5 text-center border border-gray-100">
            <p className="text-3xl font-bold text-green-600">{stats?.totalUsuarios ?? '-'}</p>
            <p className="text-gray-400 text-sm mt-1">Usuarios</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5 text-center border border-gray-100">
            <p className="text-3xl font-bold text-blue-500">{stats?.totalLecciones ?? '-'}</p>
            <p className="text-gray-400 text-sm mt-1">Lecciones</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5 text-center border border-gray-100">
            <p className="text-3xl font-bold text-yellow-500">{stats?.totalCompletadas ?? '-'}</p>
            <p className="text-gray-400 text-sm mt-1">Completadas</p>
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">Administración</p>

        <div className="grid grid-cols-1 gap-3">
          <Link to="/admin/usuarios"
            className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 border border-gray-100 transition-all hover:shadow-lg hover:border-green-200">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>👥</div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">Usuarios</p>
              <p className="text-gray-400 text-sm">Gestiona cuentas registradas</p>
            </div>
            <span className="text-gray-300 text-xl font-light">›</span>
          </Link>

          <Link to="/admin/lecciones"
            className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 border border-gray-100 transition-all hover:shadow-lg hover:border-blue-200">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4FC3F7, #0288D1)' }}>📚</div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">Módulos y lecciones</p>
              <p className="text-gray-400 text-sm">Crea y administra el contenido</p>
            </div>
            <span className="text-gray-300 text-xl font-light">›</span>
          </Link>
        </div>
      </div>
    </div>
  )
}