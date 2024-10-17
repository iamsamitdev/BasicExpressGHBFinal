const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET
const ACCESS_TOKEN_EXPIRATION = '24h' // Adjust as needed
const REFRESH_TOKEN_EXPIRATION = '7d' // Adjust as needed

// In-memory storage for refresh tokens (replace with a database in production)
let refreshTokens = []

// Generate Access Token
exports.generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION })
}

// Generate Refresh Token
exports.generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION })
  refreshTokens.push(refreshToken) // Save refresh token
  return refreshToken
}

// Verify Access Token
exports.verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET)
}

// Verify Refresh Token
exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET)
}

// Remove Refresh Token
exports.removeRefreshToken = (token) => {
  refreshTokens = refreshTokens.filter(rt => rt !== token)
}

// Check if Refresh Token is Valid
exports.isRefreshTokenValid = (token) => {
  return refreshTokens.includes(token)
}