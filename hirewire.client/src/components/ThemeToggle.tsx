import React from 'react';
import useTheme from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="px-2 py-1 rounded-md border bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
