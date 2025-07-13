import React from 'react';
import { useTheme } from '@/hooks';
import { Typography } from '@/components';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, themes, changeTheme } = useTheme();

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-outline">
        <Typography variant="body2" className="mr-2">
          Theme:
        </Typography>
        <Typography variant="body2" className="capitalize font-bold">
          {currentTheme.displayName}
        </Typography>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-96 overflow-auto">
        {themes.map((theme) => (
          <li key={theme.name}>
            <a 
              onClick={() => changeTheme(theme.name)} 
              className={`${currentTheme.name === theme.name ? 'active bg-primary text-primary-content' : ''}`}
            >
              <Typography variant="body2">{theme.displayName}</Typography>
              {theme.isDark && <span className="badge badge-sm">Dark</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};