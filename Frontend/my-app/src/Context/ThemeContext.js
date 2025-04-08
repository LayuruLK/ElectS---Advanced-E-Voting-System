import React, { createContext, useState, useContext } from 'react';

// Create the ThemeContext
const ThemeContext = createContext();

// Create a custom provider
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // Default to 'light' theme

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Provide the theme and toggleTheme function
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for consuming the ThemeContext
export const useTheme = () => useContext(ThemeContext);
