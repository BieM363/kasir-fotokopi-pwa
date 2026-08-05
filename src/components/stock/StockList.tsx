import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Modal, { ModalActions } from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { formatCurrency } from '../../utils/format'
import { useProducts } from '../../hooks/useDatabase'
import db from '../../db'
import type { Product, ProductCategory } from '../../types'

const categoryLabels: Record<ProductCategory, string> = {
  kertas: 'Kertas',
  tinta: 'Tinta',
  jilid: 'Jilid',
  lainnya: 'Lainnya',
}

const categoryOptions = Object.entries(categoryLabels).map(([value, label]) => ({ value, label }))

interface StockFormData {
  name: string
  category: ProductCategory
  unit: string
  stock: number
  minStock: number
  price: number
}

const emptyForm: StockFormData = {
  name: '',
  category: 'lainnya',
  unit: 'pcs',
  stock: 0,
  minStock: 5,
  price: 0,
}

export default function StockList() {
  const { products, lowStock, refresh } = useProducts()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<StockFormData>(emptyForm)
  const [adjustModal, setAdjustModal] = useState<Product | null>(null)
  const [adjustAmount, setAdjustAmount] = useState(0)

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditing(product)
    setForm({
      name: product.name,
      category: product.category,
      unit: product.unit,
      stock: product.stock,
      minStock: product.minStock,
      price: product.price,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    const data = { ...form, updatedAt: new Date() }
    if (editing?.id) {
      await db.products.update(editing.id, data)
    } else {
      await db.products.add(data)
    }
    setModalOpen(false)
    refresh()
  }

  const handleAdjust = async () => {
    if (!adjustModal?.id) return
    const newStock = Math.max(0, adjustModal.stock + adjustAmount)
    await db.products.update(adjustModal.id, { stock: newStock, updatedAt: new Date() })
    setAdjustModal(null)
    setAdjustAmount(0)
    refresh()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Hapus produk ini?')) {
      await db.products.delete(id)
      refresh()
    }
  }

  return (
    <>
      {lowStock.length > 0 && (
        <Card className="mb-4 border-amber-300 bg-amber-50">
          <p className="text-amber-800 font-medium text-sm">
            ⚠️ {lowStock.length} produk stok rendah
          </p>
        </Card>
      )}

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500">{products.length} produk</p>
        <Button size="sm" onClick={openAdd}>+ Tambah Produk</Button>
      </div>

      <div className="space-y-2">
        {products.map((product) => (
          <Card key={product.id} padding="sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-slate-800">{product.name}</h4>
                  <Badge variant={product.stock <= product.minStock ? 'danger' : 'default'}>
                    {categoryLabels[product.category]}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Stok: <span className={product.stock <= product.minStock ? 'text-red-600 font-semibold' : ''}>{product.stock} {product.unit}</span>
                  {' · '}{formatCurrency(product.price)}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setAdjustModal(product); setAdjustAmount(0) }}
                >
                  ±
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openEdit(product)}>
                  ✏️
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(product.id!)}>
                  🗑️
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {products.length === 0 && (
          <Card className="text-center text-slate-500 py-8">
            <p>Belum ada produk</p>
          </Card>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Produk' : 'Tambah Produk'}
        footer={
          <ModalActions>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={!form.name}>Simpan</Button>
          </ModalActions>
        }
      >
        <div className="space-y-3">
          <Input label="Nama Produk" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select label="Kategori" options={categoryOptions} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Stok" type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
            <Input label="Satuan" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Stok Minimum" type="number" min={0} value={form.minStock} onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })} />
            <Input label="Harga (Rp)" type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!adjustModal}
        onClose={() => setAdjustModal(null)}
        title={`Atur Stok: ${adjustModal?.name}`}
        footer={
          <ModalActions>
            <Button variant="secondary" onClick={() => setAdjustModal(null)}>Batal</Button>
            <Button onClick={handleAdjust}>Simpan</Button>
          </ModalActions>
        }
      >
        <p className="text-sm text-slate-500 mb-3">Stok saat ini: {adjustModal?.stock} {adjustModal?.unit}</p>
        <Input
          label="Penyesuaian (+/-)"
          type="number"
          value={adjustAmount || ''}
          onChange={(e) => setAdjustAmount(Number(e.target.value))}
          placeholder="Contoh: 10 atau -5"
        />
        <p className="text-sm mt-2">
          Stok baru: <strong>{Math.max(0, (adjustModal?.stock ?? 0) + adjustAmount)}</strong>
        </p>
      </Modal>
    </>
  )
}
