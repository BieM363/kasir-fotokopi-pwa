import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { CartItem } from '../types'
import { generateId } from '../utils/format'

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'tempId'>) => void
  removeItem: (tempId: string) => void
  updateQuantity: (tempId: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((item: Omit<CartItem, 'tempId'>) => {
    setItems((prev) => [...prev, { ...item, tempId: generateId() }])
  }, [])

  const removeItem = useCallback((tempId: string) => {
    setItems((prev) => prev.filter((i) => i.tempId !== tempId))
  }, [])

  const updateQuantity = useCallback((tempId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.tempId !== tempId))
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.tempId === tempId
          ? { ...i, quantity, total: quantity * i.unitPrice }
          : i,
      ),
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const subtotal = items.reduce((sum, i) => sum + i.total, 0)
  const itemCount = items.length

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
