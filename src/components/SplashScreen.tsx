import React, { useEffect, useState } from 'react';
import { InfinityLogo } from './InfinityLogo';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 5000,
}) => {
  const [progress, setProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Animation timeline
    const timeline = [
      { delay: 0, action: () => setTextVisible(true) },
      { delay: 1000, action: () => setLogoAnimated(true) },
      { delay: duration - 500, action: () => setFadeOut(true) },
      { delay: duration, action: onComplete },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    timeline.forEach(({ delay, action }) => {
      timeouts.push(setTimeout(action, delay));
    });

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (duration / 50));
      });
    }, 50);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, [duration, onComplete]);

  return (
    <div className={`
      fixed inset-0 z-[9999] bg-gradient-to-br from-primary via-secondary to-accent
      flex items-center justify-center transition-all duration-500
      ${fadeOut ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}
    `}>
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-12 h-12 bg-white/10 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-white/10 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-32 right-32 w-8 h-8 bg-white/10 rounded-full animate-pulse animation-delay-3000"></div>
        
        {/* Floating infinity symbols */}
        <div className="absolute top-1/4 left-1/4 opacity-20 animate-float">
          <InfinityLogo size={30} />
        </div>
        <div className="absolute top-3/4 right-1/4 opacity-20 animate-float-reverse">
          <InfinityLogo size={20} />
        </div>
        <div className="absolute top-1/2 left-1/6 opacity-20 animate-float-slow">
          <InfinityLogo size={25} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Infinity Logo */}
        <div className={`
          transform transition-all duration-1000 ease-out
          ${logoAnimated ? 'scale-100 rotate-0' : 'scale-50 rotate-180'}
        `}>
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 blur-xl opacity-50">
              <InfinityLogo size={120} className="text-white" />
            </div>
            {/* Main logo */}
            <InfinityLogo size={120} className="relative z-10" />
          </div>
        </div>

        {/* Text Animation */}
        <div className="space-y-4">
          <h1 className={`
            text-6xl md:text-8xl font-bold text-white
            transform transition-all duration-1000 ease-out
            ${textVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
          `}>
            <span className="inline-block animate-text-wave">I</span>
            <span className="inline-block animate-text-wave animation-delay-100">n</span>
            <span className="inline-block animate-text-wave animation-delay-200">f</span>
            <span className="inline-block animate-text-wave animation-delay-300">i</span>
            <span className="inline-block animate-text-wave animation-delay-400">n</span>
            <span className="inline-block animate-text-wave animation-delay-500">i</span>
            <span className="inline-block animate-text-wave animation-delay-600">t</span>
            <span className="inline-block animate-text-wave animation-delay-700">y</span>
          </h1>
          
          <p className={`
            text-xl md:text-2xl text-white/80 font-light
            transform transition-all duration-1000 ease-out delay-500
            ${textVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            Endless Possibilities Await
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto">
          <div className="relative">
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="absolute -top-1 left-0 w-full h-4 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm"></div>
          </div>
          <p className="text-white/60 text-sm mt-2 font-medium">
            {Math.round(progress)}%
          </p>
        </div>
      </div>

      {/* Particle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};