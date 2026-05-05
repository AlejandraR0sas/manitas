import { useEffect, useState } from 'react'
import { rankingService } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Ranking() {
  const [ranking, setRanking] = useState([])
  const [cargando, setCargando] = useState(true)
  const { usuario } = useAuth()

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await rankingService.obtener()
        setRanking(res.data)
      } catch {
        console.error('Error al cargar ranking')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const medalla = (pos) => {
    if (pos === 1) return '🥇'
    if (pos === 2) return '🥈'
    if (pos === 3) return '🥉'
    return `#${pos}`
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: '#f0faf0' }}>

      {/* HEADER estilo Inicio */}
      <div
        className="w-full px-6 pt-8 pb-14 mb-[-30px]"
        style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Ranking global
            </h1>
            <p className="text-green-100 text-sm">
              Compite y sube posiciones 🚀
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6">

        {cargando ? (
          <p className="text-center text-gray-400 mt-10">Cargando...</p>
        ) : ranking.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            Aún no hay usuarios en el ranking
          </p>
        ) : (
          <div className="space-y-3">

            {ranking.map((u) => {
              const esTop3 = u.posicion <= 3
              const esUsuario = u.id === usuario?.id

              return (
                <div
                  key={u.id}
                  className={`bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 border transition-all
                  ${esUsuario ? 'border-2 border-green-400 scale-[1.02]' : 'border-gray-100'}
                  ${esTop3 ? 'shadow-lg' : ''}
                  `}
                >

                  {/* POSICIÓN */}
                  <div className={`w-10 text-center text-2xl font-bold ${esTop3 ? '' : 'text-gray-400'}`}>
                    {medalla(u.posicion)}
                  </div>

                  {/* INFO */}
                  <div className="flex-1">
                    <p className={`font-bold ${esUsuario ? 'text-green-700' : 'text-gray-800'}`}>
                      {u.nombre} {esUsuario && '🔥'}
                    </p>
                    <p className="text-sm text-gray-400">
                      🔥 {u.rachaActual} días de racha
                    </p>
                  </div>

                  {/* PUNTOS */}
                  <div className="text-right">
                    <p className="text-yellow-500 font-bold text-lg">
                      ⭐ {u.puntosTotales}
                    </p>
                    <p className="text-xs text-gray-400">
                      puntos
                    </p>
                  </div>

                </div>
              )
            })}

          </div>
        )}
      </div>
    </div>
  )
}