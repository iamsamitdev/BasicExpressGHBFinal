const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const db = require('./utils/db')
const productRoutes = require('./routes/productRoutes')
const setupSwagger = require('./utils/swagger')
const authRoutes = require('./routes/authRoutes')

dotenv.config()

const app = express()
app.use(express.json())

// ใช้ CORS Middleware
app.use(cors({
  // origin: '*',  // อนุญาตทุกโดเมน
  origin: ['http://localhost:3000', 'http://localhost:8080'],  // ระบุโดเมนที่อนุญาตให้เข้าถึง (เช่น frontend ของคุณ)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // กำหนด HTTP methods ที่อนุญาต
  credentials: true,  // อนุญาตให้ส่ง cookie และ header ข้อมูล
}))

app.use('/auth', authRoutes)
app.use('/products', productRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// ทดสอบการเชื่อมต่อฐานข้อมูล
app.get('/testdb', async(req, res) => {
  try {
    const client = await db.connect() // เชื่อมต่อฐานข้อมูล
    const result = await client.query('SELECT NOW()')
    client.release()

    // แปลงเวลา UTC เป็นเวลาท้องถิ่น
    const utcTime = result.rows[0].now
    const localTime = new Date(utcTime).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })

    res.status(200).json({
      message: 'Database connection successful',
      time: localTime
    })

  } catch (error){
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message
    })
  }
})

// Setup Swagger
setupSwagger(app)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`)
})