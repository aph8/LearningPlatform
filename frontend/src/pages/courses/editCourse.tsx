import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { courseApi } from "../../helper/api";
import styles from "../../styles/EditCourse.module.scss";
import { CourseRequest } from "../../helper/apiTypes";

export default function EditCourse() {
  const router = useRouter();
  const { courseId } = router.query;

  const userName =
    typeof window !== "undefined"
      ? (localStorage.getItem("username") ?? "")
      : "";

  const [course, setCourse] = useState<CourseRequest>({
    courseName: "",
    description: "",
    instructor: userName,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId || typeof courseId !== "string") return;

    const fetchCourse = async () => {
      try {
        const res = await courseApi.getCourseById(courseId);
        setCourse({
          courseName: res.data.courseName,
          description: res.data.description ?? "",
          instructor: userName,
        });
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course");
      }
    };

    fetchCourse();
  }, [courseId, userName]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId || typeof courseId !== "string") {
      setError("Invalid course ID");
      return;
    }

    try {
      await courseApi.updateCourseDetails(courseId, course);
      router.push("/dashboard/teacher");
    } catch (err) {
      console.error("Error updating course:", err);
      setError("Failed to update course");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Course</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="courseName"
          value={course.courseName}
          onChange={handleChange}
          placeholder="Course Name"
          className={styles.input}
        />
        <textarea
          name="description"
          value={course.description}
          onChange={handleChange}
          placeholder="Course Description"
          className={styles.textarea}
        />
        <button type="submit" className={styles.button}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
