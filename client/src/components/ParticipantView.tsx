import React, { useEffect, useRef, useState } from 'react'
import { Tooltip } from 'react-tooltip'

interface ParticipantViewProps {
  stream: MediaStream
  isLocal?: boolean
  isSpeaking?: boolean
  isMuted?: boolean
  name?: string
}

const ParticipantView: React.FC<ParticipantViewProps> = ({
  stream,
  isLocal = false,
  isSpeaking = false,
  isMuted = false,
  name = 'Participant'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasVideo, setHasVideo] = useState(false)
  const [hasAudio, setHasAudio] = useState(false)

  // Handle stream changes
  useEffect(() => {
    if (!videoRef.current) return
    
    const videoElement = videoRef.current
    videoElement.srcObject = stream
    
    // Check for video tracks
    const videoTracks = stream.getVideoTracks()
    setHasVideo(videoTracks.length > 0 && videoTracks[0].enabled)
    
    // Check for audio tracks
    const audioTracks = stream.getAudioTracks()
    setHasAudio(audioTracks.length > 0 && audioTracks[0].enabled)
    
    const handleTrackChange = () => {
      setHasVideo(stream.getVideoTracks().some(t => t.enabled))
      setHasAudio(stream.getAudioTracks().some(t => t.enabled))
    }
    
    stream.addEventListener('addtrack', handleTrackChange)
    stream.addEventListener('removetrack', handleTrackChange)
    
    return () => {
      stream.removeEventListener('addtrack', handleTrackChange)
      stream.removeEventListener('removetrack', handleTrackChange)
    }
  }, [stream])

  return (
    <div className={`relative rounded-lg overflow-hidden h-full ${isSpeaking ? 'ring-2 ring-blue-500' : ''}`}>
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal || isMuted}
          className="w-full h-full object-cover bg-gray-800"
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-500">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-white font-medium truncate" data-tooltip-id={`name-tooltip-${name}`}>
              {name} {isLocal && '(You)'}
            </p>
            <Tooltip id={`name-tooltip-${name}`} place="top">
              {name} {isLocal && '(You)'}
            </Tooltip>
          </div>
          <div className="flex items-center space-x-2">
            {!hasVideo && (
              <span 
                className="bg-gray-600/80 text-white p-1 rounded-full"
                data-tooltip-id={`video-off-tooltip-${name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  <path d="M7 9a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1z" />
                </svg>
                <Tooltip id={`video-off-tooltip-${name}`} place="top">
                  Video is off
                </Tooltip>
              </span>
            )}
            {isMuted && (
              <span 
                className="bg-red-500/80 text-white p-1 rounded-full"
                data-tooltip-id={`muted-tooltip-${name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
                <Tooltip id={`muted-tooltip-${name}`} place="top">
                  Microphone is muted
                </Tooltip>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipantView