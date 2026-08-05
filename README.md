# Kasir Offline Fotokopi (PWA)

Aplikasi kasir offline untuk toko fotokopi — cepat, ringan, dan bisa dipakai tanpa internet.

## Tech Stack

- **React 19** + **Vite 8** + **TypeScript**
- **Tailwind CSS 4** — styling responsif mobile-first
- **Dexie.js** — penyimpanan lokal via IndexedDB
- **vite-plugin-pwa** — installable PWA dengan service worker

## Fitur

- **Kalkulator Cetak & Jilid** — hitung biaya otomatis (A4/F4/A3, hitam/warna, 1-2 sisi, spiral, soft/hard cover, laminating)
- **Manajemen Stok ATK** — kertas, tinta, bahan jilid, alert stok rendah
- **Riwayat Transaksi** — semua transaksi tersimpan lokal di perangkat
- **Cetak Struk** — via Web Printing API (`window.print()`), format thermal 80mm
- **100% Offline** — tidak perlu koneksi internet setelah pertama kali di-load

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:5173

## Build Production

```bash
npm run build
npm run preview
```

## Struktur Komponen

```
src/
├── components/
│   ├── ui/           # Button, Card, Input, Modal, Badge, Select
│   ├── layout/       # Header, BottomNav, AppLayout
│   ├── calculator/   # PrintCalculator, CartPanel, CheckoutModal
│   ├── stock/        # StockList
│   └── transaction/  # TransactionList
├── context/          # CartContext (state keranjang)
├── db/               # Dexie schema + seed data
├── hooks/            # useProducts, useTransactions, dll
├── pages/            # Home, Kasir, Stok, Riwayat
├── types/            # TypeScript interfaces
└── utils/            # formatCurrency, calculatePrintCost, printReceipt
```

## Metode Kerja

Proyek ini dirancang dengan **Component-Driven Development** — setiap bagian UI adalah komponen kecil yang independen, sehingga mudah ditinggal saat melayani pelanggan dan dilanjutkan nanti.

## Install sebagai PWA

1. Buka aplikasi di browser (Chrome/Edge)
2. Klik ikon "Install" di address bar
3. Aplikasi akan muncul seperti app native di desktop/HP
