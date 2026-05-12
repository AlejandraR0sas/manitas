import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { leccionesService, progresoService } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Leccion() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refrescarUsuario } = useAuth()
  const [leccion, setLeccion] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [fase, setFase] = useState('aprende')
  const [ejercicioActual, setEjercicioActual] = useState(0)
  const [puntos, setPuntos] = useState(0)
  const [videoActual, setVideoActual] = useState(0)
  const [completadaAntes, setCompletadaAntes] = useState(false)
const [mensajeFinal, setMensajeFinal] = useState('')

useEffect(() => {
  const cargar = async () => {
    try {
      const res = await leccionesService.obtenerUna(id)
      setLeccion(res.data)
      const tieneVideos = res.data.ejercicios.some(e => e.video)
      if (tieneVideos) setFase('video')
    } catch {
      console.error('Error al cargar lección')
    } finally {
      setCargando(false)
    }
  }
  cargar()
}, [id])

 const handleCompletar = async () => {
  try {
    const res = await progresoService.completar(id)

    setPuntos(res.data.puntos ?? 0)
    setCompletadaAntes(res.data.completadaAntes)
    setMensajeFinal(res.data.mensaje)

    await refrescarUsuario()

    setFase('completado')
  } catch {
    console.error('Error al completar lección')
  }
}

  const siguienteEjercicio = () => {
    const siguiente = ejercicioActual + 1
    if (siguiente < leccion.ejercicios.length) {
      setEjercicioActual(siguiente)
    } else {
      handleCompletar()
    }
  }

  const ejerciciosConVideo = leccion?.ejercicios.filter(e => e.video) || []
  const ejerciciosSinVideo = leccion?.ejercicios.filter(e => !e.video) || []
  const tieneVideos = ejerciciosConVideo.length > 0

  if (cargando) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0faf0' }}>
      <div className="text-center">
        <p className="text-4xl mb-3">⏳</p>
        <p className="text-gray-400 font-medium">Cargando lección...</p>
      </div>
    </div>
  )

  if (!leccion) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0faf0' }}>
      <p className="text-gray-400">Lección no encontrada</p>
    </div>
  )

  if (leccion.tipo === 'CAMARA') return (
    <div className="min-h-screen pb-24" style={{ background: '#f0faf0' }}>
      <div className="w-full px-6 pt-8 pb-16 mb-[-40px]"
        style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate('/modulos')} className="text-green-100 font-medium mb-4 flex items-center gap-1">
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-white">{leccion.titulo}</h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100">
          <p className="text-5xl mb-4">📷</p>
          <p className="text-gray-500 mb-6">Esta lección usa tu cámara para detectar señas en tiempo real</p>
          <button
            onClick={() => navigate('/camara')}
            className="text-white font-bold py-3 px-8 rounded-2xl transition-all transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #4FC3F7, #0288D1)' }}
          >
            📷 Ir a la cámara
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pb-24" style={{ background: '#f0faf0' }}>

      <div className="w-full px-6 pt-8 pb-16 mb-[-40px]"
        style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate('/modulos')} className="text-green-100 font-medium mb-4 flex items-center gap-1">
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-white mb-1">{leccion.titulo}</h1>
          <div className="flex gap-2 mt-3">
            {tieneVideos && (
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${fase === 'video' ? 'bg-white text-green-700' : 'bg-white/30 text-white'}`}>
                1. Ver videos
              </span>
            )}
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${fase === 'aprende' ? 'bg-white text-green-700' : 'bg-white/30 text-white'}`}>
              {tieneVideos ? '2.' : '1.'} Aprende
            </span>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${fase === 'practica' ? 'bg-white text-green-700' : 'bg-white/30 text-white'}`}>
              {tieneVideos ? '3.' : '2.'} Practica
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6">

        {/* FASE VIDEO */}
        {fase === 'video' && tieneVideos && (
          <div>
            <div className="bg-white rounded-2xl shadow-md p-6 mb-4 border border-gray-100">
              <p className="text-green-600 font-semibold text-sm mb-1">🎬 Observa cómo se hace</p>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Seña: <span className="text-green-600">{ejerciciosConVideo[videoActual]?.pregunta}</span>
              </h2>
              <div className="rounded-2xl overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
                <iframe
                  key={videoActual}
                  width="100%"
                  height="100%"
                  src={ejerciciosConVideo[videoActual]?.video}
                  title={ejerciciosConVideo[videoActual]?.pregunta}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                <span>Video {videoActual + 1} de {ejerciciosConVideo.length}</span>
                <div className="flex gap-1">
                  {ejerciciosConVideo.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setVideoActual(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === videoActual ? 'bg-green-500 w-4' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {videoActual > 0 && (
                <button
                  onClick={() => setVideoActual(videoActual - 1)}
                  className="flex-1 bg-white border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-2xl transition hover:border-green-400"
                >
                  ← Anterior
                </button>
              )}
              {videoActual + 1 < ejerciciosConVideo.length ? (
                <button
                  onClick={() => setVideoActual(videoActual + 1)}
                  className="flex-1 text-white font-bold py-3 rounded-2xl transition-all transform hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}
                >
                  Siguiente video →
                </button>
              ) : (
                <button
                  onClick={() => setFase('aprende')}
                  className="flex-1 text-white font-bold py-3 rounded-2xl transition-all transform hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}
                >
                  ¡Entendido! Ver resumen →
                </button>
              )}
            </div>
          </div>
        )}

        {/* FASE APRENDE */}
        {fase === 'aprende' && (
          <div>
            <div className="bg-white rounded-2xl shadow-md p-6 mb-4 border border-gray-100">
              <p className="text-green-600 font-semibold text-sm mb-4">📖 Repasa lo que aprendiste</p>
              <div className="grid grid-cols-2 gap-4">
                {leccion.ejercicios.map((ejercicio) => (
                  <div key={ejercicio.id} className="border border-gray-100 rounded-xl p-4 flex flex-col items-center">
                    <p className="text-4xl font-bold text-green-600 mb-3">{ejercicio.pregunta}</p>
                    {ejercicio.imagen && (
                      <img
                        src={ejercicio.imagen}
                        alt={ejercicio.pregunta}
                        className="w-32 h-32 object-contain rounded-xl"
                      />
                    )}
                    {ejercicio.video && !ejercicio.imagen && (
                      <span className="text-3xl">🎬</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => { setFase('practica'); setEjercicioActual(0) }}
              className="w-full text-white font-bold py-4 rounded-2xl transition-all transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}
            >
              ¡Listo! Vamos a practicar →
            </button>
          </div>
        )}

        {/* FASE PRACTICA */}
        {fase === 'practica' && (
          <div>
            <div className="bg-white rounded-2xl shadow-md p-6 mb-4 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <p className="text-green-600 font-semibold text-sm">✏️ Fase práctica</p>
                <p className="text-gray-400 text-sm">{ejercicioActual + 1} / {leccion.ejercicios.length}</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${((ejercicioActual + 1) / leccion.ejercicios.length) * 100}%` }}
                />
              </div>
              {leccion.ejercicios[ejercicioActual] && (
                <EjercicioCard
                  key={ejercicioActual}
                  ejercicio={leccion.ejercicios[ejercicioActual]}
                  todos={leccion.ejercicios}
                  onSiguiente={siguienteEjercicio}
                  tieneVideos={tieneVideos}
                />
              )}
            </div>
          </div>
        )}

        {/* FASE COMPLETADO */}
        {fase === 'completado' && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-100">
            <p className="text-6xl mb-4">🎉</p>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Lección completada!</h1>
            {completadaAntes ? (
  <p className="text-gray-400 mb-6">
    {mensajeFinal}
  </p>
) : (
  <p className="text-gray-400 mb-6">
    Ganaste <span className="text-green-600 font-bold">{puntos} puntos</span> y mantuviste tu racha 🔥
  </p>
)}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/modulos')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl transition"
              >
                Ver módulos
              </button>
              <button
                onClick={() => navigate('/inicio')}
                className="flex-1 text-white font-bold py-3 rounded-2xl transition-all transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}
              >
                Ir al inicio
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function EjercicioCard({ ejercicio, todos, onSiguiente, tieneVideos }) {
  const [seleccion, setSeleccion] = useState(null)
  const [respondido, setRespondido] = useState(false)
  const [mostrarVideo, setMostrarVideo] = useState(false)

  const opciones = useMemo(() => generarOpciones(ejercicio, todos), [ejercicio.id])
  const correcto = seleccion === ejercicio.respuestaCorrecta

  const handleSeleccion = (opcion) => {
    if (respondido) return
    setSeleccion(opcion)
    setRespondido(true)
  }

  return (
    <div>
      {tieneVideos ? (
        <div>
          <p className="text-center text-gray-500 text-sm mb-3">¿Qué significa esta seña?</p>
          {ejercicio.video && (
            <div>
              <div className="rounded-2xl overflow-hidden mb-4 border border-gray-100" style={{ aspectRatio: '16/9' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={`${ejercicio.video}?autoplay=0`}
                  title={ejercicio.pregunta}
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-center text-gray-500 text-sm mb-2">¿Qué letra representa esta seña?</p>
          {ejercicio.imagen && (
            <img
              src={ejercicio.imagen}
              alt="seña"
              className="w-52 h-52 object-contain rounded-2xl mx-auto mb-6 border border-gray-100"
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        {opciones.map((opcion) => (
          <button
            key={opcion}
            onClick={() => handleSeleccion(opcion)}
            className={`py-4 px-4 rounded-2xl font-bold text-lg transition-all border-2
              ${!respondido ? 'border-gray-200 hover:border-green-400 hover:bg-green-50 text-gray-700' : ''}
              ${respondido && opcion === ejercicio.respuestaCorrecta ? 'border-green-500 bg-green-100 text-green-700' : ''}
              ${respondido && opcion === seleccion && opcion !== ejercicio.respuestaCorrecta ? 'border-red-400 bg-red-100 text-red-600' : ''}
              ${respondido && opcion !== seleccion && opcion !== ejercicio.respuestaCorrecta ? 'border-gray-100 text-gray-300' : ''}
            `}
          >
            {opcion}
          </button>
        ))}
      </div>

      {respondido && (
        <div className={`rounded-2xl p-4 mb-4 text-center ${correcto ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          <p className="font-bold text-lg">{correcto ? '¡Correcto! 🎉' : `Era: ${ejercicio.respuestaCorrecta} 😅`}</p>
        </div>
      )}

      {respondido && (
        <button
          onClick={onSiguiente}
          className="w-full text-white font-bold py-3 rounded-2xl transition-all transform hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}
        >
          Siguiente →
        </button>
      )}
    </div>
  )
}

function generarOpciones(ejercicioActual, todos) {
  const correcta = ejercicioActual.respuestaCorrecta
  const otras = todos
    .filter(e => e.respuestaCorrecta !== correcta)
    .map(e => e.respuestaCorrecta)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
  return [correcta, ...otras].sort(() => Math.random() - 0.5)
}