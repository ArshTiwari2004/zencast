import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import useWebRTC from '../hooks/useWebRTC'
import ParticipantView from '../components/ParticipantView'
import RecordingControls from '../components/RecordingControls'
import useMediaRecorder from '../hooks/useMediaRecorder'
import useUploadManager from '../hooks/useUploadManager'

const RecordingRoom = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  
  const {
    localStream,
    remoteStreams,
    participants,
    isConnected,
    initWebRTC,
    toggleMedia
  } = useWebRTC(roomId || '')
  
  const { startRecording, stopRecording, recordingState } = useMediaRecorder(localStream)
  const { uploadChunks } = useUploadManager()

  useEffect(() => {
    if (!roomId || !user) {
      navigate('/')
      return
    }

    const cleanup = initWebRTC()

    return () => {
      cleanup && cleanup()
    }
  }, [roomId, user, initWebRTC, navigate])

  const handleStartRecording = async () => {
    try {
      await startRecording()
      setIsRecording(true)
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  const handleStopRecording = async () => {
    try {
      const { chunks } = await stopRecording()
      await uploadChunks(chunks, roomId!, user!.id)
      setIsRecording(false)
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to stop recording:', error)
    }
  }

  const handleToggleMute = () => {
    toggleMedia('audio', isMuted)
    setIsMuted(!isMuted)
  }

  const handleToggleVideo = () => {
    toggleMedia('video', !isVideoOn)
    setIsVideoOn(!isVideoOn)
  }

  const handleScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })
      // Replace video track in all peer connections
      const videoTrack = stream.getVideoTracks()[0]
      Object.values(peerConnectionsRef.current).forEach(pc => {
        const sender = pc.getSenders().find(s => s.track?.kind === 'video')
        if (sender) {
          sender.replaceTrack(videoTrack)
        }
      })
    } catch (error) {
      console.error('Screen sharing failed:', error)
    }
  }

  const handleLeave = () => {
    navigate('/dashboard')
  }

  if (!isConnected || !localStream) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connecting to room...</h1>
          <p className="text-gray-600">Please wait while zencast connect you to the recording session.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden">
      <div className="h-full p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Local participant */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <ParticipantView
            stream={localStream}
            isLocal
            isMuted={isMuted}
            name={user?.name || 'You'}
          />
        </div>

        {/* Remote participants */}
        {Object.entries(remoteStreams).map(([id, stream]) => (
          <div key={id} className="bg-gray-800 rounded-lg overflow-hidden">
            <ParticipantView
              stream={stream}
              name={`Participant ${participants.indexOf(id) + 1}`}
            />
          </div>
        ))}
      </div>

      <RecordingControls
        isRecording={isRecording}
        isMuted={isMuted}
        isVideoOn={isVideoOn}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
        onScreenShare={handleScreenShare}
        onLeave={handleLeave}
      />
    </div>
  )
}

export default RecordingRoom