import { Link } from "react-router-dom"
import GradientBackground from "../components/gradient-background"
import FloatingOrbs from "../components/floating-orbs"
import ComparisonSection from "../components/comparision-section"
import { Play, Mic, Video, Upload, Zap, Shield } from "lucide-react"

const Home = () => {
  return (
    <GradientBackground variant="primary" className="min-h-screen">
      <FloatingOrbs />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-300 text-sm font-medium mb-6">
              The future of podcast recording is here
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            Record Podcasts with{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Confidence
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Zencast provides studio-quality remote recordings with automatic editing and cloud backup. No more
            post-production nightmares.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/signup"
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
            >
              <span className="relative z-10 flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Start Recording Free
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            </Link>

            <Link
              to="/login"
              className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-gray-500 hover:text-white transition-all duration-300 hover:bg-gray-800/50"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for creators who demand more</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every feature designed to eliminate the friction between your ideas and your audience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Video className="w-8 h-8" />,
                title: "Auto-Rendered Videos",
                description: "Your podcast video is ready the moment you finish recording. No editing required.",
              },
              {
                icon: <Upload className="w-8 h-8" />,
                title: "Bulletproof Uploads",
                description:
                  "Chunked uploads with resume capability. Your content is safe even if your internet isn't.",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Dynamic Layouts",
                description: "Layouts adapt in real-time as participants join, leave, or share screens.",
              },
              {
                icon: <Mic className="w-8 h-8" />,
                title: "Studio Quality",
                description: "Local recording ensures pristine audio quality regardless of connection issues.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Never Lose Content",
                description: "Offline resume means your recordings continue uploading even after browser crashes.",
              },
              {
                icon: <Play className="w-8 h-8" />,
                title: "One-Click Publishing",
                description: "From recording to published podcast in minutes, not hours.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl hover:border-cyan-500/30 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-cyan-400 mb-4 group-hover:text-cyan-300 transition-colors">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <ComparisonSection />

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to revolutionize your podcast?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join creators who've already discovered the future of podcast recording
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Your First Recording
            </Link>
          </div>
        </div>
      </section>
    </GradientBackground>
  )
}

export default Home