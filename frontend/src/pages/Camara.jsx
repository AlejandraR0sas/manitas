import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { progresoService } from '../services/api'

const LETRAS_PRACTICA = ['A', 'B', 'C', 'D', 'L', 'O', 'V', 'W']

export default function Camara() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const navigate = useNavigate()
  const [modo, setModo] = useState('practica')
  const [letraActual, setLetraActual] = useState(0)
  const [letraDetectada, setLetraDetectada] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [correctas, setCorrectas] = useState(0)
  const [puntosGanados, setPuntosGanados] = useState(0)
const [mensajeFinal, setMensajeFinal] = useState('')
  const [fase, setFase] = useState('practica')
  const [textoTraducido, setTextoTraducido] = useState('')
  const [ultimaLetraHablada, setUltimaLetraHablada] = useState(null)
  const handsRef = useRef(null)
  const cameraRef = useRef(null)
  const letraActualRef = useRef(0)
  const resultadoRef = useRef(null)
  const modoRef = useRef('practica')
  const ultimaLetraRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    letraActualRef.current = letraActual
  }, [letraActual])

  useEffect(() => {
    resultadoRef.current = resultado
  }, [resultado])

  useEffect(() => {
    modoRef.current = modo
  }, [modo])

  useEffect(() => {
    const iniciar = () => {
      const hands = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      })

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      })

      hands.onResults((results) => {
        const canvas = canvasRef.current
        const video = videoRef.current
        if (!canvas || !video) return

        const ctx = canvas.getContext('2d')
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

        if (results.multiHandLandmarks?.length > 0) {
          const landmarks = results.multiHandLandmarks[0]
          window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 2 })
          window.drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 1, radius: 3 })

          const letra = detectarLetra(landmarks)
          setLetraDetectada(letra)

          if (modoRef.current === 'practica') {
            if (letra && letra === LETRAS_PRACTICA[letraActualRef.current] && !resultadoRef.current) {
              setResultado('correcto')
              setCorrectas(prev => prev + 1)
            }
          } else if (modoRef.current === 'traductor') {
            if (letra && letra !== ultimaLetraRef.current) {
              clearTimeout(timerRef.current)
              timerRef.current = setTimeout(() => {
                ultimaLetraRef.current = letra
                setTextoTraducido(prev => prev + letra)
                hablar(letra)
              }, 1000)
            } else if (!letra) {
              ultimaLetraRef.current = null
            }
          }
        } else {
          setLetraDetectada(null)
          if (modoRef.current === 'traductor') {
            ultimaLetraRef.current = null
          }
        }
      })

      handsRef.current = hands

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current) {
            await handsRef.current.send({ image: videoRef.current })
          }
        },
        width: 640,
        height: 480
      })

      camera.start().then(() => {
        setCargando(false)
      }).catch((err) => {
        console.error('Error iniciando cámara:', err)
        setCargando(false)
      })

      cameraRef.current = camera
    }

    const esperar = setInterval(() => {
      if (window.Hands && window.Camera && window.drawConnectors) {
        clearInterval(esperar)
        iniciar()
      }
    }, 100)

    return () => {
      clearInterval(esperar)
      clearTimeout(timerRef.current)
      if (cameraRef.current) cameraRef.current.stop()
      if (handsRef.current) handsRef.current.close()
    }
  }, [])

  const hablar = (texto) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(texto)
      utterance.lang = 'es-MX'
      utterance.rate = 0.9
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const siguienteLetra = () => {
    setResultado(null)
    setLetraDetectada(null)
    if (letraActual + 1 < LETRAS_PRACTICA.length) {
      setLetraActual(letraActual + 1)
    } else {
        completarPractica()
  setFase('completado')
    }
  }

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo)
    setLetraDetectada(null)
    setResultado(null)
    if (nuevoModo === 'traductor') {
      setTextoTraducido('')
      ultimaLetraRef.current = null
    }
  }
  const completarPractica = async () => {
  try {

    const LECCION_CAMARA_ID = '5a6040f0-d1a5-43a0-8e24-b8f2a92fccc1'

    const res = await progresoService.completar(LECCION_CAMARA_ID)

    setPuntosGanados(res.data.puntos ?? 0)
    setMensajeFinal(res.data.mensaje)

  } catch (error) {
    console.error('Error completando práctica:', error)
  }
}

  if (fase === 'completado') return (
    <div className="min-h-screen pb-24" style={{ background: '#f0faf0' }}>
      <div className="w-full px-6 pt-8 pb-14 mb-[-30px]"
        style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }} />
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-100">
          <p className="text-6xl mb-4">🎉</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Práctica completada!</h1>
          <p className="text-gray-400 mb-4">{correctas} de {LETRAS_PRACTICA.length} correctas</p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => { setLetraActual(0); setCorrectas(0); setResultado(null); setFase('practica') }}
              className="flex-1 text-white font-bold py-3 rounded-xl transition"
              style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}
            >
              Repetir
            </button>
            <button
              onClick={() => navigate('/inicio')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition"
            >
              Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pb-24" style={{ background: '#f0faf0' }}>

      <div className="w-full px-6 pt-8 pb-14 mb-[-30px]"
        style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📷</span>
            <div>
              <h1 className="text-2xl font-bold text-white">Cámara LSM</h1>
              <p className="text-green-100 text-sm">Detecta y traduce tus señas</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => cambiarModo('practica')}
              className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all ${modo === 'practica' ? 'bg-white text-green-700' : 'bg-white/20 text-white'}`}
            >
              🎯 Práctica
            </button>
            <button
              onClick={() => cambiarModo('traductor')}
              className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all ${modo === 'traductor' ? 'bg-white text-green-700' : 'bg-white/20 text-white'}`}
            >
              🔤 Traductor
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-md p-4 mb-4 border border-gray-100">

          {modo === 'practica' && (
            <>
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-400">{letraActual + 1} / {LETRAS_PRACTICA.length}</p>
                <p className="text-sm text-green-600 font-semibold">✅ {correctas} correctas</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
                <div className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${(letraActual / LETRAS_PRACTICA.length) * 100}%` }} />
              </div>
              <div className="text-center mb-5">
                <p className="text-gray-500 text-sm mb-1">Haz la seña de:</p>
                <p className="text-7xl font-bold text-green-600">{LETRAS_PRACTICA[letraActual]}</p>
              </div>
            </>
          )}

          {modo === 'traductor' && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-600">Traducción en tiempo real</p>
                <button
                  onClick={() => { setTextoTraducido(''); ultimaLetraRef.current = null }}
                  className="text-xs text-red-400 hover:text-red-600 font-medium"
                >
                  Limpiar
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 min-h-16 border border-gray-100">
                {textoTraducido ? (
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-800 tracking-widest">{textoTraducido}</p>
                    <button
                      onClick={() => hablar(textoTraducido)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 ml-3"
                      style={{ background: 'linear-gradient(135deg, #4FC3F7, #0288D1)' }}
                    >
                      🔊
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm">Las letras que hagas aparecerán aquí...</p>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Mantén la seña 1 segundo para registrarla
              </p>
            </div>
          )}

          <div className="relative rounded-2xl overflow-hidden bg-black mb-4 shadow-inner" style={{ aspectRatio: '4/3' }}>
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
            {cargando && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <p className="text-white font-medium animate-pulse">Iniciando cámara...</p>
              </div>
            )}
            {modo === 'traductor' && letraDetectada && (
              <div className="absolute top-3 right-3 bg-black/60 rounded-xl px-3 py-2">
                <p className="text-white font-bold text-2xl">{letraDetectada}</p>
              </div>
            )}
          </div>

          <div className={`rounded-xl p-3 text-center mb-4 transition-all
            ${resultado === 'correcto' ? 'bg-green-100' : letraDetectada ? 'bg-yellow-50' : 'bg-gray-50'}`}>
            {resultado === 'correcto' ? (
              <p className="font-bold text-green-700 text-lg">¡Correcto! 🎉 Detecté {letraDetectada}</p>
            ) : letraDetectada ? (
              <p className="text-yellow-700">Detectando: <span className="font-bold text-xl">{letraDetectada}</span></p>
            ) : (
              <p className="text-gray-400">Muestra tu mano frente a la cámara ✋</p>
            )}
          </div>

          {modo === 'practica' && resultado === 'correcto' && (
            <button
              onClick={siguienteLetra}
              className="w-full text-white font-bold py-3 rounded-xl transition"
              style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}
            >
              Siguiente letra →
            </button>
          )}

        </div>
      </div>
    </div>
  )
}

function detectarLetra(landmarks, mano = 'Right') {
  const dedos = obtenerDedosExtendidos(landmarks, mano)

  const [pulgar, indice, medio, anular, menique] = dedos

  // A → puño cerrado con pulgar al lado
  if (
    pulgar &&
    !indice &&
    !medio &&
    !anular &&
    !menique
  ) return 'A'

  // B → dedos arriba y pulgar doblado
  if (
    !pulgar &&
    indice &&
    medio &&
    anular &&
    menique
  ) return 'B'

  // C / O
  if (
    !indice &&
    !medio &&
    !anular &&
    !menique
  ) {
    const distPulgarIndice = Math.hypot(
      landmarks[4].x - landmarks[8].x,
      landmarks[4].y - landmarks[8].y
    )

    if (distPulgarIndice < 0.10) return 'O'
    return 'C'
  }

  // D
  if (
    !pulgar &&
    indice &&
    !medio &&
    !anular &&
    !menique
  ) return 'D'

  // L
  if (
    pulgar &&
    indice &&
    !medio &&
    !anular &&
    !menique
  ) return 'L'

  // V
  if (
    !pulgar &&
    indice &&
    medio &&
    !anular &&
    !menique
  ) return 'V'

  // W
  if (
    !pulgar &&
    indice &&
    medio &&
    anular &&
    !menique
  ) return 'W'

  return null
}

function obtenerDedosExtendidos(landmarks, mano = 'Right') {

 
  const esDerecha = mano === 'Left'

  const pulgarExtendido = esDerecha
    ? landmarks[4].x < landmarks[3].x
    : landmarks[4].x > landmarks[3].x

  const dedosExtendidos = [8, 12, 16, 20].map((punta, i) => {
    const nudillo = [6, 10, 14, 18][i]

    return landmarks[punta].y < landmarks[nudillo].y
  })

  return [pulgarExtendido, ...dedosExtendidos]
}