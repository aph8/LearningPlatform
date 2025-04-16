"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { courseApi, submissionApi } from "../../helper/api";
import StudentHeader from "../../components/StudentHeader";
import CourseCardStudent from "../../components/CourseCardStudent";
import Link from "next/link";
import { Assignment, Course } from "../../helper/apiTypes";
import styles from "../../styles/StudentDashboard.module.scss";

export default function StudentDashboard() {
  useAuthRedirect();

  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Record<number, Assignment[]>>(
    {},
  );
  const [completedAssignments, setCompletedAssignments] = useState<Set<number>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);

  const userName =
    typeof window !== "undefined"
      ? (localStorage.getItem("username") ?? "")
      : "";

  useEffect(() => {
    if (!userName) return;

    const fetchData = async () => {
      try {
        const res = await courseApi.getCoursesByUser(userName);
        const fetchedCourses: Course[] = res.data;
        setCourses(fetchedCourses);

        const assignmentsMap: Record<number, Assignment[]> = {};
        const completedSet = new Set<number>();

        for (const course of fetchedCourses) {
          const res = await courseApi.getAllAssignmentsByCourseId(
            String(course.courseId),
          );
          const publishedAssignments = res.data.filter(
            (a: Assignment) => a.published,
          );
          assignmentsMap[course.courseId] = publishedAssignments;

          for (const assignment of publishedAssignments) {
            const statusRes = await submissionApi.hasBeenSubmitted(
              assignment.assignmentId.toString(),
              userName,
            );
            if (statusRes.data.submitted) {
              completedSet.add(assignment.assignmentId);
            }
          }
        }

        setAssignments(assignmentsMap);
        setCompletedAssignments(completedSet);
      } catch (err) {
        console.error("Failed to fetch courses or assignments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userName]);

  return (
    <>
      <Head>
        <title>Student Dashboard - My Learning Platform</title>
      </Head>
      <div className={styles.dashboardContainer}>
        <StudentHeader />

        <p className={styles.welcomeText}>
          Welcome! Here you can explore your enrolled courses and assignments.
        </p>

        <h2 className={styles.courseHeader}>My Courses</h2>

        {loading ? (
          <p className={styles.message}>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className={styles.message}>
            You&apos;re not enrolled in any courses yet.
          </p>
        ) : (
          <ul className={styles.courseList}>
            {courses.map((course) => (
              <CourseCardStudent
                key={course.courseId}
                course={course}
                assignments={assignments[course.courseId] || []}
                completedAssignments={completedAssignments}
              />
            ))}
          </ul>
        )}

        <div className={styles.gridContainer}>
          <Link href="/dashboard/grades" className={styles.linkCard}>
            Check Grades
          </Link>
          <Link href="/profile" className={styles.linkCard}>
            My Profile
          </Link>
        </div>
      </div>
    </>
  );
}
