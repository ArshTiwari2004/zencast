import type React from "react"

interface GradientBackgroundProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "tertiary"
  className?: string
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, variant = "primary", className = "" }) => {
  const gradients = {
    primary: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    secondary: "bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800",
    tertiary: "bg-gradient-to-br from-cyan-900/20 via-slate-900 to-purple-900/20",
  }

  return (
    <div className={`${gradients[variant]} ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default GradientBackground