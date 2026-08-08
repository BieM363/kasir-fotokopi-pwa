import { useState } from 'react'
import Card, { CardTitle } from '../ui/Card'
import Select from '../ui/Select'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { formatCurrency } from '../../utils/format'
import { calculatePrintCost, buildPrintDescription } from '../../utils/calculatePrintCost'
import { usePriceSettings } from '../../hooks/useDatabase'
import { useCart } from '../../context/CartContext'
import type { PrintJobInput, PaperSize, PrintColor, PrintSide } from '../../types'

const paperOptions = [
  { value: 'A4', label: 'A4' },
  { value: 'F4', label: 'F4' },
  { value: 'A3', label: 'A3' },
]

const colorOptions = [
  { value: 'hitam', label: 'Hitam Putih' },
  { value: 'warna', label: 'Warna' },
]

const sideOptions = [
  { value: 'satu', label: '1 Sisi' },
  { value: 'dua', label: '2 Sisi' },
]

const defaultInput: PrintJobInput = {
  paperSize: 'A4',
  color: 'hitam',
  sides: 'satu',
  pages: 1,
  copies: 1,
  binding: 'none',
}

export default function PrintCalculator() {
  const [input, setInput] = useState<PrintJobInput>(defaultInput)
  const { settings } = usePriceSettings()
  const { addItem } = useCart()

  const bindingSettings = settings.filter((s) => s.key.startsWith('binding_') || s.category === 'binding')
  const bindingOptions = [
    { value: 'none', label: 'Tanpa Jilid' },
    ...bindingSettings.map((b) => ({
      value: b.key,
      label: `${b.label} (${formatCurrency(b.value)})`,
    })),
  ]

  const result =
    settings.length > 0 ? calculatePrintCost(input, settings) : null

  const update = <K extends keyof PrintJobInput>(key: K, value: PrintJobInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }))
  }

  const handleAddToCart = () => {
    if (!result) return
    addItem({
      description: buildPrintDescription(input, settings),
      quantity: 1,
      unitPrice: result.total,
      total: result.total,
      type: 'cetak',
      details: { ...input },
    })
    setInput(defaultInput)
  }

  return (
    <Card>
      <CardTitle className="mb-4">Kalkulator Cetak & Jilid</CardTitle>

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Ukuran Kertas"
          options={paperOptions}
          value={input.paperSize}
          onChange={(e) => update('paperSize', e.target.value as PaperSize)}
        />
        <Select
          label="Warna"
          options={colorOptions}
          value={input.color}
          onChange={(e) => update('color', e.target.value as PrintColor)}
        />
        <Select
          label="Sisi Cetak"
          options={sideOptions}
          value={input.sides}
          onChange={(e) => update('sides', e.target.value as PrintSide)}
        />
        <Select
          label="Jilid / Finishing"
          options={bindingOptions}
          value={input.binding}
          onChange={(e) => update('binding', e.target.value)}
        />
        <Input
          label="Jumlah Halaman"
          type="number"
          min={1}
          value={input.pages}
          onChange={(e) => update('pages', Math.max(1, Number(e.target.value)))}
        />
        <Input
          label="Jumlah Eksamplar"
          type="number"
          min={1}
          value={input.copies}
          onChange={(e) => update('copies', Math.max(1, Number(e.target.value)))}
        />
      </div>

      {result && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg space-y-1">
          {result.breakdown.map((line, i) => (
            <div key={i} className="flex justify-between text-sm text-slate-600">
              <span>{line.label}</span>
              <span>{formatCurrency(line.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg text-primary-800 pt-2 border-t border-slate-200">
            <span>Total</span>
            <span>{formatCurrency(result.total)}</span>
          </div>
        </div>
      )}

      <Button className="w-full mt-4" size="lg" onClick={handleAddToCart} disabled={!result}>
        + Tambah ke Keranjang
      </Button>
    </Card>
  )
}

