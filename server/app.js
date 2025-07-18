import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'
import authRoutes from './routes/authRoutes.js'
import recordingRoutes from './routes/recordingRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import errorHandler from './middleware/errorHandler.js'
import initializeSocket from './socket.js'

const app = express()
const httpServer = createServer(app)

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
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
    origin: ['http://localhost:5173', 'http://localhost:3000'], // supporting both ports temporarily
    methods: ['GET', 'POST'],
    credentials: true
  }
})


initializeSocket(io)

export { app, httpServer }