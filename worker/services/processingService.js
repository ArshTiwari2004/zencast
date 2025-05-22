import ffmpeg from 'fluent-ffmpeg'
import { join } from 'path'
import { tmpdir } from 'os'
import { mkdtemp, rm } from 'fs/promises'
import { s3Client } from '../config/aws'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { createReadStream, createWriteStream } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { compile } from 'handlebars'
import puppeteer from 'puppeteer'
import { v4 as uuidv4 } from 'uuid'

const PROCESSING_TIMEOUT = 30 * 60 * 1000 // 30 minutes

export const processRecordingJob = async (jobData) => {
  const { roomId, userId } = jobData
  const tempDir = await mkdtemp(join(tmpdir(), 'zencast-'))
  
  try {
    console.log(`Starting processing for room ${roomId}`)
    
    // 1. Download all chunks from S3
    const chunks = await downloadChunks(roomId, userId, tempDir)
    
    // 2. Combine audio/video streams
    const combinedFile = await combineStreams(chunks, tempDir)
    
    // 3. Generate dynamic layout
    const layoutFile = await generateLayout(combinedFile, tempDir)
    
    // 4. Upload final processed file
    await uploadProcessedFile(layoutFile, roomId)
    
    // 5. Update database status
    await updateRecordingStatus(roomId, 'completed')
    
    console.log(`Processing completed for room ${roomId}`)
  } finally {
    // Cleanup temp files
    await rm(tempDir, { recursive: true, force: true })
  }
}

const downloadChunks = async (roomId, userId, tempDir) => {
  console.log(`Downloading chunks for room ${roomId}`)
  
  const chunks = []
  let index = 0
  
  while (true) {
    try {
      const key = `recordings/${roomId}/${userId}/${index}.webm`
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key
      })
      
      const { Body } = await s3Client.send(command)
      const chunkPath = join(tempDir, `${index}.webm`)
      const writeStream = createWriteStream(chunkPath)
      
      await new Promise((resolve, reject) => {
        Body.pipe(writeStream)
          .on('error', reject)
          .on('finish', resolve)
      })
      
      chunks.push(chunkPath)
      index++
    } catch (error) {
      if (error.name === 'NoSuchKey') {
        break // No more chunks
      }
      throw error
    }
  }
  
  if (chunks.length === 0) {
    throw new Error('No chunks found for processing')
  }
  
  return chunks
}

const combineStreams = async (chunkPaths, tempDir) => {
  console.log(`Combining ${chunkPaths.length} chunks`)
  
  const outputFile = join(tempDir, 'combined.webm')
  
  return new Promise((resolve, reject) => {
    const command = ffmpeg()
    
    chunkPaths.forEach(path => command.input(path))
    
    command
      .on('start', (cmd) => console.log(`FFmpeg started: ${cmd}`))
      .on('progress', (progress) => console.log(`Processing: ${progress.timemark}`))
      .on('error', (err) => {
        console.error('FFmpeg error:', err)
        reject(err)
      })
      .on('end', () => {
        console.log('FFmpeg processing finished')
        resolve(outputFile)
      })
      .mergeToFile(outputFile, tempDir)
  })
}

const generateLayout = async (videoPath, tempDir) => {
  console.log('Generating dynamic layout')
  
  // 1. Extract metadata (duration, participants, etc.)
  const metadata = await getVideoMetadata(videoPath)
  
  // 2. Generate layout HTML
  const layoutHtml = await renderLayoutTemplate(metadata)
  
  // 3. Use Puppeteer to render layout
  const finalOutput = join(tempDir, 'final.mp4')
  await renderWithPuppeteer(layoutHtml, videoPath, finalOutput)
  
  return finalOutput
}

const getVideoMetadata = async (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err)
      
      const streams = metadata.streams || []
      const videoStream = streams.find(s => s.codec_type === 'video')
      const audioStream = streams.find(s => s.codec_type === 'audio')
      
      resolve({
        duration: metadata.format.duration,
        width: videoStream?.width || 1280,
        height: videoStream?.height || 720,
        hasAudio: !!audioStream,
        hasVideo: !!videoStream
      })
    })
  })
}

const renderLayoutTemplate = async (metadata) => {
  const templateSource = await readFile(
    join(process.cwd(), 'worker/layouts/default.hbs'),
    'utf-8'
  )
  const template = compile(templateSource)
  return template({
    ...metadata,
    participants: [
      { id: 'host', name: 'Host', isSpeaking: true },
      { id: 'guest1', name: 'Guest 1', isSpeaking: false }
    ],
    timestamp: Date.now()
  })
}

const renderWithPuppeteer = async (html, videoPath, outputPath) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const page = await browser.newPage()
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: PROCESSING_TIMEOUT
    })
    
    // Add video element to page
    await page.evaluate((videoPath) => {
      const video = document.createElement('video')
      video.src = videoPath
      video.autoplay = true
      video.controls = false
      video.style.position = 'fixed'
      video.style.top = '0'
      video.style.left = '0'
      video.style.width = '100%'
      video.style.height = '100%'
      document.body.appendChild(video)
    }, videoPath)
    
    // Record page with video
    await page.screenshot({
      path: outputPath,
      type: 'jpeg',
      quality: 100,
      fullPage: true,
      omitBackground: true
    })
  } finally {
    await browser.close()
  }
}

const uploadProcessedFile = async (filePath, roomId) => {
  console.log(`Uploading processed file for room ${roomId}`)
  
  const fileStream = createReadStream(filePath)
  const key = `processed/${roomId}/final.mp4`
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: fileStream,
    ContentType: 'video/mp4'
  })
  
  await s3Client.send(command)
  return key
}

const updateRecordingStatus = async (roomId, status) => {
  // we would be using a database ORM like Objection.js or Knex.js
  // to update the status of the recording in the database
  // This is a placeholder for the database update
  console.log(`Updating status for room ${roomId} to ${status}`)
}