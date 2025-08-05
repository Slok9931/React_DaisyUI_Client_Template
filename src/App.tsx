import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components';
import { AppRoutes } from '@/routes';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashCompleted, setSplashCompleted] = useState(false);

  useEffect(() => {
    const hasSeenSplash = localStorage.getItem('infinity-splash-seen');
    
    if (hasSeenSplash) {
      setShowSplash(false);
      setSplashCompleted(true);
    }
  }, []);

  const handleSplashComplete = () => {
    localStorage.setItem('infinity-splash-seen', 'true');
    
    setTimeout(() => {
      setShowSplash(false);
      setSplashCompleted(true);
    }, 100);
  };

  if (showSplash) {
    return (
      <SplashScreen 
        onComplete={handleSplashComplete}
        duration={3000}
      />
    );
  }

  return (
    <div className={`
      transition-all duration-1000 ease-out
      ${splashCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
    `}>
      <AppRoutes />
    </div>
  );
}

export default App;