import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { formatCurrency } from '../utils/format'
import { useTodayStats, useProducts } from '../hooks/useDatabase'

export default function HomePage() {
  const stats = useTodayStats()
  const { lowStock } = useProducts()

  const quickActions = [
    { to: '/kasir', icon: '🧮', label: 'Kasir Baru', desc: 'Hitung & cetak' },
    { to: '/stok', icon: '📦', label: 'Cek Stok', desc: 'Manajemen ATK' },
    { to: '/riwayat', icon: '📋', label: 'Riwayat', desc: 'Transaksi hari ini' },
  ]

  return (
    <>
      <Header title="Kasir Fotokopi" subtitle="Offline · Siap melayani" />

      <main className="max-w-lg mx-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-primary-700 text-white border-0">
            <p className="text-primary-200 text-sm">Omzet Hari Ini</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(stats.revenue)}</p>
          </Card>
          <Card>
            <p className="text-slate-500 text-sm">Transaksi</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.count}</p>
          </Card>
        </div>

        {lowStock.length > 0 && (
          <Card className="border-amber-300 bg-amber-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-amber-800">Stok Rendah</p>
                <p className="text-sm text-amber-700">{lowStock.length} produk perlu restock</p>
              </div>
              <Link to="/stok">
                <Badge variant="warning">Lihat</Badge>
              </Link>
            </div>
          </Card>
        )}

        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Link key={action.to} to={action.to}>
                <Card className="text-center hover:shadow-md transition-shadow cursor-pointer h-full">
                  <span className="text-3xl">{action.icon}</span>
                  <p className="font-semibold text-sm mt-2 text-slate-800">{action.label}</p>
                  <p className="text-xs text-slate-500">{action.desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <Card className="bg-slate-100 border-dashed">
          <p className="text-sm text-slate-600 text-center">
            💡 Aplikasi berjalan <strong>100% offline</strong>.
            Data tersimpan di perangkat Anda.
          </p>
        </Card>
      </main>
    </>
  )
}
