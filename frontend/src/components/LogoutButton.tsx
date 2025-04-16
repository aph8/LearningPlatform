"use client";

import { useRouter } from "next/navigation";
import styles from "../styles/LogoutButton.module.scss";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("username");
    router.push("/auth/login");
  };

  return (
    <button onClick={handleLogout} className={styles.logoutButton}>
      Logout
    </button>
  );
}
