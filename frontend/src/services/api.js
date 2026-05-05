import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})



export const modulosService = {
  obtenerTodos: () => api.get('/modulos'),
  obtenerUno: (id) => api.get(`/modulos/${id}`),
}

export const leccionesService = {
  obtenerTodas: () => api.get('/lecciones'),
  obtenerUna: (id) => api.get(`/lecciones/${id}`),
}

export const progresoService = {
  obtener: () => api.get('/progreso'),
  completar: (leccionId) => api.post('/progreso/completar', { leccionId }),
}

export const rankingService = {
  obtener: () => api.get('/ranking'),
}

export const adminService = {
  obtenerUsuarios: () => api.get('/admin/usuarios'),
  obtenerEstadisticas: () => api.get('/admin/estadisticas'),
  obtenerModulos: () => api.get('/admin/modulos'),
  obtenerLeccion: (id) => api.get(`/admin/lecciones/${id}`),
  crearModulo: (datos) => api.post('/admin/modulos', datos),
  crearLeccion: (datos) => api.post('/admin/lecciones', datos),
  crearEjercicio: (datos) => api.post('/admin/ejercicios', datos),
  eliminarModulo: (id) => api.delete(`/admin/modulos/${id}`),
eliminarLeccion: (id) => api.delete(`/admin/lecciones/${id}`),
eliminarEjercicio: (id) => api.delete(`/admin/ejercicios/${id}`),
}
export const authService = {
  registro: (datos) => api.post('/auth/registro', datos),
  login: (datos) => api.post('/auth/login', datos),
  perfil: () => api.get('/auth/perfil'), // 👈 NUEVO
}

export default api