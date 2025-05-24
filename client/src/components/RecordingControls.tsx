import React from 'react'
import { Tooltip } from 'react-tooltip'

interface RecordingControlsProps {
  isRecording: boolean
  isMuted: boolean
  isVideoOn: boolean
  isScreenSharing: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onToggleMute: () => void
  onToggleVideo: () => void
  onScreenShare: () => void
  onStopScreenShare: () => void
  onLeave: () => void
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isMuted,
  isVideoOn,
  isScreenSharing,
  onStartRecording,
  onStopRecording,
  onToggleMute,
  onToggleVideo,
  onScreenShare,
  onStopScreenShare,
  onLeave
}) => {
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-full shadow-lg p-2 flex items-center space-x-2">
        {/* Mute/Unmute Button */}
        <button
          onClick={onToggleMute}
          className={`p-3 rounded-full ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          data-tooltip-id="mute-tooltip"
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
          <Tooltip id="mute-tooltip" place="top">
            {isMuted ? 'Click to unmute' : 'Click to mute'}
          </Tooltip>
        </button>

        {/* Video Toggle Button */}
        <button
          onClick={onToggleVideo}
          className={`p-3 rounded-full ${!isVideoOn ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          aria-label={isVideoOn ? 'Turn off video' : 'Turn on video'}
          data-tooltip-id="video-tooltip"
        >
          {isVideoOn ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
          <Tooltip id="video-tooltip" place="top">
            {isVideoOn ? 'Click to turn off video' : 'Click to turn on video'}
          </Tooltip>
        </button>

        {/* Screen Share Button */}
        {isScreenSharing ? (
          <button
            onClick={onStopScreenShare}
            className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600"
            aria-label="Stop screen share"
            data-tooltip-id="stop-screen-share-tooltip"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
            </svg>
            <Tooltip id="stop-screen-share-tooltip" place="top">
              Click to stop screen sharing
            </Tooltip>
          </button>
        ) : (
          <button
            onClick={onScreenShare}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Share screen"
            data-tooltip-id="screen-share-tooltip"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <Tooltip id="screen-share-tooltip" place="top">
              Click to share your screen
            </Tooltip>
          </button>
        )}

        {/* Recording Button */}
        {isRecording ? (
          <button
            onClick={onStopRecording}
            className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 animate-pulse"
            aria-label="Stop recording"
            data-tooltip-id="stop-recording-tooltip"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            <Tooltip id="stop-recording-tooltip" place="top">
              Click to stop recording
            </Tooltip>
          </button>
        ) : (
          <button
            onClick={onStartRecording}
            className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600"
            aria-label="Start recording"
            data-tooltip-id="start-recording-tooltip"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <Tooltip id="start-recording-tooltip" place="top">
              Click to start recording
            </Tooltip>
          </button>
        )}

        {/* Leave Button */}
        <button
          onClick={onLeave}
          className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600"
          aria-label="Leave call"
          data-tooltip-id="leave-tooltip"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
          </svg>
          <Tooltip id="leave-tooltip" place="top">
            Click to leave the call
          </Tooltip>
        </button>
      </div>
    </div>
  )
}

export default RecordingControls