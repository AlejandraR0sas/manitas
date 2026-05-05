import { useState, useEffect } from 'react'
import { adminService } from '../../services/api'
import { Link, useNavigate } from 'react-router-dom'

export default function GestionLecciones() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState('modulos')
  const [modulos, setModulos] = useState([])
  const [moduloSeleccionado, setModuloSeleccionado] = useState(null)
  const [leccionSeleccionada, setLeccionSeleccionada] = useState(null)
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })

  const [nuevoModulo, setNuevoModulo] = useState({ titulo: '', descripcion: '', nivel: 'BASICO', orden: 1 })
  const [nuevaLeccion, setNuevaLeccion] = useState({ titulo: '', tipo: 'TEORIA', orden: 1, puntosRecompensa: 10 })
  const [nuevoEjercicio, setNuevoEjercicio] = useState({ pregunta: '', respuestaCorrecta: '', imagen: '', video: '', orden: 1 })

  useEffect(() => { cargarModulos() }, [])

  const cargarModulos = async () => {
    try {
      const res = await adminService.obtenerModulos()
      setModulos(res.data)
    } catch {
      mostrarMensaje('Error al cargar módulos', 'error')
    }
  }

  const mostrarMensaje = (texto, tipo = 'exito') => {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000)
  }

  const handleCrearModulo = async (e) => {
    e.preventDefault()
    try {
      await adminService.crearModulo({ ...nuevoModulo, orden: parseInt(nuevoModulo.orden) })
      mostrarMensaje('¡Módulo creado!')
      setNuevoModulo({ titulo: '', descripcion: '', nivel: 'BASICO', orden: 1 })
      cargarModulos()
    } catch {
      mostrarMensaje('Error al crear módulo', 'error')
    }
  }

  const handleEliminarModulo = async (id) => {
    if (!confirm('¿Eliminar este módulo y todas sus lecciones?')) return
    try {
      await adminService.eliminarModulo(id)
      mostrarMensaje('Módulo eliminado')
      cargarModulos()
    } catch {
      mostrarMensaje('Error al eliminar', 'error')
    }
  }

  const handleCrearLeccion = async (e) => {
    e.preventDefault()
    try {
      await adminService.crearLeccion({
        ...nuevaLeccion,
        moduloId: moduloSeleccionado.id,
        orden: parseInt(nuevaLeccion.orden),
        puntosRecompensa: parseInt(nuevaLeccion.puntosRecompensa)
      })
      mostrarMensaje('¡Lección creada!')
      setNuevaLeccion({ titulo: '', tipo: 'TEORIA', orden: 1, puntosRecompensa: 10 })
      const res = await adminService.obtenerModulos()
      setModulos(res.data)
      const moduloActualizado = res.data.find(m => m.id === moduloSeleccionado.id)
      setModuloSeleccionado(moduloActualizado)
    } catch {
      mostrarMensaje('Error al crear lección', 'error')
    }
  }

  const handleEliminarLeccion = async (id) => {
    if (!confirm('¿Eliminar esta lección y todos sus ejercicios?')) return
    try {
      await adminService.eliminarLeccion(id)
      mostrarMensaje('Lección eliminada')
      const res = await adminService.obtenerModulos()
      setModulos(res.data)
      const moduloActualizado = res.data.find(m => m.id === moduloSeleccionado.id)
      setModuloSeleccionado(moduloActualizado)
    } catch {
      mostrarMensaje('Error al eliminar', 'error')
    }
  }

  const handleCrearEjercicio = async (e) => {
    e.preventDefault()
    try {
      await adminService.crearEjercicio({
        ...nuevoEjercicio,
        leccionId: leccionSeleccionada.id,
        orden: parseInt(nuevoEjercicio.orden)
      })
      mostrarMensaje('¡Ejercicio creado!')
      setNuevoEjercicio({ pregunta: '', respuestaCorrecta: '', imagen: '', video: '', orden: 1 })
      const res = await adminService.obtenerLeccion(leccionSeleccionada.id)
      setLeccionSeleccionada(res.data)
    } catch {
      mostrarMensaje('Error al crear ejercicio', 'error')
    }
  }

  const handleEliminarEjercicio = async (id) => {
    if (!confirm('¿Eliminar este ejercicio?')) return
    try {
      await adminService.eliminarEjercicio(id)
      mostrarMensaje('Ejercicio eliminado')
      const res = await adminService.obtenerLeccion(leccionSeleccionada.id)
      setLeccionSeleccionada(res.data)
    } catch {
      mostrarMensaje('Error al eliminar', 'error')
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition text-gray-700"

  return (
    <div className="min-h-screen pb-24" style={{ background: '#f0faf0' }}>
      <div className="w-full px-6 pt-8 pb-14 mb-[-30px]"
        style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => {
                if (paso === 'ejercicios') { setPaso('lecciones'); setLeccionSeleccionada(null) }
                else if (paso === 'lecciones') { setPaso('modulos'); setModuloSeleccionado(null) }
                else navigate('/admin')
              }}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-2"
            >
              ← Volver
            </button>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {paso === 'modulos' ? '📚 Módulos' : paso === 'lecciones' ? `📖 ${moduloSeleccionado?.titulo}` : `✏️ ${leccionSeleccionada?.titulo}`}
          </h1>
          <p className="text-green-100 text-sm">
            {paso === 'modulos' ? 'Gestiona los módulos de la app' : paso === 'lecciones' ? 'Gestiona las lecciones del módulo' : 'Gestiona los ejercicios de la lección'}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6">

        {mensaje.texto && (
          <div className={`rounded-2xl p-3 text-center text-sm font-medium mb-4 ${mensaje.tipo === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
            {mensaje.texto}
          </div>
        )}

        {/* PASO 1 — MÓDULOS */}
        {paso === 'modulos' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Nuevo módulo</p>
              <form onSubmit={handleCrearModulo} className="space-y-3">
                <input type="text" placeholder="Título del módulo" value={nuevoModulo.titulo}
                  onChange={e => setNuevoModulo({ ...nuevoModulo, titulo: e.target.value })}
                  className={inputClass} required />
                <textarea placeholder="Descripción" value={nuevoModulo.descripcion}
                  onChange={e => setNuevoModulo({ ...nuevoModulo, descripcion: e.target.value })}
                  className={inputClass} rows={2} required />
                <div className="grid grid-cols-2 gap-3">
                  <select value={nuevoModulo.nivel}
                    onChange={e => setNuevoModulo({ ...nuevoModulo, nivel: e.target.value })}
                    className={inputClass}>
                    <option value="BASICO">Básico</option>
                    <option value="INTERMEDIO">Intermedio</option>
                    <option value="AVANZADO">Avanzado</option>
                  </select>
                  <input type="number" placeholder="Orden" value={nuevoModulo.orden}
                    onChange={e => setNuevoModulo({ ...nuevoModulo, orden: e.target.value })}
                    className={inputClass} min={1} required />
                </div>
                <button type="submit" className="w-full text-white font-bold py-3 rounded-xl transition transform hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
                  + Crear módulo
                </button>
              </form>
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">Módulos existentes</p>
            {modulos.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100">
                <p className="text-gray-400">No hay módulos aún</p>
              </div>
            ) : modulos.map(modulo => (
              <div key={modulo.id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{modulo.titulo}</p>
                    <p className="text-gray-400 text-sm">{modulo.lecciones?.length || 0} lecciones · {modulo.nivel}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setModuloSeleccionado(modulo); setPaso('lecciones') }}
                      className="bg-green-100 text-green-700 font-semibold px-3 py-2 rounded-xl text-sm hover:bg-green-200 transition">
                      Ver lecciones
                    </button>
                    <button onClick={() => handleEliminarModulo(modulo.id)}
                      className="bg-red-100 text-red-600 font-semibold px-3 py-2 rounded-xl text-sm hover:bg-red-200 transition">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PASO 2 — LECCIONES */}
        {paso === 'lecciones' && moduloSeleccionado && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Nueva lección</p>
              <form onSubmit={handleCrearLeccion} className="space-y-3">
                <input type="text" placeholder="Título de la lección" value={nuevaLeccion.titulo}
                  onChange={e => setNuevaLeccion({ ...nuevaLeccion, titulo: e.target.value })}
                  className={inputClass} required />
                <div className="grid grid-cols-2 gap-3">
                  <select value={nuevaLeccion.tipo}
                    onChange={e => setNuevaLeccion({ ...nuevaLeccion, tipo: e.target.value })}
                    className={inputClass}>
                    <option value="TEORIA">Teoría</option>
                    <option value="PRACTICA">Práctica</option>
                    <option value="CAMARA">Cámara</option>
                  </select>
                  <input type="number" placeholder="Puntos" value={nuevaLeccion.puntosRecompensa}
                    onChange={e => setNuevaLeccion({ ...nuevaLeccion, puntosRecompensa: e.target.value })}
                    className={inputClass} min={1} required />
                </div>
                <input type="number" placeholder="Orden" value={nuevaLeccion.orden}
                  onChange={e => setNuevaLeccion({ ...nuevaLeccion, orden: e.target.value })}
                  className={inputClass} min={1} required />
                <button type="submit" className="w-full text-white font-bold py-3 rounded-xl transition transform hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
                  + Crear lección
                </button>
              </form>
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">Lecciones del módulo</p>
            {moduloSeleccionado.lecciones?.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100">
                <p className="text-gray-400">No hay lecciones aún</p>
              </div>
            ) : moduloSeleccionado.lecciones?.map(leccion => (
              <div key={leccion.id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{leccion.titulo}</p>
                    <p className="text-gray-400 text-sm">{leccion.tipo} · ⭐ {leccion.puntosRecompensa} pts</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={async () => {
                      const res = await adminService.obtenerLeccion(leccion.id)
                      setLeccionSeleccionada(res.data)
                      setPaso('ejercicios')
                    }}
                      className="bg-blue-100 text-blue-700 font-semibold px-3 py-2 rounded-xl text-sm hover:bg-blue-200 transition">
                      Ejercicios
                    </button>
                    <button onClick={() => handleEliminarLeccion(leccion.id)}
                      className="bg-red-100 text-red-600 font-semibold px-3 py-2 rounded-xl text-sm hover:bg-red-200 transition">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PASO 3 — EJERCICIOS */}
        {paso === 'ejercicios' && leccionSeleccionada && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Nuevo ejercicio</p>
              <form onSubmit={handleCrearEjercicio} className="space-y-3">
                <input type="text" placeholder="Pregunta (ej: A, Hola, etc.)" value={nuevoEjercicio.pregunta}
                  onChange={e => setNuevoEjercicio({ ...nuevoEjercicio, pregunta: e.target.value })}
                  className={inputClass} required />
                <input type="text" placeholder="Respuesta correcta" value={nuevoEjercicio.respuestaCorrecta}
                  onChange={e => setNuevoEjercicio({ ...nuevoEjercicio, respuestaCorrecta: e.target.value })}
                  className={inputClass} required />
                <input type="text" placeholder="Ruta imagen (ej: /senas/a.png)" value={nuevoEjercicio.imagen}
                  onChange={e => setNuevoEjercicio({ ...nuevoEjercicio, imagen: e.target.value })}
                  className={inputClass} />
                <input type="text" placeholder="URL video YouTube embed (opcional)" value={nuevoEjercicio.video}
                  onChange={e => setNuevoEjercicio({ ...nuevoEjercicio, video: e.target.value })}
                  className={inputClass} />
                <input type="number" placeholder="Orden" value={nuevoEjercicio.orden}
                  onChange={e => setNuevoEjercicio({ ...nuevoEjercicio, orden: e.target.value })}
                  className={inputClass} min={1} required />
                <button type="submit" className="w-full text-white font-bold py-3 rounded-xl transition transform hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
                  + Crear ejercicio
                </button>
              </form>
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">
              Ejercicios ({leccionSeleccionada.ejercicios?.length || 0})
            </p>
            {leccionSeleccionada.ejercicios?.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100">
                <p className="text-gray-400">No hay ejercicios aún</p>
              </div>
            ) : leccionSeleccionada.ejercicios?.map(ejercicio => (
              <div key={ejercicio.id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{ejercicio.pregunta}</p>
                    <p className="text-gray-400 text-sm">Respuesta: {ejercicio.respuestaCorrecta}</p>
                    {ejercicio.imagen && <p className="text-blue-400 text-xs">🖼️ {ejercicio.imagen}</p>}
                    {ejercicio.video && <p className="text-purple-400 text-xs">🎬 Video adjunto</p>}
                  </div>
                  <button onClick={() => handleEliminarEjercicio(ejercicio.id)}
                    className="bg-red-100 text-red-600 font-semibold px-3 py-2 rounded-xl text-sm hover:bg-red-200 transition ml-3">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}