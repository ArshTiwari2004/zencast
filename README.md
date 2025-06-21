<h2 align="center"><strong>Zencast</strong></h2>



# WebRTC Signaling Flow

![WebRTC Signaling Flow](webrtcsignaling.png)

> **Note:** This is just for development purposes. In production, things would get different.


# User flow :

## 1. User Creates Session

- **Endpoint:** `POST /api/recordings`  
- **Action:**  
  - Creates a Redis room  
  - Inserts a new entry in the database  
- **Returns:**  
  - `roomId`

## 2. Participants Join

- **Action:**  
  - WebSocket connection is established  
  - Participant is added to the Redis room participants set

## 3. Recording Starts

- **Action:**  
  - Browser `MediaRecorder` begins recording  
  - Creates 10-second media chunks  
- **Upload Destination:**  
  - Each chunk is uploaded to:  
    ```
    s3://zencast-recordings/{roomId}/{userId}/{chunkIndex}.webm
    ```

## 4. Session Ends

- **Endpoint:** `POST /api/uploads/complete`  
- **Action:**  
  - Triggers processing via Lambda  
  - Lambda processes all `.webm` files and generates `final.mp4`  
- **Upload Destination:**  
  - Final file is moved to:  
    ```
    s3://zencast-recordings/processed/{roomId}/final.mp4
    ```




## Folder structuring and some files :

```bash
zencast/
├── client/                   # Frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/           # Images, fonts, etc.
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Application pages
│   │   ├── services/         # API service calls
│   │   ├── store/            # Redux store
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   ├── App.tsx           # Main app component
│   │   └── index.tsx         # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── server/                   # Backend application
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Express middleware
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── utils/                # Utility functions
│   ├── app.js                # Express app setup
│   ├── package.json
│   └── server.js             # Server entry point
│
├── worker/                   # Video processing worker
│   ├── ffmpeg/               # FFmpeg scripts
│   ├── layouts/              # Video layout templates
│   ├── index.js              # Worker entry point
│   └── package.json
│
├── shared/                   # Shared code between frontend and backend
│   ├── types/                # Shared TypeScript types
│   └── utils/                # Shared utility functions
│
├── .env.example              # Environment variables template
├── .gitignore
├── package.json              # Root package.json
└── README.md                 # Project documentation
```




## Features
- Browser-based local recording with WebRTC
- Chunked uploads to S3 with resume capability
- Automatic video rendering with dynamic layouts
- Real-time communication between participants

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, Redux
- **Backend**: Node.js, Express, PostgreSQL, Redis
- **Real-time**: WebRTC, Socket.IO
- **Storage**: AWS S3
- **Video Processing**: FFmpeg, Puppeteer

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up PostgreSQL and Redis
4. Configure AWS credentials
5. Copy `.env.example` to `.env` and fill in values
6. Run migrations: `npm run migrate`
7. Start services:
   - Backend: `npm run start:server`
   - Frontend: `npm run start:client`
   - Worker: `npm run start:worker`

## Development Scripts
- `npm run dev`: Start all services in development
- `npm run build`: Build all services
- `npm run test`: Run tests
















