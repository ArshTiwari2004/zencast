import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/User'

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Check if user exists
  const userExists = await User.query().findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Create user
  const user = await User.query().insert({
    name,
    email,
    password
  })

  if (user) {
    const token = user.generateAuthToken()
    const refreshToken = user.generateRefreshToken()

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token,
      refreshToken
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findByCredentials(email, password)
  const token = user.generateAuthToken()
  const refreshToken = user.generateRefreshToken()

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token,
    refreshToken
  })
})

// @desc    Store tokens in HTTP-only cookies
// @route   POST /api/auth/store-tokens
// @access  Private
export const storeTokens = asyncHandler(async (req, res) => {
  const { token, refreshToken } = req.body

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000 // 1 hour
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })

  res.status(200).json({ message: 'Tokens stored successfully' })
})

// @desc    Logout user / clear cookies
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('token')
  res.clearCookie('refreshToken')
  res.status(200).json({ message: 'Logged out successfully' })
})

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Private
export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    res.status(401)
    throw new Error('Not authorized, no refresh token')
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
    const user = await User.query().findById(decoded.id)

    if (!user) {
      res.status(401)
      throw new Error('Not authorized, user not found')
    }

    const newToken = user.generateAuthToken()

    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hour
    })

    res.json({ token: newToken })
  } catch (error) {
    res.status(401)
    throw new Error('Not authorized, refresh token failed')
  }
})