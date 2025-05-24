"use client"

import type React from "react"

import { Link } from "react-router-dom"
import { AuroraBackground } from "../components/ui/aurora-background"
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid"
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards"
import { TextGenerateEffect } from "../components/ui/text-generate-effect"
import { Spotlight } from "../components/ui/spotlight"
import ComparisonSection from "@/components/comparision-section"
import { Play, Mic, Video, Upload, Users, Globe, Headphones } from "lucide-react"
import { motion } from "framer-motion"

const Home = () => {
  const features = [
    {
      title: "Auto-Rendered Videos",
      description:
        "Your podcast video is ready the moment you finish recording. Dynamic layouts adapt as participants join, leave, or share screens.",
      header: <FeatureHeader icon={<Video className="w-8 h-8 text-emerald-400" />} />,
      className: "md:col-span-2",
      icon: <Video className="h-4 w-4 text-emerald-400" />,
    },
    {
      title: "Bulletproof Uploads",
      description:
        "Chunked uploads with resume capability. Your content is safe even if your internet crashes mid-session.",
      header: <FeatureHeader icon={<Upload className="w-8 h-8 text-emerald-400" />} />,
      className: "md:col-span-1",
      icon: <Upload className="h-4 w-4 text-emerald-400" />,
    },
    {
      title: "Studio Quality Recording",
      description:
        "Local recording ensures pristine audio quality regardless of connection issues. Each participant records locally in high quality.",
      header: <FeatureHeader icon={<Mic className="w-8 h-8 text-emerald-400" />} />,
      className: "md:col-span-1",
      icon: <Mic className="h-4 w-4 text-emerald-400" />,
    },
    {
      title: "Real-time Collaboration",
      description:
        "WebRTC-powered communication with automatic layout switching. See everyone while recording individually.",
      header: <FeatureHeader icon={<Users className="w-8 h-8 text-emerald-400" />} />,
      className: "md:col-span-2",
      icon: <Users className="h-4 w-4 text-emerald-400" />,
    },
  ]

  const testimonials = [
    {
      quote:
        "Zencast eliminated our entire post-production workflow. We record, and 10 minutes later we have a fully edited video ready to publish.",
      name: "Sarah Chen",
      title: "Host of Tech Talks Weekly",
    },
    {
      quote:
        "The automatic layout switching is incredible. When someone shares their screen, the video adapts instantly. It's like having a professional video editor in real-time.",
      name: "Marcus Rodriguez",
      title: "The Startup Show",
    },
    {
      quote:
        "We've had guests with terrible internet, but their audio quality was still perfect thanks to local recording. Game changer.",
      name: "Emily Watson",
      title: "Creative Minds Podcast",
    },
    {
      quote:
        "The chunked upload feature saved us when our internet died mid-recording. Everything resumed perfectly when we came back online.",
      name: "David Kim",
      title: "Business Insights Daily",
    },
    {
      quote:
        "From recording to published video in under 15 minutes. Our audience loves the professional quality we can now deliver consistently.",
      name: "Lisa Thompson",
      title: "Health & Wellness Today",
    },
  ]

  const usageSteps = [
    {
      step: "1",
      title: "Create Room",
      description: "Start a new recording session and invite guests via unique link",
      icon: <Globe className="w-6 h-6" />,
    },
    {
      step: "2",
      title: "Join & Connect",
      description: "Participants join using WebRTC for real-time communication",
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: "3",
      title: "Record Locally",
      description: "Each browser records high-quality audio/video locally",
      icon: <Headphones className="w-6 h-6" />,
    },
    {
      step: "4",
      title: "Auto Upload",
      description: "Chunks upload to cloud in real-time with retry mechanism",
      icon: <Upload className="w-6 h-6" />,
    },
    {
      step: "5",
      title: "Get Final Video",
      description: "Auto-rendered podcast video with dynamic layouts ready instantly",
      icon: <Play className="w-6 h-6" />,
    },
  ]

  return (
    <div className="relative">
      <AuroraBackground>
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(16, 185, 129, 0.3)" />

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-20"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-sm font-medium mb-6 animate-pulse">
                The future of podcast recording is here
              </span>
            </motion.div>

            <TextGenerateEffect
              words="Record Podcasts with Confidence"
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Zencast provides studio-quality remote recordings with automatic editing and cloud backup. No more
              post-production nightmares.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                to="/signup"
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
              >
                <span className="relative z-10 flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  Start Recording Free
                </span>
              </Link>

              <Link
                to="/login"
                className="px-8 py-4 border border-gray-700 text-gray-300 font-semibold rounded-xl hover:border-emerald-500 hover:text-emerald-400 transition-all duration-300 hover:bg-emerald-500/10"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AuroraBackground>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-black relative">
        <Spotlight className="top-0 right-0" fill="rgba(16, 185, 129, 0.2)" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How Zencast Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From invitation to published podcast in 5 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            {usageSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto -mt-2 text-emerald-400">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for creators who demand more</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every feature designed to eliminate the friction between your ideas and your audience
            </p>
          </motion.div>

          <BentoGrid className="max-w-4xl mx-auto">
            {features.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={item.className}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Loved by creators worldwide</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See what podcasters are saying about their Zencast experience
          </p>
        </motion.div>

        <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
      </section>

      {/* Comparison Section */}
      <ComparisonSection />

      {/* CTA Section */}
      <section className="py-24 px-4 bg-black relative">
        <Spotlight className="bottom-0 left-0" fill="rgba(16, 185, 129, 0.2)" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 rounded-3xl p-12 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-500"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to revolutionize your podcast?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join creators who've already discovered the future of podcast recording
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Your First Recording
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

const FeatureHeader = ({ icon }: { icon: React.ReactNode }) => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 flex-col items-center justify-center">
      <div className="text-emerald-400 mb-2">{icon}</div>
    </div>
  )
}

export default Home
