import express from 'express'
import {
  getPresignedUrl,
  completeUpload,
  getRecording
} from '../controllers/uploadController'
import { protect } from '../middleware/authMiddleware'

const router = express.Router()

router.post('/presigned-url', protect, getPresignedUrl)
router.post('/complete', protect, completeUpload)
router.get('/recording/:recordingId', protect, getRecording)

export default router