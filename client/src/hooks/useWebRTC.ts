import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

interface PeerConnection {
  [key: string]: RTCPeerConnection
}

interface RemoteStream {
  [key: string]: MediaStream
}

interface ParticipantNames {
  [key: string]: string
}

interface WebRTCConfig {
  iceServers: RTCIceServer[]
}

const useWebRTC = (roomId: string, userName: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream>({})
  const [participantNames, setParticipantNames] = useState<ParticipantNames>({})
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState<string[]>([])
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  
  const socketRef = useRef<Socket | null>(null)
  const peerConnectionsRef = useRef<PeerConnection>({})
  const localStreamRef = useRef<MediaStream | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)
  const userIdRef = useRef(uuidv4())

  // WebRTC Configuration
  const rtcConfig: WebRTCConfig = {
    iceServers: [
      { urls: import.meta.env.VITE_STUN_SERVER_URL || 'stun:stun.l.google.com:19302' },
      {
        urls: import.meta.env.VITE_TURN_SERVER_URL,
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL
      }
    ]
  }

  // Initialize media stream
  const initLocalStream = useCallback(async () => {
    try {
      console.log('Initializing local media stream...')
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('Local stream obtained:', stream.id)
      setLocalStream(stream)
      localStreamRef.current = stream
      return stream
    } catch (error) {
      console.error('Error accessing media devices:', error)
      throw error
    }
  }, [])

  // Create peer connection
  const createPeerConnection = useCallback(async (participantId: string) => {
    if (peerConnectionsRef.current[participantId]) {
      console.log(`Peer connection to ${participantId} already exists`)
      return peerConnectionsRef.current[participantId]
    }

    console.log(`Creating new peer connection to ${participantId}`)
    const pc = new RTCPeerConnection(rtcConfig)
    peerConnectionsRef.current[participantId] = pc

    // Add current tracks to connection
    const streamToUse = isScreenSharing && screenStreamRef.current ? 
      screenStreamRef.current : localStreamRef.current

    if (streamToUse) {
      streamToUse.getTracks().forEach(track => {
        console.log(`Adding ${track.kind} track to peer connection`)
        pc.addTrack(track, streamToUse)
      })
    }

    // ICE Candidate handler
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        console.log(`Sending ICE candidate to ${participantId}`)
        socketRef.current.emit('ice-candidate', {
          to: participantId,
          candidate: event.candidate
        })
      }
    }

    // Track handler
    pc.ontrack = (event) => {
      console.log(`Received remote ${event.track.kind} track from ${participantId}`)
      setRemoteStreams(prev => ({
        ...prev,
        [participantId]: event.streams[0]
      }))
    }

    // Negotiation needed handler
    pc.onnegotiationneeded = async () => {
      try {
        console.log(`Negotiation needed with ${participantId}`)
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socketRef.current?.emit('offer', {
          to: participantId,
          offer
        })
      } catch (error) {
        console.error('Error creating offer:', error)
      }
    }

    // ICE Connection state handler
    pc.oniceconnectionstatechange = () => {
      console.log(
        `ICE connection state with ${participantId}:`,
        pc.iceConnectionState
      )
      if (pc.iceConnectionState === 'failed') {
        console.log('ICE connection failed, restarting ICE...')
        pc.restartIce()
      }
    }

    return pc
  }, [isScreenSharing])

  // Initialize socket connection
  const initSocket = useCallback(() => {
    console.log('Initializing socket connection...')
    const socket = io(import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3001', {
      query: { roomId, userId: userIdRef.current, userName },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket']
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket.id)
      setIsConnected(true)
    })

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      setIsConnected(false)
      if (reason === 'io server disconnect') {
        socket.connect()
      }
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    socket.on('participants', (participantsList: string[], names: ParticipantNames) => {
      console.log('Current participants:', participantsList, names)
      setParticipants(participantsList.filter(id => id !== userIdRef.current))
      setParticipantNames(names)
    })

    socket.on('newParticipant', async (participantId: string, name: string) => {
      console.log(`New participant joined: ${participantId} (${name})`)
      setParticipantNames(prev => ({ ...prev, [participantId]: name }))
      await createPeerConnection(participantId)
    })

    socket.on('offer', async ({ from, offer }) => {
      console.log(`Received offer from ${from}`)
      if (!peerConnectionsRef.current[from]) {
        await createPeerConnection(from)
      }
      const pc = peerConnectionsRef.current[from]
      await pc.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      socketRef.current?.emit('answer', { to: from, answer })
    })

    socket.on('answer', async ({ from, answer }) => {
      console.log(`Received answer from ${from}`)
      const pc = peerConnectionsRef.current[from]
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer))
      }
    })

    socket.on('ice-candidate', async ({ from, candidate }) => {
      console.log(`Received ICE candidate from ${from}`)
      const pc = peerConnectionsRef.current[from]
      if (pc && candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate))
        } catch (error) {
          console.error('Error adding ICE candidate:', error)
        }
      }
    })

    socket.on('participantLeft', (participantId: string) => {
      console.log(`Participant left: ${participantId}`)
      if (peerConnectionsRef.current[participantId]) {
        peerConnectionsRef.current[participantId].close()
        delete peerConnectionsRef.current[participantId]
        setRemoteStreams(prev => {
          const newStreams = { ...prev }
          delete newStreams[participantId]
          return newStreams
        })
        setParticipants(prev => prev.filter(id => id !== participantId))
        setParticipantNames(prev => {
          const newNames = { ...prev }
          delete newNames[participantId]
          return newNames
        })
      }
    })

    return socket
  }, [createPeerConnection, roomId, userName])

  // Share screen
  const shareScreen = useCallback(async () => {
    try {
      console.log('Starting screen share...')
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })
      
      screenStreamRef.current = stream
      setIsScreenSharing(true)
      
      // Replace video track in all peer connections
      const videoTrack = stream.getVideoTracks()[0]
      Object.entries(peerConnectionsRef.current).forEach(([id, pc]) => {
        const sender = pc.getSenders().find(s => s.track?.kind === 'video')
        if (sender) {
          console.log(`Replacing video track for ${id}`)
          sender.replaceTrack(videoTrack)
        }
      })
      
      // Handle when user stops screen sharing
      videoTrack.onended = () => {
        stopScreenShare()
      }
      
      return stream
    } catch (error) {
      console.error('Screen sharing failed:', error)
      throw error
    }
  }, [])

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    if (!screenStreamRef.current) return
    
    console.log('Stopping screen share...')
    const videoTracks = screenStreamRef.current.getVideoTracks()
    videoTracks.forEach(track => track.stop())
    
    // Restore original video track if available
    if (localStreamRef.current) {
      const originalVideoTrack = localStreamRef.current.getVideoTracks()[0]
      Object.entries(peerConnectionsRef.current).forEach(([id, pc]) => {
        const sender = pc.getSenders().find(s => s.track?.kind === 'video')
        if (sender && originalVideoTrack) {
          console.log(`Restoring original video track for ${id}`)
          sender.replaceTrack(originalVideoTrack)
        }
      })
    }
    
    screenStreamRef.current = null
    setIsScreenSharing(false)
  }, [])

  // Toggle media tracks
  const toggleMedia = useCallback((type: 'audio' | 'video', enabled: boolean) => {
    if (!localStreamRef.current) return
    
    console.log(`Toggling ${type} to ${enabled}`)
    const streamToUse = isScreenSharing && type === 'video' && screenStreamRef.current ? 
      screenStreamRef.current : localStreamRef.current
    
    streamToUse.getTracks()
      .filter(track => track.kind === type)
      .forEach(track => {
        track.enabled = enabled
      })

    // Notify other participants
    Object.entries(peerConnectionsRef.current).forEach(([id, pc]) => {
      const senders = pc.getSenders()
      senders.forEach(sender => {
        if (sender.track?.kind === type) {
          const newTrack = streamToUse.getTracks().find(t => t.kind === type) || null
          console.log(`Replacing ${type} track for ${id}`)
          sender.replaceTrack(newTrack)
        }
      })
    })
  }, [isScreenSharing])

  // Initialize WebRTC
  const initWebRTC = useCallback(async () => {
    try {
      await initLocalStream()
      const socket = initSocket()

      return () => {
        console.log('Cleaning up WebRTC resources...')
        socket.disconnect()
        Object.values(peerConnectionsRef.current).forEach(pc => pc.close())
        localStreamRef.current?.getTracks().forEach(track => track.stop())
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop())
        }
      }
    } catch (error) {
      console.error('WebRTC initialization failed:', error)
      throw error
    }
  }, [initLocalStream, initSocket])

  return {
    localStream,
    remoteStreams,
    participants,
    participantNames,
    isConnected,
    isScreenSharing,
    initWebRTC,
    toggleMedia,
    shareScreen,
    stopScreenShare
  }
}

export default useWebRTC