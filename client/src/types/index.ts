export interface Recording {
  id: string
  title: string
  description: string
  duration: number
  status: 'pending' | 'recording' | 'uploading' | 'processing' | 'completed' | 'failed'
  previewUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Participant {
  id: string
  name: string
  isSpeaking: boolean
}

export interface RecordingDetail extends Recording {
  participants: Participant[]
  chunks: {
    index: number
    status: 'uploaded' | 'processing' | 'completed'
  }[]
}