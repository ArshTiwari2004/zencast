import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface RecordingState {
  status: 'idle' | 'recording' | 'paused' | 'stopped'
  chunks: Blob[]
  duration: number
  error: string | null
}

const useMediaRecorder = (stream: MediaStream | null) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIdRef = useRef(uuidv4())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [recordingState, setRecordingState] = useState<RecordingState>({
    status: 'idle',
    chunks: [],
    duration: 0,
    error: null
  })

  // Handle data available event
  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      setRecordingState(prev => ({
        ...prev,
        chunks: [...prev.chunks, event.data]
      }))
    }
  }

  // Handle recording error
  const handleError = (error: Event) => {
    console.error('MediaRecorder error:', error)
    setRecordingState(prev => ({
      ...prev,
      status: 'stopped',
      error: 'Recording error occurred'
    }))
    cleanup()
  }

  // Cleanup resources
  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }

  // Initialize MediaRecorder
  const initMediaRecorder = () => {
    if (!stream) {
      throw new Error('No stream available for recording')
    }

    const options = {
      mimeType: 'video/webm;codecs=vp9,opus',
      videoBitsPerSecond: 2500000,
      audioBitsPerSecond: 128000
    }

    try {
      mediaRecorderRef.current = new MediaRecorder(stream, options)
      mediaRecorderRef.current.ondataavailable = handleDataAvailable
      mediaRecorderRef.current.onerror = handleError
      mediaRecorderRef.current.onstop = () => {
        setRecordingState(prev => ({
          ...prev,
          status: 'stopped'
        }))
      }
    } catch (error) {
      console.error('MediaRecorder initialization failed:', error)
      throw new Error('MediaRecorder initialization failed')
    }
  }

  // Start recording
  const startRecording = async () => {
    if (!stream) {
      throw new Error('No stream available for recording')
    }

    try {
      if (!mediaRecorderRef.current) {
        initMediaRecorder()
      }

      if (mediaRecorderRef.current) {
        recordingIdRef.current = uuidv4()
        setRecordingState({
          status: 'recording',
          chunks: [],
          duration: 0,
          error: null
        })

        // Start recording with 1-second chunks
        mediaRecorderRef.current.start(1000)

        // Update duration every second
        intervalRef.current = setInterval(() => {
          setRecordingState(prev => ({
            ...prev,
            duration: prev.duration + 1
          }))
        }, 1000)
      }
    } catch (error) {
      console.error('Failed to start recording:', error)
      throw error
    }
  }

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setRecordingState(prev => ({
        ...prev,
        status: 'paused'
      }))
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setRecordingState(prev => ({
        ...prev,
        status: 'recording'
      }))
      intervalRef.current = setInterval(() => {
        setRecordingState(prev => ({
          ...prev,
          duration: prev.duration + 1
        }))
      }, 1000)
    }
  }

  // Stop recording
  const stopRecording = async () => {
    return new Promise<{ chunks: Blob[]; duration: number }>((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error('No active recording'))
        return
      }

      mediaRecorderRef.current.onstop = () => {
        cleanup()
        resolve({
          chunks: recordingState.chunks,
          duration: recordingState.duration
        })
      }

      try {
        mediaRecorderRef.current.stop()
      } catch (error) {
        cleanup()
        reject(error)
      }
    })
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  return {
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    recordingState
  }
}

export default useMediaRecorder