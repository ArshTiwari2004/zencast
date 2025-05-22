import { Worker } from 'bull'
import { redisClient } from './config/redis'
import { processRecordingJob } from './services/processingService'
import chalk from 'chalk'

// Initialize Redis connection
const connectRedis = async () => {
  try {
    await redisClient.connect()
    console.log(chalk.green('✓ Redis connected'))
  } catch (error) {
    console.error(chalk.red('✗ Redis connection error:'), error)
    process.exit(1)
  }
}

// Initialize processing worker
const initWorker = () => {
  const worker = new Worker(
    'recording-processing',
    async (job) => {
      try {
        console.log(chalk.blue(`Processing job ${job.id}`))
        await processRecordingJob(job.data)
        console.log(chalk.green(`Completed job ${job.id}`))
      } catch (error) {
        console.error(chalk.red(`Job ${job.id} failed:`), error)
        throw error
      }
    },
    {
      connection: redisClient,
      concurrency: 2, // Process 2 jobs concurrently
      limiter: {
        max: 5,
        duration: 10000 // 10 seconds
      }
    }
  )

  worker.on('completed', (job) => {
    console.log(chalk.green(`Job ${job.id} completed successfully`))
  })

  worker.on('failed', (job, error) => {
    console.error(chalk.red(`Job ${job.id} failed:`), error)
  })

  console.log(chalk.blue('✓ Worker started and listening for jobs'))
}

// Main execution
(async () => {
  try {
    await connectRedis()
    initWorker()
  } catch (error) {
    console.error(chalk.red('Worker initialization failed:'), error)
    process.exit(1)
  }
})()