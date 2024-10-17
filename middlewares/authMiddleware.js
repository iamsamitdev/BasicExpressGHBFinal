const jwtUtils = require("../utils/jwtUtils")
const User = require("../models/userModel")

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.header("Authorization")
  const token = authHeader && authHeader.split(" ")[1] // ตรวจสอบ header และแยก token ออกมา

  if (!token) {
    return res.status(401).json({ message: "No token provided" }) // กรณีไม่มี token
  }

  try {
    const user = verifyAccessToken(token) // ตรวจสอบ token และแปลงข้อมูลเป็น User type
    req.user = user // กำหนด user ลงใน req
    next() // ไปยัง middleware ถัดไป
  } catch (err) {
    console.error("Token verification failed:", err) // เพิ่มการ log ข้อผิดพลาด
    res.status(403).json({ message: "Forbidden: Invalid or expired token" }) // กรณี token ไม่ถูกต้อง
  }
}
