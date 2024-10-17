// controllers/productController.js
const productService = require('../services/productService')

// อ่านข้อมูลสินค้าทั้งหมด
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts()
    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
}

// ฟังก์ชันสำหรับการดึงข้อมูลแบบแบ่งหน้า
exports.getProductsByPage = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query // ค่าเริ่มต้น page = 1, limit = 10
  try {
    const products = await productService.getProductsByPage(Number(page), Number(limit))
    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
}

// อ่านข้อมูลสินค้าตามรหัสสินค้า
exports.getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id)
    if(product){
      res.status(200).json(product)
    } else {
      res.status(404).json({ message: 'Product not found' })
    }
  } catch (error) {
    next(error)
  }
}

// สร้างข้อมูลสินค้า
exports.createProduct = async (req, res, next) => {
  // รับค่าจากผู้ใช้
  const { name, price } = req.body
  try {
    const product = await productService.createProduct(name, price)
    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}

// แก้ไขข้อมูลสินค้า
exports.updateProduct = async (req, res, next) => {
  // รับค่าจากผู้ใช้
  const { id } = req.params
  const { name, price } = req.body
  try {
    const product = await productService.updateProduct(id, name, price)
    if(product){
      res.status(200).json(product)
    } else {
      res.status(404).json({ message: 'Product not found' })
    }
  } catch (error) {
    next(error)
  }
}

// ลบข้อมูลสินค้า
exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params
  try {
    const success = await productService.deleteProduct(id)
    if(success){
      res.status(200).json({ message: 'Product deleted successfully' })
    } else {
      res.status(404).json({ message: 'Product not found' })
    }
  } catch (error) {
    next(error)
  }
}

// ค้นหาสินค้าตามชื่อ
exports.searchProductByName = async (req, res, next) => {
  const { name } = req.query
  try {
    const products = await productService.searchProductByName(name)
    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
}