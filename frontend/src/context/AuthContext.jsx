import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'
const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario')
    const token = localStorage.getItem('token')
    if (usuarioGuardado && token) {
      setUsuario(JSON.parse(usuarioGuardado))
    }
  }, [])

  const login = (token, usuario) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
    setUsuario(usuario)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }
const refrescarUsuario = async () => {
  try {
    const res = await authService.perfil()
    setUsuario(res.data)
    localStorage.setItem('usuario', JSON.stringify(res.data))
  } catch (error) {
    console.error('Error refrescando usuario')
  }
}

return (
  <AuthContext.Provider value={{ usuario, login, logout, refrescarUsuario }}>
    {children}
  </AuthContext.Provider>
)
}