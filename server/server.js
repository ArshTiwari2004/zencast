import { httpServer } from './app.js'
import { connectDB } from './config/db.js'
import { connectRedis } from './config/redis.js'


const PORT = process.env.PORT || 3001

const startServer = async () => {
  try {
    await connectDB()
    await connectRedis()
    
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()