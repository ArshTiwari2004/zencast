import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

export const protect = asyncHandler(async (req, res, next) => {
  let token

  // Check cookies first
  if (req.cookies.token) {
    token = req.cookies.token
  }
  // Fallback to Authorization header
  else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.query().findById(decoded.id).select('id', 'name', 'email')
    next()
  } catch (error) {
    res.status(401)
    throw new Error('Not authorized, token failed')
  }
})