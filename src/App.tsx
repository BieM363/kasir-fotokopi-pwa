import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import KasirPage from './pages/KasirPage'
import StockPage from './pages/StockPage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/kasir" element={<KasirPage />} />
            <Route path="/stok" element={<StockPage />} />
            <Route path="/riwayat" element={<HistoryPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
