"use client";

import { ReactNode } from "react";
import DarkModeToggle from "./DarkModeToggle";
import styles from "../styles/Layout.module.scss";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      {children}
      <DarkModeToggle />
    </div>
  );
};

export default Layout;
