import asyncHandler from 'express-async-handler'
import Recording from '../models/Recording'
import { v4 as uuidv4 } from 'uuid'
import { redisClient } from '../config/redis'

// @desc    Create a new recording session
// @route   POST /api/recordings
// @access  Private
export const createRecording = asyncHandler(async (req, res) => {
  const { title, description } = req.body
  const userId = req.user.id

  const recording = await Recording.query().insert({
    id: uuidv4(),
    userId,
    title,
    description,
    status: 'pending'
  })

  // Create a room in Redis
  await redisClient.sAdd(`room:${recording.id}:participants`, userId)

  res.status(201).json(recording)
})

// @desc    Get all recordings for user
// @route   GET /api/recordings
// @access  Private
export const listRecordings = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const recordings = await Recording.query()
    .where({ userId })
    .orderBy('createdAt', 'desc')

  res.json(recordings)
})

// @desc    Get single recording
// @route   GET /api/recordings/:id
// @access  Private
export const getRecording = asyncHandler(async (req, res) => {
  const recording = await Recording.query()
    .findById(req.params.id)
    .where({ userId: req.user.id })
    .withGraphFetched('[participants, user]')

  if (!recording) {
    res.status(404)
    throw new Error('Recording not found')
  }

  res.json(recording)
})

// @desc    Delete recording
// @route   DELETE /api/recordings/:id
// @access  Private
export const deleteRecording = asyncHandler(async (req, res) => {
  const recording = await Recording.query()
    .findById(req.params.id)
    .where({ userId: req.user.id })

  if (!recording) {
    res.status(404)
    throw new Error('Recording not found')
  }

  await recording.$query().delete()
  
  // Clean up Redis room
  await redisClient.del(`room:${req.params.id}:participants`)

  res.json({ message: 'Recording removed' })
})