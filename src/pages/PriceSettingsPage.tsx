import { useState } from 'react'
import Header from '../components/layout/Header'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal, { ModalActions } from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { formatCurrency } from '../utils/format'
import { usePriceSettings } from '../hooks/useDatabase'
import db from '../db'
import type { PriceSetting } from '../types'

interface BindingFormData {
  label: string
  value: number
  unit: string
}

const emptyBindingForm: BindingFormData = {
  label: '',
  value: 5000,
  unit: 'eksemplar',
}

export default function PriceSettingsPage() {
  const { settings, loading, refresh } = usePriceSettings()
  const [editingPrint, setEditingPrint] = useState<PriceSetting | null>(null)
  const [printValue, setPrintValue] = useState<number>(0)

  const [bindingModalOpen, setBindingModalOpen] = useState(false)
  const [editingBinding, setEditingBinding] = useState<PriceSetting | null>(null)
  const [bindingForm, setBindingForm] = useState<BindingFormData>(emptyBindingForm)

  // Separate print rates vs binding options
  const printSettings = settings.filter((s) => s.key.startsWith('print_'))
  const bindingSettings = settings.filter((s) => s.key.startsWith('binding_') || s.category === 'binding')

  // Print Rate Editing
  const openEditPrint = (item: PriceSetting) => {
    setEditingPrint(item)
    setPrintValue(item.value)
  }

  const handleSavePrintRate = async () => {
    if (!editingPrint?.id) return
    await db.priceSettings.update(editingPrint.id, { value: printValue })
    setEditingPrint(null)
    refresh()
  }

  // Binding Editing & Addition
  const openAddBinding = () => {
    setEditingBinding(null)
    setBindingForm(emptyBindingForm)
    setBindingModalOpen(true)
  }

  const openEditBinding = (item: PriceSetting) => {
    setEditingBinding(item)
    setBindingForm({
      label: item.label,
      value: item.value,
      unit: item.unit,
    })
    setBindingModalOpen(true)
  }

  const handleSaveBinding = async () => {
    if (!bindingForm.label) return

    if (editingBinding?.id) {
      await db.priceSettings.update(editingBinding.id, {
        label: bindingForm.label,
        value: bindingForm.value,
        unit: bindingForm.unit,
      })
    } else {
      const uniqueKey = `binding_${Date.now()}`
      await db.priceSettings.add({
        key: uniqueKey,
        label: bindingForm.label,
        value: bindingForm.value,
        unit: bindingForm.unit,
        category: 'binding',
      })
    }
    setBindingModalOpen(false)
    refresh()
  }

  const handleDeleteBinding = async (id: number) => {
    if (confirm('Hapus pilihan jilid ini?')) {
      await db.priceSettings.delete(id)
      refresh()
    }
  }

  return (
    <>
      <Header title="Atur Harga & Jilid" subtitle="BieM363 · Kelola tarif & pilihan jilid" />

      <main className="max-w-lg mx-auto p-4 space-y-6">
        {/* Section 1: Dynamic Binding Management */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-800">Pilihan Jilid & Finishing</h2>
              <p className="text-xs text-slate-500">Bisa dikustomisasi (tambah / edit / hapus)</p>
            </div>
            <Button size="sm" onClick={openAddBinding}>
              + Tambah Jilid
            </Button>
          </div>

          <div className="space-y-2">
            {bindingSettings.map((item) => (
              <Card key={item.id ?? item.key} padding="sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500">
                      Per {item.unit}: <span className="font-semibold text-primary-700">{formatCurrency(item.value)}</span>
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEditBinding(item)}>
                      ✏️
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteBinding(item.id!)}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {bindingSettings.length === 0 && !loading && (
              <Card className="text-center text-slate-500 py-6">
                <p>Belum ada opsi jilid. Tambahkan jilid baru!</p>
              </Card>
            )}
          </div>
        </section>

        {/* Section 2: Print Per-Sheet Rates */}
        <section className="space-y-3">
          <div>
            <h2 className="text-base font-bold text-slate-800">Tarif Cetak & Fotokopi (Per Lembar)</h2>
            <p className="text-xs text-slate-500">Atur harga satuan cetak per ukuran & warna</p>
          </div>

          <div className="space-y-2">
            {printSettings.map((item) => (
              <Card key={item.id ?? item.key} padding="sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-slate-800">{item.label}</p>
                    <Badge variant="info" className="mt-0.5">
                      {formatCurrency(item.value)} / {item.unit}
                    </Badge>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => openEditPrint(item)}>
                    ✏️ Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Modal Edit Tarif Cetak */}
      <Modal
        open={!!editingPrint}
        onClose={() => setEditingPrint(null)}
        title={`Edit Tarif: ${editingPrint?.label}`}
        footer={
          <ModalActions>
            <Button variant="secondary" onClick={() => setEditingPrint(null)}>
              Batal
            </Button>
            <Button onClick={handleSavePrintRate}>Simpan</Button>
          </ModalActions>
        }
      >
        <div className="space-y-3">
          <Input
            label={`Harga per ${editingPrint?.unit || 'lembar'} (Rp)`}
            type="number"
            min={0}
            value={printValue}
            onChange={(e) => setPrintValue(Number(e.target.value))}
          />
        </div>
      </Modal>

      {/* Modal Tambah/Edit Jilid */}
      <Modal
        open={bindingModalOpen}
        onClose={() => setBindingModalOpen(false)}
        title={editingBinding ? 'Edit Jilid' : 'Tambah Jilid Baru'}
        footer={
          <ModalActions>
            <Button variant="secondary" onClick={() => setBindingModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveBinding} disabled={!bindingForm.label}>
              Simpan
            </Button>
          </ModalActions>
        }
      >
        <div className="space-y-3">
          <Input
            label="Nama Jilid / Finishing"
            placeholder="Contoh: Jilid Hard Cover, Jilid Mika"
            value={bindingForm.label}
            onChange={(e) => setBindingForm({ ...bindingForm, label: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Harga (Rp)"
              type="number"
              min={0}
              value={bindingForm.value}
              onChange={(e) => setBindingForm({ ...bindingForm, value: Number(e.target.value) })}
            />
            <Select
              label="Hitungan Per"
              options={[
                { value: 'eksemplar', label: 'Eksemplar / Buku' },
                { value: 'lembar', label: 'Lembar' },
                { value: 'pcs', label: 'Pcs' },
              ]}
              value={bindingForm.unit}
              onChange={(e) => setBindingForm({ ...bindingForm, unit: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
