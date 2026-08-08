/**
 * Kasir Offline Fotokopi PWA
 * Calculation Utility Engine
 * @author BieM363
 */
import type { PrintJobInput, PrintJobResult, PriceSetting } from '../types'

function getPrintPriceKey(input: PrintJobInput): string {
  const size = input.paperSize.toLowerCase()
  const color = input.color
  const side = input.sides === 'satu' ? 'satu' : 'dua'
  return `print_${size}_${color}_${side}`
}

export function calculatePrintCost(
  input: PrintJobInput,
  priceSettings: PriceSetting[],
): PrintJobResult {
  const priceMap = Object.fromEntries(priceSettings.map((p) => [p.key, p.value]))
  const breakdown: { label: string; amount: number }[] = []

  const printKey = getPrintPriceKey(input)
  const pricePerSheet = priceMap[printKey] ?? 300

  const effectiveSheets =
    input.sides === 'dua' ? Math.ceil(input.pages / 2) : input.pages
  const totalSheets = effectiveSheets * input.copies
  const printCost = totalSheets * pricePerSheet

  breakdown.push({
    label: `Cetak ${input.paperSize} ${input.color === 'hitam' ? 'Hitam Putih' : 'Warna'} (${input.sides === 'satu' ? '1 sisi' : '2 sisi'}) × ${totalSheets} lbr`,
    amount: printCost,
  })

  let bindingCost = 0
  const selectedBinding = priceSettings.find((p) => p.key === input.binding)

  if (input.binding && input.binding !== 'none' && selectedBinding) {
    if (selectedBinding.unit === 'lembar') {
      const sheetsCount = input.pages * input.copies
      bindingCost = sheetsCount * selectedBinding.value
      breakdown.push({
        label: `${selectedBinding.label} × ${sheetsCount} lbr`,
        amount: bindingCost,
      })
    } else {
      bindingCost = input.copies * selectedBinding.value
      breakdown.push({
        label: `${selectedBinding.label} × ${input.copies} eks`,
        amount: bindingCost,
      })
    }
  }

  return {
    printCost,
    bindingCost,
    total: printCost + bindingCost,
    breakdown,
  }
}

export function buildPrintDescription(input: PrintJobInput, priceSettings: PriceSetting[] = []): string {
  const colorLabel = input.color === 'hitam' ? 'Hitam Putih' : 'Warna'
  const sideLabel = input.sides === 'satu' ? '1 sisi' : '2 sisi'
  
  let bindingText = ''
  if (input.binding && input.binding !== 'none') {
    const bindingSetting = priceSettings.find((p) => p.key === input.binding)
    if (bindingSetting) {
      bindingText = ` + ${bindingSetting.label}`
    }
  }

  return `Cetak ${input.paperSize} ${colorLabel} (${sideLabel}) ${input.pages}hlm × ${input.copies}eks${bindingText}`
}

