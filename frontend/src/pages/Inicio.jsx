import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Inicio() {
  const { usuario, refrescarUsuario } = useAuth()

  useEffect(() => {
    refrescarUsuario()
  }, [])

  return (
    <div className="min-h-screen pb-24" style={{ background: '#f0faf0' }}>

      <div className="w-full px-6 pt-8 pb-16 mb-[-40px]"
        style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <img src="/logo.png" alt="Manitas" className="w-14 h-14 object-contain drop-shadow-lg" />
          <div>
            <h1 className="text-2xl font-bold text-white">
              ¡Hola, {usuario?.nombre}! 🤙
            </h1>
            <p className="text-green-100 text-sm">¿Listo para aprender hoy?</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6">

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-5 text-center border border-gray-100">
            <p className="text-3xl font-bold text-orange-500 mb-1">🔥 {usuario?.rachaActual || 0}</p>
            <p className="text-gray-400 text-sm">Racha actual</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5 text-center border border-gray-100">
            <p className="text-3xl font-bold text-yellow-500 mb-1">⭐ {usuario?.puntosTotales || 0}</p>
            <p className="text-gray-400 text-sm">Puntos totales</p>
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">
          ¿Qué quieres hacer hoy?
        </p>

        <div className="grid grid-cols-1 gap-3">
          <Link
            to="/modulos"
            className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 border border-gray-100 transition-all hover:shadow-lg hover:border-green-200"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
              📚
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">Lecciones</p>
              <p className="text-gray-400 text-sm">Aprende nuevas señas</p>
            </div>
            <span className="text-gray-300 text-xl font-light">›</span>
          </Link>

          <Link
            to="/camara"
            className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 border border-gray-100 transition-all hover:shadow-lg hover:border-blue-200"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4FC3F7, #0288D1)' }}>
              📷
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">Practica con tu cámara</p>
              <p className="text-gray-400 text-sm">Detecta tus señas en tiempo real</p>
            </div>
            <span className="text-gray-300 text-xl font-light">›</span>
          </Link>

          <Link
            to="/ranking"
            className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 border border-gray-100 transition-all hover:shadow-lg hover:border-yellow-200"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #FFD700, #F57F17)' }}>
              🏆
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">Ranking</p>
              <p className="text-gray-400 text-sm">Ve tu posición global</p>
            </div>
            <span className="text-gray-300 text-xl font-light">›</span>
          </Link>
        </div>
      </div>
    </div>
  )
}