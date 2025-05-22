import { useEffect, useState } from 'react'

interface StoredChunk {
  roomId: string
  userId: string
  chunkIndex: number
  chunkData: Blob
  totalChunks: number
}

const useIndexedDB = () => {
  const [db, setDb] = useState<IDBDatabase | null>(null)

  // Initialize IndexedDB
  useEffect(() => {
    const request = indexedDB.open('ZencastRecordings', 1)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('chunks')) {
        db.createObjectStore('chunks', { keyPath: ['roomId', 'userId', 'chunkIndex'] })
      }
    }

    request.onsuccess = () => {
      setDb(request.result)
    }

    request.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error)
    }
  }, [])

  // Store a chunk in IndexedDB
  const storeChunk = async (chunk: StoredChunk) => {
    if (!db) {
      throw new Error('IndexedDB not initialized')
    }

    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('chunks', 'readwrite')
      const store = transaction.objectStore('chunks')
      const request = store.put(chunk)

      request.onsuccess = () => resolve()
      request.onerror = (event) => {
        console.error('Failed to store chunk:', (event.target as IDBRequest).error)
        reject((event.target as IDBRequest).error)
      }
    })
  }

  // Get stored chunks for a room/user
  const getStoredChunks = async (roomId: string, userId: string) => {
    if (!db) return []

    return new Promise<StoredChunk[]>((resolve, reject) => {
      const transaction = db.transaction('chunks', 'readonly')
      const store = transaction.objectStore('chunks')
      const index = store.index('roomId')
      const request = index.getAll(IDBKeyRange.only(roomId))

      request.onsuccess = () => {
        const chunks = request.result.filter(
          (chunk: StoredChunk) => chunk.userId === userId
        )
        resolve(chunks)
      }

      request.onerror = (event) => {
        console.error('Failed to get stored chunks:', (event.target as IDBRequest).error)
        reject((event.target as IDBRequest).error)
      }
    })
  }

  // Clear stored chunks
  const clearStoredChunks = async (
    roomId: string,
    userId: string,
    chunkIndex?: number
  ) => {
    if (!db) return

    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('chunks', 'readwrite')
      const store = transaction.objectStore('chunks')

      if (chunkIndex !== undefined) {
        // Clear specific chunk
        const request = store.delete([roomId, userId, chunkIndex])
        request.onsuccess = () => resolve()
        request.onerror = (event) => {
          console.error('Failed to clear chunk:', (event.target as IDBRequest).error)
          reject((event.target as IDBRequest).error)
        }
      } else {
        // Clear all chunks for room/user
        const request = store.delete(IDBKeyRange.only([roomId, userId]))
        request.onsuccess = () => resolve()
        request.onerror = (event) => {
          console.error('Failed to clear chunks:', (event.target as IDBRequest).error)
          reject((event.target as IDBRequest).error)
        }
      }
    })
  }

  return {
    storeChunk,
    getStoredChunks,
    clearStoredChunks
  }
}

export default useIndexedDB