import type React from "react"

const FloatingOrbs: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-emerald-400/15 rounded-full blur-3xl animate-pulse delay-500" />
      <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-green-300/10 rounded-full blur-2xl animate-bounce" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl animate-pulse delay-700" />
    </div>
  )
}

export default FloatingOrbs
