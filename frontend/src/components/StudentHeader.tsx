import LogoutButton from "./LogoutButton";
import styles from "../styles/StudentHeader.module.scss";

export default function StudentHeader() {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.title}>Student Dashboard</h1>
      <LogoutButton />
    </div>
  );
}
