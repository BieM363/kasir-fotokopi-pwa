import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Beranda', icon: '🏠' },
  { to: '/kasir', label: 'Kasir', icon: '🧮' },
  { to: '/stok', label: 'Stok', icon: '📦' },
  { to: '/harga', label: 'Harga', icon: '⚙️' },
  { to: '/riwayat', label: 'Riwayat', icon: '📋' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg transition-colors ${
                isActive ? 'text-primary-700 font-semibold' : 'text-slate-500 hover:text-slate-700'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[11px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

