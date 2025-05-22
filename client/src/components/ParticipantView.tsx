import React from 'react'

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
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className={`relative rounded-lg overflow-hidden ${isSpeaking ? 'ring-2 ring-blue-500' : ''}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal || isMuted}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-white font-medium">{name}</p>
          </div>
          <div className="flex items-center space-x-2">
            {isMuted && (
              <span className="bg-red-500 text-white p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipantView