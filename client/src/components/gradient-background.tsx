import type React from "react"

interface GradientBackgroundProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "tertiary"
  className?: string
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, variant = "primary", className = "" }) => {
  const gradients = {
    primary: "bg-gradient-to-br from-black via-emerald-950/30 to-black",
    secondary: "bg-gradient-to-r from-black via-gray-900/50 to-black",
    tertiary: "bg-gradient-to-br from-emerald-900/10 via-black to-gray-900/20",
  }

  return (
    <div className={`${gradients[variant]} ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default GradientBackground
