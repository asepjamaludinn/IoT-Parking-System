"use client";

import { useState, useEffect } from "react";
import { FaMoon, FaSun, FaParking } from "react-icons/fa";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 w-full z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <FaParking className="text-3xl text-blue-600 dark:text-blue-400" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
              SmartPark
            </h1>
          </div>

          {/* Tombol Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
          >
            {darkMode ? (
              <FaSun className="text-yellow-400 transition-transform duration-300 scale-110" />
            ) : (
              <FaMoon className="transition-transform duration-300 scale-110" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
