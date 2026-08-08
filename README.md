# Kasir Offline Fotokopi (PWA) - BieM363

Aplikasi kasir offline untuk toko fotokopi oleh **BieM363** — cepat, ringan, dan 100% bekerja tanpa internet.

## Tech Stack

- **React 19** + **Vite 8** + **TypeScript**
- **Tailwind CSS 4** — styling responsif mobile-first
- **Dexie.js** — penyimpanan lokal via IndexedDB
- **vite-plugin-pwa** — installable PWA dengan service worker

## Fitur Utama

- **Branding BieM363** — identitas projek kodingan BieM363 di header, nav, struk, & meta
- **Kalkulator Cetak & Jilid** — hitung biaya cetak & finishing secara presisi (A4/F4/A3, hitam/warna, 1-2 sisi)
- **Kalkulator Pembayaran & Kembalian** — input Uang Diterima, nominal cepat (uang pas, 10rb, 20rb, 50rb, 100rb), dan hitung Kembalian otomatis
- **Menu Atur Harga & Jilid Dinamis** — kelola tarif cetak & opsi jilid (tambah/edit/hapus jilid tanpa di-hardcode)
- **Hapus Log Transaksi** — tombol hapus log untuk meminimalisir kesalahan input data pembayaran
- **Manajemen Stok ATK** — kertas, tinta, bahan jilid, alert stok rendah
- **Cetak Struk Thermal** — via Web Printing API (`window.print()`), format 80mm
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

## Repository GitHub

https://github.com/BieM363/kasir-fotokopi-pwa

