import express from 'express'
import {
  registerUser,
  loginUser,
  storeTokens,
  logoutUser,
  refreshToken
} from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/store-tokens', protect, storeTokens)
router.post('/logout', protect, logoutUser)
router.post('/refresh', refreshToken)

export default router