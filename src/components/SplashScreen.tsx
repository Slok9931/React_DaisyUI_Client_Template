import React, { useEffect, useState } from 'react'
import { Typography, AnimatedTextChart, Progress } from '@/components'

interface SplashScreenProps {
  onComplete: () => void
  duration?: number
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 10000,
}) => {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)

  const loadingSteps = [
    "Initializing Systems...",
    "Loading Core Modules...",
    "Preparing Interface...",
    "Almost Ready..."
  ]

  useEffect(() => {
    setProgress(0)
    let animationFrame: number
    const start = Date.now()

    const animate = () => {
      const elapsed = Date.now() - start
      const percent = Math.min((elapsed / duration) * 100, 100)
      setProgress(percent)
      if (percent < 100) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    animationFrame = requestAnimationFrame(animate)

    // Show subtitle after 1 second
    setTimeout(() => setShowSubtitle(true), 1000)

    // Animation timeline
    const stepDuration = duration / loadingSteps.length
    const timeline = [
      { delay: duration - 500, action: () => setFadeOut(true) },
      { delay: duration, action: onComplete },
    ]

    const timeouts: NodeJS.Timeout[] = []

    // Step progression
    loadingSteps.forEach((_, index) => {
      timeouts.push(setTimeout(() => {
        setCurrentStep(index)
      }, index * stepDuration))
    })

    timeline.forEach(({ delay, action }) => {
      timeouts.push(setTimeout(action, delay))
    })

    return () => {
      timeouts.forEach(clearTimeout)
      cancelAnimationFrame(animationFrame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, onComplete])

  return (
    <div className={`
      fixed inset-0 z-[9999] bg-gradient-to-br from-base-100 to-base-200
      flex items-center justify-center transition-all duration-700 overflow-hidden
      ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
    `}>
      {/* Simple Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Simple Animated Lines */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-transparent via-primary/10 to-transparent h-px"
              style={{
                top: `${15 + i * 10}%`,
                left: `-50%`,
                right: `-50%`,
                transform: `rotate(${i * 22.5}deg)`,
                animation: `slide-line ${6 + i * 0.2}s infinite linear`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 text-center space-y-12 max-w-2xl mx-auto px-6">

        {/* Animated Text Logo Section */}
        <div className="relative hidden md:block">
          {/* Main Animated Text */}
          <div className="relative">
            <AnimatedTextChart
              text="Infinity"
              fontSize={160}
              duration={3000}
              strokeWidth={2}
              width="500px"
              height="400px"
              className="mx-auto"
            />
          </div>
        </div>
        <div className="relative block md:hidden">
          {/* Main Animated Text */}
          <div className="relative">
            <AnimatedTextChart
              text="Infinity"
              fontSize={100}
              duration={3000}
              strokeWidth={2}
              width="500px"
              height="400px"
              className="mx-auto"
            />
          </div>
        </div>

        {/* Subtitle */}
        <div className={`transition-all duration-1000 ${showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Typography variant="h4" className="text-xl font-light text-base-content/70 tracking-wide">
            Dashboard System
          </Typography>
        </div>

        {/* Loading Section */}
        <div className="space-y-6 max-w-md mx-auto">
          {/* Loading Status */}
          <div className="flex items-center justify-center space-x-3">
            <div className="flex space-x-1">
              {[0, 1, 2].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{
                    animationDelay: `${dot * 0.15}s`,
                    animationDuration: '1s',
                  }}
                />
              ))}
            </div>
            <Typography variant="body2" className="text-base-content/80 font-medium">
              {loadingSteps[currentStep]}
            </Typography>
          </div>

          {/* Progress Bar using Progress Component */}
          <div className="space-y-2">
            <Progress
              value={progress}
              max={100}
              variant="primary"
              className="h-2"
            />
            <div className="flex justify-between items-center">
              <Typography variant="caption" className="text-base-content/60">
                Loading...
              </Typography>
              <Typography variant="caption" className="text-base-content/60 font-mono">
                {Math.round(progress)}%
              </Typography>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className={`transition-all duration-1000 delay-500 ${showSubtitle ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-center items-center space-x-4 text-base-content/50">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Typography variant="caption" className="text-xs tracking-wide">
                SYSTEM ONLINE
              </Typography>
            </div>
            <div className="w-px h-3 bg-base-content/20"></div>
            <Typography variant="caption" className="text-xs">
              v2.0.1
            </Typography>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <Typography variant="caption" className="text-base-content/40 text-xs">
          Powered by Infinity Technologies © 2025
        </Typography>
      </div>
    </div>
  )
}