import { useState } from 'react'
import api from '../services/api'
import { useIndexedDB } from './useIndexedDB'

interface UploadState {
  status: 'idle' | 'uploading' | 'paused' | 'completed' | 'error'
  uploadedChunks: number
  totalChunks: number
  error: string | null
}

const useUploadManager = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    uploadedChunks: 0,
    totalChunks: 0,
    error: null
  })
  const { storeChunk, getStoredChunks, clearStoredChunks } = useIndexedDB()

  // Get presigned URL for chunk upload
  const getPresignedUrl = async (roomId: string, chunkIndex: number) => {
    try {
      const response = await api.post('/uploads/presigned-url', {
        roomId,
        chunkIndex
      })
      return response.data.url
    } catch (error) {
      console.error('Failed to get presigned URL:', error)
      throw error
    }
  }

  // Upload a single chunk
  const uploadChunk = async (
    chunk: Blob,
    roomId: string,
    userId: string,
    chunkIndex: number,
    totalChunks: number
  ) => {
    const presignedUrl = await getPresignedUrl(roomId, chunkIndex)
    
    try {
      await api.put(presignedUrl, chunk, {
        headers: {
          'Content-Type': 'video/webm'
        }
      })

      return true
    } catch (error) {
      // Fallback to IndexedDB if upload fails
      await storeChunk({
        roomId,
        userId,
        chunkIndex,
        chunkData: chunk,
        totalChunks
      })
      return false
    }
  }

  // Upload all chunks
  const uploadChunks = async (chunks: Blob[], roomId: string, userId: string) => {
    setUploadState({
      status: 'uploading',
      uploadedChunks: 0,
      totalChunks: chunks.length,
      error: null
    })

    try {
      // First try to upload any pending chunks from IndexedDB
      const pendingChunks = await getStoredChunks(roomId, userId)
      if (pendingChunks.length > 0) {
        await processPendingChunks(pendingChunks, roomId, userId)
      }

      // Upload current chunks
      for (let i = 0; i < chunks.length; i++) {
        const success = await uploadChunk(
          chunks[i],
          roomId,
          userId,
          i,
          chunks.length
        )

        setUploadState(prev => ({
          ...prev,
          uploadedChunks: prev.uploadedChunks + (success ? 1 : 0)
        }))
      }

      // Mark upload as complete
      await api.post('/uploads/complete', {
        roomId,
        userId,
        totalChunks: chunks.length
      })

      setUploadState(prev => ({
        ...prev,
        status: 'completed'
      }))

      // Clear stored chunks
      await clearStoredChunks(roomId, userId)
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        error: (error instanceof Error && error.message) ? error.message : 'Upload failed'
      }))
      throw error
    }
  }

  // Process pending chunks from IndexedDB
  const processPendingChunks = async (chunks: any[], roomId: string, userId: string) => {
    for (const { chunkIndex, chunkData } of chunks) {
      const success = await uploadChunk(
        chunkData,
        roomId,
        userId,
        chunkIndex,
        chunks.length
      )

      if (success) {
        // Remove successfully uploaded chunk from IndexedDB
        await clearStoredChunks(roomId, userId, chunkIndex)
      }
    }
  }

  return {
    uploadChunks,
    uploadState
  }
}

export default useUploadManager