# zencast

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












