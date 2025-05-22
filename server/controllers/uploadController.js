import asyncHandler from 'express-async-handler'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3Client } from '../config/aws'
import Recording from '../models/Recording'

// @desc    Get presigned URL for chunk upload
// @route   POST /api/uploads/presigned-url
// @access  Private
export const getPresignedUrl = asyncHandler(async (req, res) => {
  const { roomId, chunkIndex } = req.body
  const userId = req.user.id

  const key = `recordings/${roomId}/${userId}/${chunkIndex}.webm`

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: 'video/webm'
  })

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    res.json({ url, key })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    res.status(500)
    throw new Error('Failed to generate upload URL')
  }
})

// @desc    Complete upload and notify processing
// @route   POST /api/uploads/complete
// @access  Private
export const completeUpload = asyncHandler(async (req, res) => {
  const { roomId, userId, totalChunks } = req.body

  // Update recording status in database
  await Recording.query()
    .where({ roomId, userId })
    .patch({ status: 'uploading', chunksCount: totalChunks })

  // Trigger processing worker (implementation depends on your queue system)
  // await triggerProcessingWorker(roomId, userId)

  res.json({ message: 'Upload completed, processing started' })
})

// @desc    Get recording for playback
// @route   GET /api/uploads/recording/:recordingId
// @access  Private
export const getRecording = asyncHandler(async (req, res) => {
  const { recordingId } = req.params
  const userId = req.user.id

  const recording = await Recording.query()
    .findById(recordingId)
    .where({ userId })
    .first()

  if (!recording) {
    res.status(404)
    throw new Error('Recording not found')
  }

  const key = `processed/${recordingId}/final.mp4`

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key
  })

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    res.json({ url })
  } catch (error) {
    console.error('Error generating playback URL:', error)
    res.status(500)
    throw new Error('Failed to generate playback URL')
  }
})