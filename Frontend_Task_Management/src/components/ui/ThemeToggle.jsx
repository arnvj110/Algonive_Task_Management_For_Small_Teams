import React from 'react';

import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-gray-300 dark:border-gray-300 bg-white dark:bg-gray-800 text-yellow-500 dark:text-gray-200 shadow-xl transition duration-300 cursor-pointer hover:scale-110"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
