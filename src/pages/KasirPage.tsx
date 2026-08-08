import { useState } from 'react'
import Header from '../components/layout/Header'
import PrintCalculator from '../components/calculator/PrintCalculator'
import CartPanel, { CheckoutButton } from '../components/calculator/CartPanel'
import CheckoutModal from '../components/calculator/CheckoutModal'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { formatCurrency } from '../utils/format'
import { useProducts } from '../hooks/useDatabase'
import { useCart } from '../context/CartContext'
import type { Transaction } from '../types'

export default function KasirPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [successTx, setSuccessTx] = useState<Transaction | null>(null)
  const { products } = useProducts()
  const { addItem, itemCount } = useCart()

  const handleAddProduct = (product: typeof products[0]) => {
    addItem({
      description: product.name,
      quantity: 1,
      unitPrice: product.price,
      total: product.price,
      type: 'produk',
    })
    setProductModalOpen(false)
  }

  return (
    <>
      <Header title="Kasir" subtitle="Hitung biaya & checkout" />

      <main className={`max-w-lg mx-auto p-4 space-y-4 ${itemCount > 0 ? 'pb-32' : 'pb-4'}`}>
        <PrintCalculator />
        <CartPanel />

        <Button variant="secondary" className="w-full" onClick={() => setProductModalOpen(true)}>
          + Tambah Produk ATK
        </Button>
      </main>

      <CheckoutButton onCheckout={() => setCheckoutOpen(true)} />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={setSuccessTx}
      />

      <Modal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title="Pilih Produk ATK"
      >
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => handleAddProduct(product)}
              className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 border border-slate-200 text-left"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-slate-500">Stok: {product.stock} {product.unit}</p>
              </div>
              <span className="font-semibold text-primary-700">{formatCurrency(product.price)}</span>
            </button>
          ))}
          {products.length === 0 && (
            <p className="text-center text-slate-500 py-4">Belum ada produk. Tambahkan di menu Stok.</p>
          )}
        </div>
      </Modal>

      <Modal
        open={!!successTx}
        onClose={() => setSuccessTx(null)}
        title="Transaksi Berhasil!"
      >
        <div className="text-center py-4 space-y-3">
          <p className="text-4xl">✅</p>
          <div>
            <p className="text-sm text-slate-500">Total Tagihan</p>
            <p className="text-2xl font-bold text-primary-800">
              {formatCurrency(successTx?.total ?? 0)}
            </p>
          </div>

          {successTx?.paymentMethod === 'cash' && typeof successTx.change === 'number' && (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-800">
              <p className="text-xs uppercase font-medium">Kembalian</p>
              <p className="text-xl font-bold">{formatCurrency(successTx.change)}</p>
              <p className="text-xs text-emerald-600 mt-0.5">
                (Diterima: {formatCurrency(successTx.cashPaid ?? successTx.total)})
              </p>
            </div>
          )}

          <p className="text-sm text-slate-500">
            Transaksi #{String(successTx?.id).padStart(5, '0')} tersimpan
          </p>
          <p className="text-xs text-slate-400">Struk sedang dicetak...</p>
        </div>
      </Modal>
    </>
  )
}
