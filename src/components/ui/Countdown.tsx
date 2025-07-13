import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
  onComplete?: () => void;
  className?: string;
  showLabels?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  onComplete,
  className = '',
  showLabels = true,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onComplete?.();
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial calculation

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return (
    <div className={`grid grid-flow-col gap-5 text-center auto-cols-max ${className}`}>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': timeLeft.days } as React.CSSProperties}></span>
        </span>
        {showLabels && <span className="text-sm">days</span>}
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': timeLeft.hours } as React.CSSProperties}></span>
        </span>
        {showLabels && <span className="text-sm">hours</span>}
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': timeLeft.minutes } as React.CSSProperties}></span>
        </span>
        {showLabels && <span className="text-sm">min</span>}
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ '--value': timeLeft.seconds } as React.CSSProperties}></span>
        </span>
        {showLabels && <span className="text-sm">sec</span>}
      </div>
    </div>
  );
};