import React from 'react';

interface HeroProps {
  children: React.ReactNode;
  overlay?: boolean;
  backgroundImage?: string;
  className?: string;
}

interface HeroContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  children,
  overlay = false,
  backgroundImage,
  className = '',
}) => {
  const heroClasses = [
    'hero',
    'min-h-screen',
    backgroundImage && 'hero-image',
    className
  ].filter(Boolean).join(' ');

  const style = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
  } : undefined;

  return (
    <div className={heroClasses} style={style}>
      {overlay && <div className="hero-overlay bg-opacity-60"></div>}
      {children}
    </div>
  );
};

export const HeroContent: React.FC<HeroContentProps> = ({ children, className = '' }) => (
  <div className={`hero-content text-center ${className}`}>
    {children}
  </div>
);