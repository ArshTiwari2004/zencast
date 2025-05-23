"use client"

import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { Mic2, LogOut, LayoutDashboard, UserPlus, LogIn } from "lucide-react"

const Layout = () => {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

      <header className="relative z-20 border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
              <Mic2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Zencast
            </span>
          </Link>

          <nav className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-400 hover:to-purple-400 transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-gray-800/50 backdrop-blur-xl bg-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Zencast. Crafted for creators who demand excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
