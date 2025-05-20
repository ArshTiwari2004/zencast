import express from 'express'
import {
  registerUser,
  loginUser,
  storeTokens,
  logoutUser,
  refreshToken
} from '../controllers/authController'
import { protect } from '../middleware/authMiddleware'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/store-tokens', protect, storeTokens)
router.post('/logout', protect, logoutUser)
router.post('/refresh', refreshToken)

export default router