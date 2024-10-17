const db = require("../utils/db")
const User = require("../models/userModel")

// ฟังก์ชันสำหรับสร้างผู้ใช้ใหม่
exports.createUser = async (username, password, fullname, email, tel) => {
  const client = await db.connect()
  const result = await client.query(
    "INSERT INTO users(username, password, fullname, email, tel) VALUES($1, $2, $3, $4, $5) RETURNING *",
    [username, password, fullname, email, tel]
  )
  client.release()

  return new User(
    result.rows[0].id,
    result.rows[0].username,
    result.rows[0].password,
    result.rows[0].fullname,
    result.rows[0].email,
    result.rows[0].tel
  )
}

// ฟังก์ชันสำหรับค้นหาผู้ใช้ตามชื่อผู้ใช้
exports.findUserByUsername = async (username) => {
  const client = await db.connect()
  const result = await client.query("SELECT * FROM users WHERE username = $1", [username])
  client.release()

  if (result.rows.length > 0) {
    const { id, username, password, fullname, email, tel } = result.rows[0]
    return new User(id, username, password, fullname, email, tel)
  }
  return null
}

// ฟังก์ชันสำหรับค้นหาผู้ใช้ตามอีเมล
exports.findUserByEmail = async (email) => {
  const client = await db.connect()
  const result = await client.query("SELECT * FROM users WHERE email = $1", [email])
  client.release()

  if (result.rows.length > 0) {
    const { id, username, password, fullname, email, tel } = result.rows[0]
    return new User(id, username, password, fullname, email, tel)
  }
  return null
}
