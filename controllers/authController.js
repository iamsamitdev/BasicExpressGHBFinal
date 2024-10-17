// controllers/authController.js
const bcrypt = require('bcryptjs')
const userService = require('../services/userService')
const jwtUtils = require('../utils/jwtUtils')

// ฟังก์ชันสำหรับลงทะเบียนผู้ใช้
exports.registerUser = async (req, res) => {
  // รับค่าจากผู้ใช้
  const { username, password, fullname, email, tel } = req.body

  try {
    // ตรวจสอบว่าชื่อผู้ใช้มีอยู่แล้วหรือไม่
    const existingUser = await userService.findUserByUsername(username)
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' })
    }

    // ตรวจสอบว่าอีเมลมีอยู่แล้วหรือไม่
    const existingEmail = await userService.findUserByEmail(email)
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    // เข้ารหัสรหัสผ่านและสร้างผู้ใช้ใหม่
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await createUser(username, hashedPassword, fullname, email, tel)
    res.status(201).json(newUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error registering user' })
  }

}

// ฟังก์ชันสำหรับเข้าสู่ระบบ
exports.loginUser = async (req, res) => {
  const { username, password } = req.body
  try {
    // ค้นหาผู้ใช้ตามชื่อผู้ใช้
    const user = await userService.findUserByUsername(username)
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // สร้าง JWT Token
    const accessToken = jwtUtils.generateAccessToken(user.id)
    const refreshToken = jwtUtils.generateRefreshToken(user.id)

    // ส่งกลับข้อมูลผู้ใช้พร้อม token
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        tel: user.tel,
      },
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error logging in' })
  }
}

// ฟังก์ชันสำหรับการ Refresh Token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token is required' })

  if (!isRefreshTokenValid(refreshToken)) {
    return res.status(403).json({ message: 'Invalid refresh token' })
  }

  try {
    const decoded = verifyRefreshToken(refreshToken)
    const userId = (decoded).id
    const newAccessToken = generateAccessToken(userId)
    res.status(200).json({ accessToken: newAccessToken })
  } catch (error) {
    console.error(error)
    res.status(403).json({ message: 'Invalid refresh token' })
  }
}

// ฟังก์ชันสำหรับออกจากระบบ
exports.logoutUser = async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required' })

  removeRefreshToken(refreshToken)
  res.json({ message: 'User logged out successfully' })
}