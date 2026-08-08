import { useState, useEffect } from 'react'
import Modal, { ModalActions } from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { formatCurrency } from '../../utils/format'
import { useCart } from '../../context/CartContext'
import { useShopSettings } from '../../hooks/useDatabase'
import db from '../../db'
import { printReceipt } from '../../utils/printReceipt'
import type { PaymentMethod, Transaction } from '../../types'

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (tx: Transaction) => void
}

export default function CheckoutModal({ open, onClose, onSuccess }: CheckoutModalProps) {
  const { items, subtotal, clearCart } = useCart()
  const { shop } = useShopSettings()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [cashPaid, setCashPaid] = useState<number | ''>('')
  const [processing, setProcessing] = useState(false)

  const total = subtotal

  // Reset cash input when modal opens or total changes
  useEffect(() => {
    if (open) {
      setCashPaid('')
    }
  }, [open, total])

  const numericCash = typeof cashPaid === 'number' ? cashPaid : 0
  const change = paymentMethod === 'cash' ? numericCash - total : 0
  const isCashInsufficient = paymentMethod === 'cash' && (cashPaid === '' || numericCash < total)

  const handleCheckout = async () => {
    if (isCashInsufficient) return

    setProcessing(true)
    try {
      const finalCashPaid = paymentMethod === 'cash' ? numericCash : total
      const finalChange = paymentMethod === 'cash' ? Math.max(0, change) : 0

      const tx: Transaction = {
        items: items.map(({ tempId: _, ...item }) => item),
        subtotal,
        total,
        paymentMethod,
        cashPaid: finalCashPaid,
        change: finalChange,
        createdAt: new Date(),
      }

      const id = await db.transactions.add(tx)
      const savedTx = { ...tx, id: id as number }

      clearCart()
      setCashPaid('')
      onClose()
      onSuccess(savedTx)

      printReceipt(savedTx, shop)
    } finally {
      setProcessing(false)
    }
  }

  const quickNominals = [10000, 20000, 50000, 100000].filter((n) => n >= total)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Checkout & Pembayaran"
      footer={
        <ModalActions>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={processing || items.length === 0 || isCashInsufficient}
          >
            {processing ? 'Memproses...' : `Selesai Bayar (${formatCurrency(total)})`}
          </Button>
        </ModalActions>
      }
    >
      <div className="space-y-4">
        {/* Rincian Item */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {items.map((item) => (
            <div key={item.tempId} className="flex justify-between text-sm">
              <span className="truncate mr-2 text-slate-700">{item.description}</span>
              <span className="font-semibold shrink-0 text-slate-900">{formatCurrency(item.total)}</span>
            </div>
          ))}
        </div>

        {/* Subtotal & Total */}
        <div className="border-t border-slate-200 pt-3 space-y-1">
          <div className="flex justify-between font-bold text-lg text-primary-800">
            <span>Total Tagihan</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Metode Pembayaran */}
        <Select
          label="Metode Pembayaran"
          options={[
            { value: 'cash', label: 'Tunai (Cash)' },
            { value: 'transfer', label: 'Transfer Bank' },
            { value: 'qris', label: 'QRIS' },
          ]}
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
        />

        {/* Kalkulator Tunai */}
        {paymentMethod === 'cash' && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <p className="font-semibold text-xs uppercase tracking-wide text-slate-500">
              Kalkulator Kembalian Tunai
            </p>

            <Input
              label="Uang Diterima (Rp)"
              type="number"
              min={0}
              placeholder="Contoh: 50000"
              value={cashPaid}
              onChange={(e) => {
                const val = e.target.value
                setCashPaid(val === '' ? '' : Number(val))
              }}
            />

            {/* Tombol Nominal Cepat */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCashPaid(total)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-primary-100 text-primary-800 hover:bg-primary-200"
              >
                Uang Pas ({formatCurrency(total)})
              </button>
              {quickNominals.map((nom) => (
                <button
                  key={nom}
                  type="button"
                  onClick={() => setCashPaid(nom)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300"
                >
                  {formatCurrency(nom)}
                </button>
              ))}
            </div>

            {/* Output Kembalian / Warning */}
            {cashPaid !== '' && (
              <div
                className={`p-3 rounded-lg flex items-center justify-between font-bold ${
                  change >= 0
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                <span>{change >= 0 ? 'Kembalian:' : 'Uang Kurang:'}</span>
                <span className="text-xl">
                  {change >= 0 ? formatCurrency(change) : formatCurrency(Math.abs(change))}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

