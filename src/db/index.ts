import Dexie, { type EntityTable } from 'dexie'
import type { Product, PriceSetting, Transaction } from '../types'

const db = new Dexie('KasirFotokopiDB') as Dexie & {
  products: EntityTable<Product, 'id'>
  priceSettings: EntityTable<PriceSetting, 'id'>
  transactions: EntityTable<Transaction, 'id'>
  settings: EntityTable<{ key: string; value: string }, 'key'>
}

db.version(1).stores({
  products: '++id, name, category, stock',
  priceSettings: '++id, key',
  transactions: '++id, createdAt, total',
  settings: 'key',
})

export default db

export async function seedDatabase() {
  const count = await db.priceSettings.count()
  if (count > 0) return

  await db.priceSettings.bulkAdd([
    { key: 'print_a4_hitam_satu', label: 'Cetak A4 Hitam Putih (1 sisi)', value: 300, unit: 'lembar', category: 'print' },
    { key: 'print_a4_hitam_dua', label: 'Cetak A4 Hitam Putih (2 sisi)', value: 400, unit: 'lembar', category: 'print' },
    { key: 'print_a4_warna_satu', label: 'Cetak A4 Warna (1 sisi)', value: 1000, unit: 'lembar', category: 'print' },
    { key: 'print_a4_warna_dua', label: 'Cetak A4 Warna (2 sisi)', value: 1500, unit: 'lembar', category: 'print' },
    { key: 'print_f4_hitam_satu', label: 'Cetak F4 Hitam Putih (1 sisi)', value: 350, unit: 'lembar', category: 'print' },
    { key: 'print_f4_hitam_dua', label: 'Cetak F4 Hitam Putih (2 sisi)', value: 450, unit: 'lembar', category: 'print' },
    { key: 'print_f4_warna_satu', label: 'Cetak F4 Warna (1 sisi)', value: 1200, unit: 'lembar', category: 'print' },
    { key: 'print_f4_warna_dua', label: 'Cetak F4 Warna (2 sisi)', value: 1800, unit: 'lembar', category: 'print' },
    { key: 'print_a3_hitam_satu', label: 'Cetak A3 Hitam Putih (1 sisi)', value: 1000, unit: 'lembar', category: 'print' },
    { key: 'print_a3_hitam_dua', label: 'Cetak A3 Hitam Putih (2 sisi)', value: 1500, unit: 'lembar', category: 'print' },
    { key: 'print_a3_warna_satu', label: 'Cetak A3 Warna (1 sisi)', value: 3000, unit: 'lembar', category: 'print' },
    { key: 'print_a3_warna_dua', label: 'Cetak A3 Warna (2 sisi)', value: 4500, unit: 'lembar', category: 'print' },
    { key: 'binding_spiral', label: 'Jilid Spiral', value: 8000, unit: 'eksemplar', category: 'binding' },
    { key: 'binding_lem', label: 'Jilid Lem Panas (Soft Cover)', value: 12000, unit: 'eksemplar', category: 'binding' },
    { key: 'binding_hard', label: 'Jilid Hard Cover', value: 35000, unit: 'eksemplar', category: 'binding' },
    { key: 'binding_staples', label: 'Staples/Jilid Kawat', value: 2000, unit: 'eksemplar', category: 'binding' },
    { key: 'binding_laminating', label: 'Laminating', value: 3000, unit: 'lembar', category: 'binding' },
  ])

  await db.products.bulkAdd([
    { name: 'Kertas A4 80gr', category: 'kertas', unit: 'rim', stock: 50, minStock: 10, price: 45000, updatedAt: new Date() },
    { name: 'Kertas F4 80gr', category: 'kertas', unit: 'rim', stock: 30, minStock: 5, price: 50000, updatedAt: new Date() },
    { name: 'Kertas A3 80gr', category: 'kertas', unit: 'rim', stock: 15, minStock: 3, price: 85000, updatedAt: new Date() },
    { name: 'Toner Hitam', category: 'tinta', unit: 'pcs', stock: 5, minStock: 2, price: 350000, updatedAt: new Date() },
    { name: 'Toner Warna (Set)', category: 'tinta', unit: 'set', stock: 3, minStock: 1, price: 1200000, updatedAt: new Date() },
    { name: 'Spiral Binding 14mm', category: 'jilid', unit: 'pcs', stock: 100, minStock: 20, price: 1500, updatedAt: new Date() },
    { name: 'Cover Soft (Transparan)', category: 'jilid', unit: 'pcs', stock: 200, minStock: 50, price: 500, updatedAt: new Date() },
    { name: 'Plastik Laminating A4', category: 'jilid', unit: 'pack', stock: 10, minStock: 3, price: 25000, updatedAt: new Date() },
  ])

  await db.settings.bulkPut([
    { key: 'shop_name', value: 'Fotocopy Bintang Perdana' },
    { key: 'shop_address', value: 'Pertokoan Murni No 108' },
    { key: 'shop_phone', value: '' },
  ])
}

