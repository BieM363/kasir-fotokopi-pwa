import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { formatCurrency, formatDate } from '../../utils/format'
import { useTransactions, useShopSettings } from '../../hooks/useDatabase'
import { printReceipt } from '../../utils/printReceipt'
import db from '../../db'
import type { Transaction } from '../../types'

export default function TransactionList() {
  const { transactions, loading, refresh } = useTransactions()
  const { shop } = useShopSettings()

  const handleReprint = (tx: Transaction) => {
    printReceipt(tx, shop)
  }

  const handleDelete = async (id: number) => {
    const formattedId = String(id).padStart(5, '0')
    if (confirm(`Hapus transaksi #${formattedId}? Tindakan ini tidak dapat dibatalkan.`)) {
      await db.transactions.delete(id)
      refresh()
    }
  }

  if (loading) {
    return <Card className="text-center py-8 text-slate-500">Memuat...</Card>
  }

  if (transactions.length === 0) {
    return (
      <Card className="text-center text-slate-500 py-8">
        <p className="text-3xl mb-2">📋</p>
        <p>Belum ada transaksi</p>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <Card key={tx.id} padding="sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">
                  #{String(tx.id).padStart(5, '0')}
                </span>
                <Badge variant="info">{tx.items.length} item</Badge>
                <Badge variant="default" className="capitalize">
                  {tx.paymentMethod === 'cash' ? 'Tunai' : tx.paymentMethod}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">{formatDate(tx.createdAt)}</p>
              {tx.paymentMethod === 'cash' && typeof tx.change === 'number' && (
                <p className="text-xs text-emerald-700 font-medium mt-1">
                  Bayar: {formatCurrency(tx.cashPaid ?? tx.total)} · Kembalian: {formatCurrency(tx.change)}
                </p>
              )}
            </div>

            <div className="text-right flex flex-col items-end">
              <p className="font-bold text-primary-800">{formatCurrency(tx.total)}</p>
              <div className="flex gap-1 mt-1">
                <Button size="sm" variant="ghost" onClick={() => handleReprint(tx)} title="Cetak Ulang">
                  🖨️ Struk
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  onClick={() => handleDelete(tx.id!)}
                  title="Hapus Log Transaksi"
                >
                  🗑️ Hapus
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
            {tx.items.map((item, i) => (
              <div key={i} className="flex justify-between text-xs text-slate-500">
                <span className="truncate mr-2">{item.description}</span>
                <span className="shrink-0">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

