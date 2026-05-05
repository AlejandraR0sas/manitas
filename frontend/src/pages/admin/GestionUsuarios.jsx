import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'
import { useNavigate } from 'react-router-dom'

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await adminService.obtenerUsuarios()
        setUsuarios(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  return (
    <div className="min-h-screen pb-24" style={{ background: '#f0faf0' }}>
      <div className="w-full px-6 pt-8 pb-14 mb-[-30px]"
        style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/admin')}
            className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 mb-3"
          >
            ← Volver al panel
          </button>
          <h1 className="text-2xl font-bold text-white">👥 Usuarios</h1>
          <p className="text-green-100 text-sm">Administra cuentas registradas</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        {cargando ? (
          <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100">
            <p className="text-gray-400 animate-pulse">Cargando usuarios...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100">
            <p className="text-gray-400">No hay usuarios registrados</p>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">
              {usuarios.length} usuarios registrados
            </p>
            <div className="space-y-3">
              {usuarios.map((u) => (
                <div key={u.id}
                  className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 border border-gray-100 transition-all hover:shadow-lg">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center text-xl">🤙</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{u.nombre}</p>
                    <p className="text-gray-400 text-sm">{u.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-500 font-bold text-sm">⭐ {u.puntosTotales}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.rol === 'ADMIN' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {u.rol}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}