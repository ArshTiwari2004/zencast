import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'
import authRoutes from './routes/authRoutes'
import recordingRoutes from './routes/recordingRoutes'
import uploadRoutes from './routes/uploadRoutes'
import errorHandler from './middleware/errorHandler'
import initializeSocket from './socket'

const app = express()
const httpServer = createServer(app)

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/recordings', recordingRoutes)
app.use('/api/uploads', uploadRoutes)

// Error handling
app.use(errorHandler)

// Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

initializeSocket(io)

export { app, httpServer }