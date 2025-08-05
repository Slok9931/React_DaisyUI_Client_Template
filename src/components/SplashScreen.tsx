import React, { useEffect, useState } from 'react';
import { InfinityLogo, Typography, Tooltip, useToast } from '@/components';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 3000,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const { addToast } = useToast();

  const loadingSteps = [
    "Initializing Infinity...",
    "Loading Core Systems...",
    "Preparing Dashboard...",
    "Almost Ready..."
  ];

  useEffect(() => {
    setProgress(0);
    let animationFrame: number;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(percent);
      if (percent < 100) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);

    // Animation timeline
    const stepDuration = duration / loadingSteps.length;
    const timeline = [
      { delay: duration - 500, action: () => setFadeOut(true) },
      { delay: duration, action: onComplete },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    // Step progression
    loadingSteps.forEach((_, index) => {
      timeouts.push(setTimeout(() => {
        setCurrentStep(index);
        addToast({ message: loadingSteps[index], variant: 'info' });
      }, index * stepDuration));
    });

    timeline.forEach(({ delay, action }) => {
      timeouts.push(setTimeout(action, delay));
    });

    return () => {
      timeouts.forEach(clearTimeout);
      cancelAnimationFrame(animationFrame);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, onComplete]);

  return (
    <div className={`
      fixed inset-0 z-[9999] bg-gradient-to-br from-base-100 via-base-200 to-base-100
      flex items-center justify-center transition-all duration-500 overflow-hidden
      ${fadeOut ? 'opacity-0' : 'opacity-100'}
    `}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float-2"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float-3"></div>
        
        {/* Geometric Patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="60" height="52" patternUnits="userSpaceOnUse">
              <polygon 
                points="30,4 52,16 52,36 30,48 8,36 8,16" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
                className="text-primary animate-pulse-slow"
              />
            </pattern>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle 
                cx="10" 
                cy="10" 
                r="1" 
                fill="currentColor" 
                className="text-secondary"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Animated Lines */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-transparent via-primary/20 to-transparent h-px"
              style={{
                top: `${10 + i * 7}%`,
                left: `-50%`,
                right: `-50%`,
                transform: `rotate(${i * 15}deg)`,
                animation: `slide-line ${3 + i * 0.2}s infinite linear`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
              }}
            />
          ))}
        </div>

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-3">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path 
                  d="M 40 0 L 0 0 0 40" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.5" 
                  className="text-base-content"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-12 max-w-md mx-auto px-6">
        {/* Logo Section */}
        <div className="space-y-6">
          {/* Logo with enhanced glow */}
          <div className="relative">
            {/* Multiple glow layers */}
            <div className="absolute inset-0 blur-3xl opacity-30 animate-pulse-glow">
              <InfinityLogo size={80} className="text-primary mx-auto" />
            </div>
            <div className="absolute inset-0 blur-xl opacity-20 animate-pulse-glow-2">
              <InfinityLogo size={80} className="text-secondary mx-auto" />
            </div>
            <div className="relative animate-logo-spin">
              <InfinityLogo size={80} className="text-primary mx-auto drop-shadow-2xl" />
            </div>
            
            {/* Rotating Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border border-primary/20 rounded-full animate-spin-slow"></div>
            </div>
          </div>

          {/* Brand Name with enhanced styling */}
          <div className="space-y-3">
            <Typography variant="h1" className="text-4xl md:text-5xl font-light text-base-content tracking-wider relative">
              <span className="relative z-10">Infinity</span>
              <div className="absolute inset-0 blur-sm text-primary/30 animate-text-glow">
                Infinity
              </div>
            </Typography>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto animate-gradient-x"></div>
            <Typography variant="body2" className="text-base-content/60 text-sm font-medium tracking-wide">
              DASHBOARD
            </Typography>
          </div>
        </div>

        {/* Loading Section */}
        <div className="space-y-6">
          {/* Loading Text */}
          <div className="h-6">
            <Typography variant="body2" className="text-base-content/80 font-medium animate-fade-in">
              {loadingSteps[currentStep]}
            </Typography>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="space-y-3">
            <div className="relative w-full bg-base-200/50 backdrop-blur-sm rounded-full h-2 overflow-hidden border border-base-300/30">
              <div 
                className="bg-gradient-to-r from-primary via-accent to-secondary h-2 rounded-full transition-all duration-100 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Multiple shine effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shine"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine-2"></div>
              </div>
              
              {/* Glow effect */}
              <div 
                className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-full blur-sm opacity-60"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {/* Progress Percentage */}
            <div className="flex justify-between items-center text-xs">
              <Typography variant="caption" className="text-base-content/50 font-medium">Loading</Typography>
              <Typography variant="caption" className="text-base-content/50 font-mono bg-base-200/50 backdrop-blur-sm px-2 py-1 rounded-full">
                {Math.round(progress)}%
              </Typography>
            </div>
          </div>
        </div>

        {/* Enhanced Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((dot) => (
            <Tooltip key={dot} tip={`Loading step ${dot + 1}`}>
              <div className="relative cursor-pointer">
                <div
                  className="w-3 h-3 bg-primary/60 rounded-full animate-bounce-enhanced shadow-lg"
                  style={{
                    animationDelay: `${dot * 0.2}s`,
                    animationDuration: '1.4s',
                  }}
                />
                <div
                  className="absolute inset-0 w-3 h-3 bg-primary/30 rounded-full blur-sm animate-bounce-enhanced"
                  style={{
                    animationDelay: `${dot * 0.2}s`,
                    animationDuration: '1.4s',
                  }}
                />
              </div>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <div className="backdrop-blur-sm bg-base-100/30 mx-auto max-w-fit px-4 py-2 rounded-full border border-base-300/20">
          <Typography variant="caption" className="text-base-content/40 font-medium tracking-wide">
            Powered by Infinity Technologies
          </Typography>
        </div>
      </div>
    </div>
  );
};