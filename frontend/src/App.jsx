import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Login from './pages/Login'
import Registro from './pages/Registro'
import Inicio from './pages/Inicio'
import Modulos from './pages/Modulos'
import Leccion from './pages/Leccion'
import Ranking from './pages/Ranking'
import Perfil from './pages/Perfil'
import Camara from './pages/Camara'
import Dashboard from './pages/admin/Dashboard'
import GestionLecciones from './pages/admin/GestionLecciones'
import GestionUsuarios from './pages/admin/GestionUsuarios'
import Navbar from './components/Navbar'

const RutaProtegida = ({ children }) => {
  const { usuario } = useAuth()
  return usuario ? children : <Navigate to="/login" />
}

const RutaAdmin = ({ children }) => {
  const { usuario } = useAuth()
  return usuario?.rol === 'ADMIN' ? children : <Navigate to="/inicio" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio" element={<RutaProtegida><Navbar /><Inicio /></RutaProtegida>} />
        <Route path="/modulos" element={<RutaProtegida><Navbar /><Modulos /></RutaProtegida>} />
        <Route path="/leccion/:id" element={<RutaProtegida><Navbar /><Leccion /></RutaProtegida>} />
        <Route path="/ranking" element={<RutaProtegida><Navbar /><Ranking /></RutaProtegida>} />
        <Route path="/perfil" element={<RutaProtegida><Navbar /><Perfil /></RutaProtegida>} />
        <Route path="/camara" element={<RutaProtegida><Navbar /><Camara /></RutaProtegida>} />
        <Route path="/admin" element={<RutaAdmin><Dashboard /></RutaAdmin>} />
        <Route path="/admin/lecciones" element={<RutaAdmin><GestionLecciones /></RutaAdmin>} />
        <Route path="/admin/usuarios" element={<RutaAdmin><GestionUsuarios /></RutaAdmin>} />
      </Routes>
    </BrowserRouter>
  )
}