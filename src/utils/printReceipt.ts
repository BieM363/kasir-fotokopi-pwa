import type { Transaction } from '../types'
import { formatCurrency, formatDate } from './format'

interface ShopInfo {
  name: string
  address: string
  phone: string
}

export function printReceipt(transaction: Transaction, shop: ShopInfo) {
  const receiptEl = document.getElementById('receipt-print')
  if (!receiptEl) return

  receiptEl.innerHTML = buildReceiptHTML(transaction, shop)

  requestAnimationFrame(() => {
    window.print()
  })
}

function buildReceiptHTML(transaction: Transaction, shop: ShopInfo): string {
  const itemsHTML = transaction.items
    .map(
      (item) => `
      <div class="receipt-item">
        <div class="receipt-item-name">${item.description}</div>
        <div class="receipt-item-detail">${item.quantity} × ${formatCurrency(item.unitPrice)}</div>
        <div class="receipt-item-total">${formatCurrency(item.total)}</div>
      </div>
    `,
    )
    .join('')

  const paymentLabels: Record<string, string> = {
    cash: 'Tunai',
    transfer: 'Transfer',
    qris: 'QRIS',
  }

  const isCash = transaction.paymentMethod === 'cash'
  const cashPaidVal = transaction.cashPaid ?? transaction.total
  const changeVal = transaction.change ?? 0

  return `
    <style>
      #receipt-print {
        font-family: 'Courier New', monospace;
        font-size: 12px;
        width: 80mm;
        padding: 8px;
        color: #000;
      }
      .receipt-header { text-align: center; margin-bottom: 8px; }
      .receipt-header h1 { font-size: 16px; margin: 0 0 4px; font-weight: bold; }
      .receipt-header p { margin: 0; font-size: 11px; }
      .receipt-divider { border-top: 1px dashed #000; margin: 8px 0; }
      .receipt-item { margin-bottom: 6px; }
      .receipt-item-name { font-weight: bold; }
      .receipt-item-detail { font-size: 11px; color: #333; }
      .receipt-item-total { text-align: right; }
      .receipt-row { display: flex; justify-content: space-between; margin-top: 2px; }
      .receipt-total { font-weight: bold; font-size: 14px; text-align: right; margin-top: 6px; }
      .receipt-footer { text-align: center; margin-top: 12px; font-size: 11px; }
    </style>
    <div class="receipt-header">
      <h1>${shop.name}</h1>
      <p>${shop.address}</p>
      <p>Telp: ${shop.phone}</p>
    </div>
    <div class="receipt-divider"></div>
    <div>
      <div>No: #${String(transaction.id).padStart(5, '0')}</div>
      <div>${formatDate(transaction.createdAt)}</div>
    </div>
    <div class="receipt-divider"></div>
    ${itemsHTML}
    <div class="receipt-divider"></div>
    <div class="receipt-total">TOTAL: ${formatCurrency(transaction.total)}</div>
    <div class="receipt-row" style="margin-top:4px">
      <span>Metode</span>
      <span>${paymentLabels[transaction.paymentMethod] ?? transaction.paymentMethod}</span>
    </div>
    ${
      isCash
        ? `
    <div class="receipt-row">
      <span>Diterima</span>
      <span>${formatCurrency(cashPaidVal)}</span>
    </div>
    <div class="receipt-row" style="font-weight:bold">
      <span>Kembalian</span>
      <span>${formatCurrency(changeVal)}</span>
    </div>
    `
        : ''
    }
    <div class="receipt-footer">
      <p>Terima kasih atas kunjungan Anda!</p>
      <p style="font-size: 10px; margin-top: 4px; color: #555;">Kasir Offline PWA · BieM363</p>
    </div>
  `
}

export function getReceiptPreviewHTML(transaction: Transaction, shop: ShopInfo): string {
  return buildReceiptHTML(transaction, shop)
}

