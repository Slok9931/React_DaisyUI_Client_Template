import React from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  placeholder?: string;
  online?: boolean;
  offline?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  placeholder,
  online = false,
  offline = false,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const avatarClasses = [
    'avatar',
    (online || offline) && 'avatar-indicator',
    className
  ].filter(Boolean).join(' ');

  const imageClasses = [
    'rounded-full',
    sizeClasses[size]
  ].join(' ');

  return (
    <div className={avatarClasses}>
      <div className={imageClasses}>
        {src ? (
          <img src={src} alt={alt} />
        ) : (
          <div className="bg-neutral text-neutral-content rounded-full flex items-center justify-center">
            <span className="text-sm">{placeholder || alt.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>
      {online && <span className="badge badge-xs badge-success indicator-item"></span>}
      {offline && <span className="badge badge-xs badge-error indicator-item"></span>}
    </div>
  );
};