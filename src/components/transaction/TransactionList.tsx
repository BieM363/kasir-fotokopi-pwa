import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { formatCurrency, formatDate } from '../../utils/format'
import { useTransactions, useShopSettings } from '../../hooks/useDatabase'
import { printReceipt } from '../../utils/printReceipt'
import type { Transaction } from '../../types'

export default function TransactionList() {
  const { transactions, loading } = useTransactions()
  const { shop } = useShopSettings()

  const handleReprint = (tx: Transaction) => {
    printReceipt(tx, shop)
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
              </div>
              <p className="text-xs text-slate-500 mt-1">{formatDate(tx.createdAt)}</p>
              {tx.customerName && (
                <p className="text-sm text-slate-600 mt-1">{tx.customerName}</p>
              )}
            </div>
            <div className="text-right">
              <p className="font-bold text-primary-800">{formatCurrency(tx.total)}</p>
              <Button size="sm" variant="ghost" className="mt-1" onClick={() => handleReprint(tx)}>
                🖨️ Cetak
              </Button>
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
