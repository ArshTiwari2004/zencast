import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import useWebRTC from '../hooks/useWebRTC'
import ParticipantView from '../components/ParticipantView'
import RecordingControls from '../components/RecordingControls'
import useMediaRecorder from '../hooks/useMediaRecorder'
import useUploadManager from '../hooks/useUploadManager'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { toast } from 'react-toastify'

const RecordingRoom = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [inviteLink, setInviteLink] = useState('')
  
  const {
    localStream,
    remoteStreams,
    participants,
    participantNames,
    isConnected,
    initWebRTC,
    toggleMedia,
    shareScreen,
    stopScreenShare
  } = useWebRTC(roomId || '', user?.name || 'Anonymous')
  
  const { startRecording, stopRecording, recordingState } = useMediaRecorder(localStream)
  const { uploadChunks } = useUploadManager()

  // Generate invite link
  useEffect(() => {
    if (roomId && window.location.href) {
      const url = new URL(window.location.href)
      setInviteLink(url.toString())
    }
  }, [roomId])

  // Initialize WebRTC connection
  useEffect(() => {
    if (!roomId || !user) {
      navigate('/')
      return
    }

    console.log('Initializing WebRTC connection for room:', roomId)
    const init = async () => {
      try {
        const cleanup = await initWebRTC()
        return cleanup
      } catch (error) {
        console.error('WebRTC initialization failed:', error)
        toast.error('Failed to connect to room')
        navigate('/dashboard')
      }
    }

    const cleanupPromise = init()

    return () => {
      cleanupPromise.then(cleanup => {
        if (cleanup) cleanup()
      })
    }
  }, [roomId, user, initWebRTC, navigate])

  const handleStartRecording = async () => {
    try {
      console.log('Starting recording...')
      await startRecording()
      setIsRecording(true)
      toast.success('Recording started')
    } catch (error) {
      console.error('Failed to start recording:', error)
      toast.error('Failed to start recording')
    }
  }

  const handleStopRecording = async () => {
    try {
      console.log('Stopping recording...')
      const { chunks } = await stopRecording()
      toast.info('Uploading recording...')
      await uploadChunks(chunks, roomId!, user!.id)
      setIsRecording(false)
      toast.success('Recording saved successfully')
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to stop recording:', error)
      toast.error('Failed to save recording')
    }
  }

  const handleToggleMute = useCallback(() => {
    console.log(`Toggling mute to ${!isMuted}`)
    toggleMedia('audio', isMuted)
    setIsMuted(!isMuted)
    toast.info(isMuted ? 'Microphone unmuted' : 'Microphone muted')
  }, [isMuted, toggleMedia])

  const handleToggleVideo = useCallback(() => {
    console.log(`Toggling video to ${!isVideoOn}`)
    toggleMedia('video', !isVideoOn)
    setIsVideoOn(!isVideoOn)
    toast.info(isVideoOn ? 'Video turned off' : 'Video turned on')
  }, [isVideoOn, toggleMedia])

  const handleScreenShare = async () => {
    try {
      console.log('Starting screen share...')
      await shareScreen()
      toast.success('Screen sharing started')
    } catch (error) {
      console.error('Screen sharing failed:', error)
      toast.error('Screen sharing failed')
    }
  }

  const handleStopScreenShare = async () => {
    try {
      console.log('Stopping screen share...')
      await stopScreenShare()
      toast.info('Screen sharing stopped')
    } catch (error) {
      console.error('Failed to stop screen share:', error)
    }
  }

  const handleLeave = () => {
    console.log('Leaving room...')
    navigate('/dashboard')
  }

  if (!isConnected || !localStream) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4 text-white">Connecting to room...</h1>
          <p className="text-gray-400 mb-6">Please wait while we connect you to the recording session.</p>
          
          {inviteLink && (
            <div className="mt-6">
              <p className="text-gray-400 mb-2">Invite others to join:</p>
              <div className="flex items-center bg-gray-700 rounded-lg p-2">
                <input 
                  type="text" 
                  value={inviteLink} 
                  readOnly 
                  className="flex-1 bg-transparent text-white p-2 text-sm truncate"
                />
                <CopyToClipboard text={inviteLink} onCopy={() => toast.info('Link copied to clipboard')}>
                  <button className="ml-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium">
                    Copy
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Recording Room: {roomId}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`h-3 w-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
            <span>{isRecording ? 'Recording' : 'Live'}</span>
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(inviteLink).then(() => toast.info('Link copied to clipboard'))}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            Copy Invite Link
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Local participant */}
          <div className="bg-gray-800 rounded-lg overflow-hidden border-2 border-emerald-500">
            <ParticipantView
              stream={localStream}
              isLocal
              isMuted={isMuted}
              name={user?.name || 'You'}
              isSpeaking={false}
            />
          </div>

          {/* Remote participants */}
          {Object.entries(remoteStreams).map(([id, stream]) => (
            <div key={id} className="bg-gray-800 rounded-lg overflow-hidden border-2 border-blue-500">
              <ParticipantView
                stream={stream}
                name={participantNames[id] || `Participant ${participants.indexOf(id) + 1}`}
                isSpeaking={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <RecordingControls
        isRecording={isRecording}
        isMuted={isMuted}
        isVideoOn={isVideoOn}
        isScreenSharing={false}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
        onScreenShare={handleScreenShare}
        onStopScreenShare={handleStopScreenShare}
        onLeave={handleLeave}
      />
    </div>
  )
}

export default RecordingRoom