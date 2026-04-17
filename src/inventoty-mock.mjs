// 假数据 模拟 按 SKU 查库存 接口
const rows = [
  {
    sku: 'SKU-001',
    name: 'iPhone 14',
    stock: 100
  },
  {
    sku: 'SKU-002',
    name: 'MacBook Pro',
    stock: 50
  },
  {
    sku: 'SKU-003',
    name: 'iPad Pro',
    stock: 30
  }
]
export function getProductBySku(sku) {
  const key = String(sku).trim().toUpperCase()
  const row = rows.find(r => r.sku.toUpperCase() === key)
  if (!row) {
    return JSON.stringify({ found: false, sku: String(sku).trim() })
  }
  return JSON.stringify({ found: true, ...row })
}