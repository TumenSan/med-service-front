import React from 'react';
import DarkModeToggle from './DarkModeToggle';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm dark:bg-gray-800 dark:text-white sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Лого */}
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 className="text-xl font-bold">AI Eval</h1>
        </div>

        {/* Правая часть: тема + пользователь */}
        <div className="flex items-center space-x-6">
          {/* Переключатель темы */}
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* Пользователь */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span className="hidden md:inline-block text-sm font-medium">Alex</span>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                A
              </div>
            </button>

            {/* Dropdown menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 dark:bg-gray-700 border dark:border-gray-600">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      Профиль
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      Настройки
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      Выйти
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;