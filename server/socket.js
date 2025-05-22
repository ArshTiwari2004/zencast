import { Server } from 'socket.io'
import { redisClient } from './config/redis.js'

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`New socket connection: ${socket.id}`)

    // Join room
    socket.on('joinRoom', ({ roomId, userId }) => {
      socket.join(roomId)
      redisClient.sAdd(`room:${roomId}:participants`, userId)
      io.to(roomId).emit('participantJoined', userId)
    })

    // WebRTC signaling
    socket.on('offer', ({ to, offer }) => {
      io.to(to).emit('offer', { from: socket.id, offer })
    })

    socket.on('answer', ({ to, answer }) => {
      io.to(to).emit('answer', { from: socket.id, answer })
    })

    socket.on('ice-candidate', ({ to, candidate }) => {
      io.to(to).emit('ice-candidate', { from: socket.id, candidate })
    })

    // Leave room
    socket.on('disconnect', () => {
      const rooms = Array.from(socket.rooms)
      rooms.forEach(roomId => {
        if (roomId !== socket.id) {
          io.to(roomId).emit('participantLeft', socket.id)
          redisClient.sRem(`room:${roomId}:participants`, socket.id)
        }
      })
    })
  })
}

export default initializeSocket