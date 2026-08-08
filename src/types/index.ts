/**
 * Kasir Offline Fotokopi PWA
 * TypeScript Models & Interface Definitions
 * @author BieM363
 */
export type PaperSize = 'A4' | 'F4' | 'A3'
export type PrintColor = 'hitam' | 'warna'
export type PrintSide = 'satu' | 'dua'
export type BindingType = string
export type ProductCategory = 'kertas' | 'tinta' | 'jilid' | 'lainnya'
export type PaymentMethod = 'cash' | 'transfer' | 'qris'
export type TransactionItemType = 'cetak' | 'jilid' | 'produk'

export interface Product {
  id?: number
  name: string
  category: ProductCategory
  unit: string
  stock: number
  minStock: number
  price: number
  updatedAt: Date
}

export interface PriceSetting {
  id?: number
  key: string
  label: string
  value: number
  unit: string
  category?: 'print' | 'binding'
}

export interface TransactionItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
  type: TransactionItemType
  details?: Record<string, unknown>
}

export interface Transaction {
  id?: number
  items: TransactionItem[]
  subtotal: number
  total: number
  paymentMethod: PaymentMethod
  cashPaid?: number
  change?: number
  discount?: number
  customerName?: string
  notes?: string
  createdAt: Date
}

export interface PrintJobInput {
  paperSize: PaperSize
  color: PrintColor
  sides: PrintSide
  pages: number
  copies: number
  binding: string
}

export interface PrintJobResult {
  printCost: number
  bindingCost: number
  total: number
  breakdown: { label: string; amount: number }[]
}

export interface CartItem extends TransactionItem {
  tempId: string
}

