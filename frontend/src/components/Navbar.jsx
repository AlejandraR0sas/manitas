import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/inicio', icon: '🏠', label: 'Inicio' },
    { to: '/modulos', icon: '📚', label: 'Lecciones' },
    { to: '/camara', icon: '📷', label: 'Cámara' },
    { to: '/ranking', icon: '🏆', label: 'Ranking' },
    { to: '/perfil', icon: '👤', label: 'Perfil' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 flex justify-around py-2 z-50 shadow-lg">
      {links.map((link) => {
        const activo = pathname === link.to
        return (
          <Link
            key={link.to}
            to={link.to}
            className="flex flex-col items-center px-3 py-1 rounded-xl transition-all"
          >
            <span className={`text-2xl mb-0.5 transition-all ${activo ? 'scale-110' : 'opacity-40'}`}>
              {link.icon}
            </span>
            <span className={`text-xs font-semibold transition-all ${activo ? 'text-green-600' : 'text-gray-400'}`}>
              {link.label}
            </span>
            {activo && <div className="w-4 h-0.5 rounded-full bg-green-500 mt-0.5" />}
          </Link>
        )
      })}
    </nav>
  )
}