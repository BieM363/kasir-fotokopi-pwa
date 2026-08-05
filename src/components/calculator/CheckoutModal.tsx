import { useState } from 'react'
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
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [customerName, setCustomerName] = useState('')
  const [notes, setNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  const total = Math.max(0, subtotal - discount)

  const handleCheckout = async () => {
    setProcessing(true)
    try {
      const tx: Transaction = {
        items: items.map(({ tempId: _, ...item }) => item),
        subtotal,
        discount,
        total,
        paymentMethod,
        customerName: customerName || undefined,
        notes: notes || undefined,
        createdAt: new Date(),
      }

      const id = await db.transactions.add(tx)
      const savedTx = { ...tx, id: id as number }

      clearCart()
      setDiscount(0)
      setCustomerName('')
      setNotes('')
      onClose()
      onSuccess(savedTx)

      printReceipt(savedTx, shop)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Checkout"
      footer={
        <ModalActions>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleCheckout} disabled={processing || items.length === 0}>
            {processing ? 'Memproses...' : `Bayar ${formatCurrency(total)}`}
          </Button>
        </ModalActions>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.tempId} className="flex justify-between text-sm">
              <span className="truncate mr-2">{item.description}</span>
              <span className="font-medium shrink-0">{formatCurrency(item.total)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-3 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Input
            label="Diskon (Rp)"
            type="number"
            min={0}
            max={subtotal}
            value={discount || ''}
            onChange={(e) => setDiscount(Math.min(subtotal, Number(e.target.value) || 0))}
          />
          <div className="flex justify-between font-bold text-lg text-primary-800">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <Select
          label="Metode Pembayaran"
          options={[
            { value: 'cash', label: 'Tunai' },
            { value: 'transfer', label: 'Transfer Bank' },
            { value: 'qris', label: 'QRIS' },
          ]}
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
        />

        <Input
          label="Nama Pelanggan (opsional)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Nama pelanggan"
        />

        <Input
          label="Catatan (opsional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Catatan tambahan"
        />
      </div>
    </Modal>
  )
}
