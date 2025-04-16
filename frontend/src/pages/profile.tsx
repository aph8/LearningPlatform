"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { userApi } from "../helper/api";
import useAuthRedirect from "../hooks/useAuthRedirect";
import { User } from "../helper/apiTypes";
import styles from "../styles/Profile.module.scss";

export default function ProfilePage() {
  useAuthRedirect();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  const username =
    typeof window !== "undefined"
      ? (localStorage.getItem("username") ?? "")
      : "";

  useEffect(() => {
    if (!username) {
      router.push("/auth/login");
      return;
    }

    async function fetchUser() {
      try {
        const res = await userApi.getUserInfo(username);
        setUser(res.data);
        setFormData(res.data);
      } catch {
        setError("User not found");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [username, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => prev && { ...prev, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;
    try {
      const res = await userApi.updateUser(username, formData);
      setUser(res.data);
      setEditMode(false);
    } catch {
      setError("Failed to update profile.");
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>My Profile - My Learning Platform</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>My Profile</h1>
        {error && <p className={styles.error}>{error}</p>}
        {user && (
          <>
            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Name:
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData?.name || ""}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email:
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData?.email || ""}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="recoveryEmail" className={styles.label}>
                    Recovery Email:
                  </label>
                  <input
                    id="recoveryEmail"
                    name="recoveryEmail"
                    type="email"
                    value={formData?.recoveryEmail || ""}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <button
                  type="submit"
                  className={`${styles.button} ${styles.saveButton}`}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className={`${styles.button} ${styles.cancelButton}`}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className={styles.profileInfo}>
                <p>
                  <strong>Username:</strong> {user.userName}
                </p>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Recovery Email:</strong>{" "}
                  {user.recoveryEmail ?? "Not set"}
                </p>
                <button
                  onClick={() => setEditMode(true)}
                  className={styles.editButton}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
