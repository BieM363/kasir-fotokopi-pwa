import Header from '../components/layout/Header'
import StockList from '../components/stock/StockList'

export default function StockPage() {
  return (
    <>
      <Header title="Stok ATK" subtitle="Manajemen persediaan" />
      <main className="max-w-lg mx-auto p-4">
        <StockList />
      </main>
    </>
  )
}
