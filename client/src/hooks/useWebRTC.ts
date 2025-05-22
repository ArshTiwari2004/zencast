import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

interface PeerConnection {
  [key: string]: RTCPeerConnection
}

interface RemoteStream {
  [key: string]: MediaStream
}

interface WebRTCConfig {
  iceServers: RTCIceServer[]
}

const useWebRTC = (roomId: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream>({})
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState<string[]>([])
  
  const socketRef = useRef<Socket | null>(null)
  const peerConnectionsRef = useRef<PeerConnection>({})
  const localStreamRef = useRef<MediaStream | null>(null)
  const userIdRef = useRef(uuidv4())

  // WebRTC Configuration
  const rtcConfig: WebRTCConfig = {
    iceServers: [
      { urls: import.meta.env.VITE_STUN_SERVER_URL || 'stun:stun.l.google.com:19302' },
      // Helps a client (e.g., your browser) discover its public IP and port as seen by an external server (outside NAT).
      {
        urls: import.meta.env.VITE_TURN_SERVER_URL, // fallback for STUN server
        // The TURN server URL, which is used for relaying media when direct peer-to-peer connection fails.
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL
      }
    ]
  }

  // Initialize media stream
  const initLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      })
      setLocalStream(stream)
      localStreamRef.current = stream
      return stream
    } catch (error) {
      console.error('Error accessing media devices:', error)
      throw error
    }
  }

  // Initialize socket connection
  const initSocket = () => {
    const socket = io(import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3001', {
      query: { roomId, userId: userIdRef.current }
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
      console.log('Socket connected')
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Socket disconnected')
    })

    socket.on('participants', (participantsList: string[]) => {
      setParticipants(participantsList.filter(id => id !== userIdRef.current))
    })

    socket.on('newParticipant', (participantId: string) => {
      createPeerConnection(participantId)
    })

    socket.on('offer', async ({ from, offer }) => {
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
      const pc = peerConnectionsRef.current[from]
      await pc.setRemoteDescription(new RTCSessionDescription(answer))
    })

    socket.on('ice-candidate', async ({ from, candidate }) => {
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
      if (peerConnectionsRef.current[participantId]) {
        peerConnectionsRef.current[participantId].close()
        delete peerConnectionsRef.current[participantId]
        setRemoteStreams(prev => {
          const newStreams = { ...prev }
          delete newStreams[participantId]
          return newStreams
        })
        setParticipants(prev => prev.filter(id => id !== participantId))
      }
    })

    return socket
  }

  // Create peer connection
  const createPeerConnection = async (participantId: string) => {
    if (peerConnectionsRef.current[participantId]) return

    const pc = new RTCPeerConnection(rtcConfig)
    peerConnectionsRef.current[participantId] = pc

    // Add local stream to connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!)
      })
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit('ice-candidate', {
          to: participantId,
          candidate: event.candidate
        })
      }
    }

    // Handle remote streams
    pc.ontrack = (event) => {
      setRemoteStreams(prev => ({
        ...prev,
        [participantId]: event.streams[0]
      }))
    }

    pc.onnegotiationneeded = async () => {
      try {
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

    pc.oniceconnectionstatechange = () => {
      console.log(
        `ICE connection state with ${participantId}:`,
        pc.iceConnectionState
      )
      if (pc.iceConnectionState === 'failed') {
        pc.restartIce()
      }
    }

    return pc
  }

  // Initialize WebRTC
  const initWebRTC = async () => {
    await initLocalStream()
    const socket = initSocket()

    return () => {
      socket.disconnect()
      Object.values(peerConnectionsRef.current).forEach(pc => pc.close())
      localStreamRef.current?.getTracks().forEach(track => track.stop())
    }
  }

  // Toggle media tracks
  const toggleMedia = (type: 'audio' | 'video', enabled: boolean) => {
    if (!localStreamRef.current) return

    localStreamRef.current.getTracks()
      .filter(track => track.kind === type)
      .forEach(track => {
        track.enabled = enabled
      })

    // Notify other participants
    Object.values(peerConnectionsRef.current).forEach(pc => {
      const senders = pc.getSenders()
      senders.forEach(sender => {
        if (sender.track?.kind === type) {
          sender.replaceTrack(
            localStreamRef.current!
              .getTracks()
              .find(t => t.kind === type) || null
          )
        }
      })
    })
  }

  return {
    localStream,
    remoteStreams,
    participants,
    isConnected,
    initWebRTC,
    toggleMedia
  }
}

export default useWebRTC