import { useEffect, useState } from 'react'
import { modulosService, progresoService } from '../services/api'
import { Link } from 'react-router-dom'

const colorNivel = {
  BASICO: 'bg-green-100 text-green-700',
  INTERMEDIO: 'bg-yellow-100 text-yellow-700',
  AVANZADO: 'bg-red-100 text-red-700',
}

export default function Modulos() {
  const [modulos, setModulos] = useState([])
  const [progreso, setProgreso] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resModulos, resProgreso] = await Promise.all([
          modulosService.obtenerTodos(),
          progresoService.obtener()
        ])
        setModulos(resModulos.data)
        setProgreso(resProgreso.data)
      } catch {
        console.error('Error al cargar módulos')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const leccionCompletada = (leccionId) => {
    return progreso.some(p => p.leccionId === leccionId && p.completado)
  }

  const progresoModulo = (lecciones) => {
    const completadas = lecciones.filter(l => leccionCompletada(l.id)).length
    return { completadas, total: lecciones.length }
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: '#f0faf0' }}>

      {/* HEADER tipo Inicio */}
      <div
        className="w-full px-6 pt-8 pb-14 mb-[-30px]"
        style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <span className="text-3xl">📚</span>
          <h1 className="text-2xl font-bold text-white">
            Módulos
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6">

        {cargando ? (
          <p className="text-center text-gray-400 mt-10">Cargando...</p>
        ) : modulos.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No hay módulos disponibles aún
          </p>
        ) : (
          <div className="space-y-4">

            {modulos.map((modulo) => {
              const { completadas, total } = progresoModulo(modulo.lecciones)
              const porcentaje = Math.round((completadas / total) * 100)
              const moduloCompleto = completadas === total

              return (
                <div
                  key={modulo.id}
                  className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"
                >

                  {/* HEADER MODULO */}
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-gray-800">
                      {moduloCompleto && '✅ '}
                      {modulo.titulo}
                    </h2>

                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colorNivel[modulo.nivel]}`}>
                      {modulo.nivel}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">
                    {modulo.descripcion}
                  </p>

                  {/* PROGRESO */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{completadas} de {total}</span>
                      <span>{porcentaje}%</span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>

                  {/* LECCIONES */}
                  <div className="space-y-2">
                    {modulo.lecciones.map((leccion) => {
                      const completada = leccionCompletada(leccion.id)

                      return (
                        <Link
                          key={leccion.id}
                          to={`/leccion/${leccion.id}`}
                          className={`flex items-center gap-3 rounded-xl p-3 transition-all
                            ${completada
                              ? 'bg-green-50 hover:bg-green-100'
                              : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                        >
                          <span className="text-xl">
                            {completada
                              ? '✅'
                              : leccion.tipo === 'TEORIA'
                              ? '📖'
                              : leccion.tipo === 'PRACTICA'
                              ? '✏️'
                              : '📷'}
                          </span>

                          <div className="flex-1">
                            <p className={`font-semibold ${completada ? 'text-green-700' : 'text-gray-700'}`}>
                              {leccion.titulo}
                            </p>
                            <p className="text-xs text-gray-400">
                              ⭐ {leccion.puntosRecompensa} puntos
                            </p>
                          </div>

                          {completada && (
                            <span className="text-xs font-bold text-green-600 bg-green-200 px-2 py-1 rounded-full">
                              ✔
                            </span>
                          )}
                        </Link>
                      )
                    })}
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