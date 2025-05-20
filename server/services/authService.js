import User from '../models/User'
import { redisClient } from '../config/redis'

export const createUser = async (userData) => {
  return await User.query().insert(userData)
}

export const findUserByEmail = async (email) => {
  return await User.query().findOne({ email })
}

export const blacklistToken = async (token, expiresIn) => {
  await redisClient.set(`bl_${token}`, '1', {
    EX: Math.floor(expiresIn / 1000)
  })
}

export const isTokenBlacklisted = async (token) => {
  return await redisClient.get(`bl_${token}`)
}