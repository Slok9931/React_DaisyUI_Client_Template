import React from 'react';

interface Stat {
  title: string;
  value: string | number;
  description?: string;
  figure?: React.ReactNode;
}

interface StatsProps {
  stats: Stat[];
  vertical?: boolean;
  className?: string;
}

export const Stats: React.FC<StatsProps> = ({
  stats,
  vertical = false,
  className = '',
}) => {
  const statsClasses = [
    'stats',
    'shadow',
    vertical && 'stats-vertical',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={statsClasses}>
      {stats.map((stat, index) => (
        <div key={index} className="stat">
          {stat.figure && <div className="stat-figure">{stat.figure}</div>}
          <div className="stat-title">{stat.title}</div>
          <div className="stat-value">{stat.value}</div>
          {stat.description && <div className="stat-desc">{stat.description}</div>}
        </div>
      ))}
    </div>
  );
};