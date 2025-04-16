import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { courseApi } from "../../helper/api";
import styles from "../../styles/CreateCourse.module.scss";

export default function CreateCoursePage() {
  const router = useRouter();
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("username");
    if (!isAuthenticated) router.push("/auth/login");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const instructor = localStorage.getItem("username");
    if (!instructor) {
      setError("You must be logged in to create a course.");
      return;
    }

    try {
      await courseApi.createCourse({
        courseName,
        description,
        instructor,
      });
      router.push("/dashboard/teacher");
    } catch (err) {
      console.error(err);
      setError("Failed to create course.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create a Course</h1>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="courseName" className={styles.label}>
            Course Name
          </label>
          <input
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
          />
        </div>

        <button type="submit" className={styles.button}>
          Create Course
        </button>
      </form>
    </div>
  );
}
