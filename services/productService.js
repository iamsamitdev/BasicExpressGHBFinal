// services/productService.js
const db = require('../utils/db')
const Product = require('../models/productModel')

// อ่านข้อมูลสินค้าทั้งหมด
exports.getAllProducts = async () => {
  const client = await db.connect()
  const result = await client.query('SELECT * FROM products')
  client.release()

  return result.rows.map(row => new Product(
    row.id, row.name, row.price
  ))
}

// อ่านข้อมูลสินค้าแบบมีการแบ่งหน้า
exports.getProductsByPage = async (page, limit) => {
  const client = await db.connect()
  const offset = (page - 1) * limit // คำนวณจุดเริ่มต้นของแต่ละหน้า
  const result = await client.query('SELECT * FROM products LIMIT $1 OFFSET $2', [limit, offset])

  client.release()

  return result.rows.map(row => new Product(row.id, row.name, row.price))
}

// อ่านข้อมูลสินค้าตามรหัสสินค้า
exports.getProductById = async (id) => {
  const client = await db.connect()
  const result = await client.query('SELECT * FROM products WHERE id = $1', [id])
  client.release()

  if(result.rows.length > 0){
    const { id, name, price } = result.rows[0]
    return new Product(id, name, price)
  }
  return null
}

// สร้างข้อมูลสินค้า 
exports.createProduct = async (name, price) => {
  const client = await db.connect()
  const result = await client.query('INSERT INTO products(name, price) VALUES($1, $2) RETURNING *', [name, price])
  client.release()

  return new Product(
    result.rows[0].id, result.rows[0].name, result.rows[0].price
  )
}

// แก้ไขข้อมูลสินค้า
exports.updateProduct = async (id, name, price) => {
  const client = await db.connect()
  const result = await client.query('UPDATE products SET name=$1, price=$2 WHERE id=$3 RETURNING *', [name, price, id])
  client.release()

  if(result.rows.length > 0){
    return new Product(
      result.rows[0].id, result.rows[0].name, result.rows[0].price
    )
  }
  return null
}

// ลบข้อมูลสินค้า
exports.deleteProduct = async (id) => {
  const client = await db.connect()
  const result = await client.query('DELETE FROM products WHERE id=$1 RETURNING *', [id])
  client.release()

  if(result.rows.length > 0){
    return new Product(
      result.rows[0].id, result.rows[0].name, result.rows[0].price
    )
  }
  return null
}

// ค้นหาสินค้าตามชื่อ
exports.searchProductByName = async (name) => {
  const client = await db.connect()
  const result = await client.query('SELECT * FROM products WHERE LOWER(name) LIKE LOWER($1)', [`%${name}%`])
  client.release()

  return result.rows.map(row => new Product(
    row.id, row.name, row.price
  ))
}