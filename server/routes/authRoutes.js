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
router.post('/store-tokens', storeTokens) // removed protect middleware as If you are calling /store-tokens to store tokens initially right after login, the user likely does not yet have a valid token.
router.post('/logout', protect, logoutUser)
router.post('/refresh', refreshToken)

export default router