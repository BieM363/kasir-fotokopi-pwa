import type { PrintJobInput, PrintJobResult, PriceSetting, BindingType } from '../types'

function getPrintPriceKey(input: PrintJobInput): string {
  const size = input.paperSize.toLowerCase()
  const color = input.color
  const side = input.sides === 'satu' ? 'satu' : 'dua'
  return `print_${size}_${color}_${side}`
}

function getBindingKey(binding: BindingType): string | null {
  const map: Record<BindingType, string | null> = {
    none: null,
    jilid_spiral: 'binding_spiral',
    jilid_lem: 'binding_lem',
    jilid_hard: 'binding_hard',
    staples: 'binding_staples',
    laminating: 'binding_laminating',
  }
  return map[binding]
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
  const bindingKey = getBindingKey(input.binding)

  if (bindingKey && priceMap[bindingKey]) {
    if (input.binding === 'laminating') {
      bindingCost = input.pages * input.copies * priceMap[bindingKey]
      breakdown.push({
        label: `Laminating × ${input.pages * input.copies} lbr`,
        amount: bindingCost,
      })
    } else {
      bindingCost = input.copies * priceMap[bindingKey]
      const bindingLabel =
        priceSettings.find((p) => p.key === bindingKey)?.label ?? 'Jilid'
      breakdown.push({
        label: `${bindingLabel} × ${input.copies} eks`,
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

export function buildPrintDescription(input: PrintJobInput): string {
  const colorLabel = input.color === 'hitam' ? 'Hitam Putih' : 'Warna'
  const sideLabel = input.sides === 'satu' ? '1 sisi' : '2 sisi'
  const bindingLabels: Record<BindingType, string> = {
    none: '',
    jilid_spiral: ' + Spiral',
    jilid_lem: ' + Soft Cover',
    jilid_hard: ' + Hard Cover',
    staples: ' + Staples',
    laminating: ' + Laminating',
  }
  return `Cetak ${input.paperSize} ${colorLabel} (${sideLabel}) ${input.pages}hlm × ${input.copies}eks${bindingLabels[input.binding]}`
}
