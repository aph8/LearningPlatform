import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.scss";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>My Learning Platform</title>
        <meta
          name="description"
          content="A modern, dark-themed learning platform"
        />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Welcome to My Learning Platform</h1>
          <p className={styles.paragraph}>
            Discover courses, manage assignments, and track your progress.
          </p>

          <div className={styles.buttonGroup}>
            <Link
              href="/auth/login"
              className={`${styles.button} ${styles.login}`}
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className={`${styles.button} ${styles.signup}`}
            >
              Signup
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
