import LogoutButton from "./LogoutButton";
import styles from "../styles/TeacherHeader.module.scss";

export default function TeacherHeader() {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.title}>Teacher Dashboard</h1>
      <LogoutButton />
    </div>
  );
}
