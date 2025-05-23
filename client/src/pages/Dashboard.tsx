"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import type { Recording } from "../types"
import { formatDate, formatDuration } from "../utils/timeUtils"
import GradientBackground from "../components/gradient-background"
import { Plus, Play, Trash2, Eye, Calendar, Clock, Users } from "lucide-react"

const Dashboard = () => {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await api.get("/recordings")
        setRecordings(response.data)
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "message" in error.response.data
        ) {
          setError((error as any).response.data.message || "Failed to load recordings")
        } else {
          setError("Failed to load recordings")
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
      setRecordings(recordings.filter((r) => r.id !== id))
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
      ) {
        setError((error as any).response.data.message || "Failed to delete recording")
      } else {
        setError("Failed to delete recording")
      }
    }
  }

  if (isLoading) {
    return (
      <GradientBackground variant="primary" className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading your recordings...</p>
        </div>
      </GradientBackground>
    )
  }

  if (error) {
    return (
      <GradientBackground variant="primary" className="min-h-screen flex justify-center items-center">
        <div className="max-w-md mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </GradientBackground>
    )
  }

  return (
    <GradientBackground variant="primary" className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Your Studio</h1>
            <p className="text-xl text-gray-300">Manage your podcast recordings and create new content</p>
          </div>
          <Link
            to="/room/new"
            className="mt-6 md:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Recording
          </Link>
        </div>

        {recordings.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="w-12 h-12 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Ready to create your first podcast?</h2>
              <p className="text-gray-400 mb-8">
                Start a new recording session and experience the future of podcast creation
              </p>
              <Link
                to="/room/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Recording
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recordings.map((recording) => (
              <div
                key={recording.id}
                className="group bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-800">
                  {recording.status === "completed" ? (
                    <video src={recording.previewUrl} className="w-full h-full object-cover" muted loop />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        {recording.status === "processing" ? (
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <span className="text-cyan-400 font-medium">Processing...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Users className="w-12 h-12 text-gray-500 mb-4" />
                            <span className="text-gray-400">Ready for processing</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        recording.status === "completed"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : recording.status === "processing"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      }`}
                    >
                      {recording.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {recording.title}
                  </h3>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(recording.createdAt)}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatDuration(recording.duration)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link
                      to={`/recording/${recording.id}`}
                      className="flex items-center text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Link>
                    <button
                      onClick={() => deleteRecording(recording.id)}
                      className="flex items-center text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GradientBackground>
  )
}

export default Dashboard
