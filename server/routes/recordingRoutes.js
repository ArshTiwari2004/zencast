import express from 'express'
import {
  createRecording,
  getRecording,
  listRecordings,
  deleteRecording
} from '../controllers/recordingController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
  .post(protect, createRecording)
  .get(protect, listRecordings)

router.route('/:id')
  .get(protect, getRecording)
  .delete(protect, deleteRecording)

export default router