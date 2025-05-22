import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import type { Recording } from '../types'
import { formatDate, formatDuration } from '../utils/timeUtils'

const Dashboard = () => {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await api.get('/recordings')
        setRecordings(response.data)
      } catch (error) {
        if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
          setError((error as any).response.data.message || 'Failed to load recordings')
        } else {
          setError('Failed to load recordings')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecordings()
  }, [])

  const deleteRecording = async (id: string) => {
    try {
      await api.delete(`/recordings/${id}`)
      setRecordings(recordings.filter(r => r.id !== id))
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data
      ) {
        setError((error as any).response.data.message || 'Failed to delete recording')
      } else {
        setError('Failed to delete recording')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Recordings</h1>
        <Link
          to="/room/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          New Recording
        </Link>
      </div>

      {recordings.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600">No recordings yet</h2>
          <p className="mt-2 text-gray-500">
            Start a new recording to see it appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recordings.map((recording) => (
            <div
              key={recording.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative pb-[56.25%] bg-gray-200">
                {recording.status === 'completed' ? (
                  <video
                    src={recording.previewUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    loop
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-500 mb-2">
                        {recording.status === 'processing' ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            <span className="ml-2">Processing...</span>
                          </div>
                        ) : (
                          'Recording ready for processing'
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{recording.title}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {formatDate(recording.createdAt)}
                </p>
                <p className="text-gray-600 text-sm">
                  {formatDuration(recording.duration)}
                </p>
                <div className="mt-4 flex justify-between">
                  <Link
                    to={`/recording/${recording.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => deleteRecording(recording.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard