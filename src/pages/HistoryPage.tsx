import Header from '../components/layout/Header'
import TransactionList from '../components/transaction/TransactionList'

export default function HistoryPage() {
  return (
    <>
      <Header title="Riwayat Transaksi" subtitle="Semua transaksi tersimpan lokal" />
      <main className="max-w-lg mx-auto p-4">
        <TransactionList />
      </main>
    </>
  )
}
