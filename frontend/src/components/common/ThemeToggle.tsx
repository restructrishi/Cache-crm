import React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-full p-1 border border-gray-200 dark:border-zinc-700">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-full transition-all duration-200 relative ${
          theme === "light" ? "text-amber-500 bg-white shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        }`}
        title="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-full transition-all duration-200 ${
          theme === "system" ? "text-blue-500 bg-white dark:bg-zinc-700 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        }`}
        title="System Preference"
      >
        <Laptop className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-full transition-all duration-200 ${
          theme === "dark" ? "text-indigo-400 bg-zinc-700 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        }`}
        title="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
