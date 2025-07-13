import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components';
import { AppRoutes } from '@/routes';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashCompleted, setSplashCompleted] = useState(false);

  // Check if splash should be shown (e.g., first visit)
  useEffect(() => {
    const hasSeenSplash = localStorage.getItem('infinity-splash-seen');
    
    // Always show splash, or only on first visit
    if (hasSeenSplash) {
      setShowSplash(false);
      setSplashCompleted(true);
    }
  }, []);

  const handleSplashComplete = () => {
    // Mark splash as seen
    localStorage.setItem('infinity-splash-seen', 'true');
    
    // Add a small delay for smooth transition
    setTimeout(() => {
      setShowSplash(false);
      setSplashCompleted(true);
    }, 100);
  };

  // Show splash screen
  if (showSplash) {
    return (
      <SplashScreen 
        onComplete={handleSplashComplete}
        duration={5000}
      />
    );
  }

  // Show main app with fade-in animation
  return (
    <div className={`
      min-h-screen transition-all duration-1000 ease-out
      ${splashCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
    `}>
      <AppRoutes />
    </div>
  );
}

export default App;