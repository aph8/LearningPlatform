"use client";

import { useEffect, useState } from "react";
import { studentApi } from "../../helper/api";
import Head from "next/head";
import { CourseGrades } from "../../helper/apiTypes";
import styles from "../../styles/StudentGrades.module.scss";

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<CourseGrades[]>([]);
  const [error, setError] = useState("");
  const userName =
    typeof window !== "undefined"
      ? (localStorage.getItem("username") ?? "")
      : "";

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await studentApi.getAllGradesGroupedByCourse(userName);

        const filteredData: CourseGrades[] = res.data.map(
          (course: CourseGrades) => ({
            ...course,
            assignments: course.assignments.filter(
              (a) => a.published !== false,
            ),
          }),
        );

        setGrades(filteredData);
      } catch (err) {
        console.error("Failed to fetch grades", err);
        setError("Failed to load grades");
      }
    };

    if (userName) {
      fetchGrades();
    }
  }, [userName]);

  return (
    <>
      <Head>
        <title>My Grades</title>
      </Head>
      <div className={styles.gradesPage}>
        <h1 className={styles.title}>My Grades</h1>
        {error && <p className={styles.error}>{error}</p>}
        {grades.map((course, idx) => {
          const validGrades = course.assignments.filter(
            (a) => a.grade !== null,
          ) as {
            grade: number;
          }[];

          const average =
            validGrades.length > 0
              ? validGrades.reduce((sum, a) => sum + a.grade, 0) /
                validGrades.length
              : null;

          return (
            <div key={idx} className={styles.courseCard}>
              <h2 className={styles.courseTitle}>{course.courseName}</h2>
              <ul className={styles.assignmentList}>
                {course.assignments.map((a, i) => (
                  <li key={i} className={styles.assignmentItem}>
                    <span>{a.assignmentName}</span>
                    <span className={styles.fontSemibold}>
                      {a.grade !== null ? a.grade : "Not submitted"}
                    </span>
                  </li>
                ))}
                <li className={styles.assignmentAverage}>
                  <span className={styles.fontMedium}>Average Grade:</span>
                  <span className={styles.fontMedium}>
                    {average !== null ? average.toFixed(2) : "N/A"}
                  </span>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
