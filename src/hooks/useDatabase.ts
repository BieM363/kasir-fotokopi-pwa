import { useState, useEffect, useCallback } from 'react'
import db from '../db'
import type { Product, PriceSetting, Transaction } from '../types'

function useLiveTable<T>(queryFn: () => Promise<T[]>, deps: unknown[] = []) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const result = await queryFn()
    setData(result)
    setLoading(false)
  }, deps)

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, refresh }
}

export function useProducts() {
  const { data: products, loading, refresh } = useLiveTable<Product>(
    () => db.products.orderBy('name').toArray(),
  )

  const lowStock = products.filter((p) => p.stock <= p.minStock)

  return { products, lowStock, loading, refresh }
}

export function usePriceSettings() {
  const { data: settings, loading, refresh } = useLiveTable<PriceSetting>(
    () => db.priceSettings.toArray(),
  )
  return { settings, loading, refresh }
}

export function useTransactions() {
  const { data: transactions, loading, refresh } = useLiveTable<Transaction>(
    () => db.transactions.orderBy('createdAt').reverse().toArray(),
  )
  return { transactions, loading, refresh }
}

export function useShopSettings() {
  const { data: settings } = useLiveTable<{ key: string; value: string }>(
    () => db.settings.toArray(),
  )

  const shop = {
    name: settings.find((s) => s.key === 'shop_name')?.value ?? 'Fotokopi',
    address: settings.find((s) => s.key === 'shop_address')?.value ?? '',
    phone: settings.find((s) => s.key === 'shop_phone')?.value ?? '',
  }

  return { shop, settings }
}

export function useTodayStats() {
  const [stats, setStats] = useState({ count: 0, revenue: 0 })

  useEffect(() => {
    const load = async () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const txs = await db.transactions.where('createdAt').aboveOrEqual(today).toArray()
      setStats({
        count: txs.length,
        revenue: txs.reduce((sum, t) => sum + t.total, 0),
      })
    }
    load()
  }, [])

  return stats
}
