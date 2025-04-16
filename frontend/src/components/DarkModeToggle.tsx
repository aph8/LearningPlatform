"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import styles from "../styles/DarkModeToggle.module.scss";

const DarkModeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={styles.toggleButton}
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? "🌙" : "☀️"}
    </button>
  );
};

export default DarkModeToggle;
