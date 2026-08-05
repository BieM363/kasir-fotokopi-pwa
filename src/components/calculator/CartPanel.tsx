import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { formatCurrency } from '../../utils/format'
import { useCart } from '../../context/CartContext'

export default function CartPanel() {
  const { items, removeItem, subtotal, itemCount } = useCart()

  if (itemCount === 0) {
    return (
      <Card className="text-center text-slate-500 py-8">
        <p className="text-3xl mb-2">🛒</p>
        <p>Keranjang kosong</p>
        <p className="text-sm mt-1">Tambahkan item cetak atau produk</p>
      </Card>
    )
  }

  return (
    <Card padding="sm">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-semibold text-slate-800">Keranjang</h3>
        <Badge variant="info">{itemCount} item</Badge>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.tempId}
            className="flex items-start justify-between p-2 bg-slate-50 rounded-lg"
          >
            <div className="flex-1 min-w-0 mr-2">
              <p className="text-sm font-medium text-slate-800 truncate">{item.description}</p>
              <p className="text-xs text-slate-500">{formatCurrency(item.unitPrice)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{formatCurrency(item.total)}</span>
              <button
                onClick={() => removeItem(item.tempId)}
                className="text-red-500 hover:text-red-700 text-sm p-1"
                aria-label="Hapus"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200 px-1">
        <span className="font-semibold">Subtotal</span>
        <span className="text-lg font-bold text-primary-800">{formatCurrency(subtotal)}</span>
      </div>
    </Card>
  )
}

export function CheckoutButton({ onCheckout }: { onCheckout: () => void }) {
  const { itemCount, subtotal } = useCart()

  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-slate-200 z-30">
      <div className="max-w-lg mx-auto">
        <Button size="lg" className="w-full" onClick={onCheckout}>
          Bayar {formatCurrency(subtotal)} ({itemCount} item)
        </Button>
      </div>
    </div>
  )
}
