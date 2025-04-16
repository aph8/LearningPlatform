"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { courseApi, assignmentApi } from "../../helper/api";
import TeacherHeader from "../../components/TeacherHeader";
import DashboardLinks from "../../components/DashboardLinks";
import CourseCard from "../../components/CourseCard";
import { Student, Assignment, Course } from "../../helper/apiTypes";
import styles from "../../styles/TeacherDashboard.module.scss";

export default function TeacherDashboard() {
  useAuthRedirect();

  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Record<number, Assignment[]>>(
    {},
  );
  const [canUnpublishMap, setCanUnpublishMap] = useState<
    Record<number, boolean>
  >({});
  const [canDeleteMap, setCanDeleteMap] = useState<Record<number, boolean>>({});
  const [visibleStudents, setVisibleStudents] = useState<
    Record<number, Student[]>
  >({});
  const [loadingStudents, setLoadingStudents] = useState<
    Record<number, boolean>
  >({});
  const [error, setError] = useState("");

  const userName =
    typeof window !== "undefined"
      ? (localStorage.getItem("username") ?? "")
      : "";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseApi.getCoursesByUser(userName);
        setCourses(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your courses");
      }
    };

    if (userName) fetchCourses();
  }, [userName]);

  useEffect(() => {
    const fetchAssignments = async () => {
      const all: Record<number, Assignment[]> = {};
      const unpublishMap: Record<number, boolean> = {};
      const deleteMap: Record<number, boolean> = {};

      for (const course of courses) {
        try {
          const res = await courseApi.getAllAssignmentsByCourseId(
            course.courseId,
          );
          all[course.courseId] = res.data;

          for (const a of res.data) {
            if (a.published) {
              try {
                const res = await assignmentApi.getCanUnpublish(a.assignmentId);
                unpublishMap[a.assignmentId] = res.data.canUnpublish;
              } catch {
                unpublishMap[a.assignmentId] = false;
              }
            }

            try {
              const res = await assignmentApi.getCanDelete(a.assignmentId);
              deleteMap[a.assignmentId] = res.data.canDelete;
            } catch {
              deleteMap[a.assignmentId] = false;
            }
          }
        } catch (err) {
          console.error(
            `Failed to load assignments for course ${course.courseId}:`,
            err,
          );
        }
      }

      setAssignments(all);
      setCanUnpublishMap(unpublishMap);
      setCanDeleteMap(deleteMap);
    };

    if (courses.length > 0) fetchAssignments();
  }, [courses]);

  const refreshAssignments = async () => {
    const updatedAssignments: Record<number, Assignment[]> = {};
    const updatedUnpublishMap: Record<number, boolean> = {};
    const updatedDeleteMap: Record<number, boolean> = {};

    for (const course of courses) {
      const res = await courseApi.getAllAssignmentsByCourseId(course.courseId);
      updatedAssignments[course.courseId] = res.data;

      for (const a of res.data) {
        if (a.published) {
          try {
            const resp = await assignmentApi.getCanUnpublish(a.assignmentId);
            updatedUnpublishMap[a.assignmentId] = resp.data.canUnpublish;
          } catch {
            updatedUnpublishMap[a.assignmentId] = false;
          }
        }
        try {
          const delResp = await assignmentApi.getCanDelete(a.assignmentId);
          updatedDeleteMap[a.assignmentId] = delResp.data.canDelete;
        } catch {
          updatedDeleteMap[a.assignmentId] = false;
        }
      }
    }

    setAssignments(updatedAssignments);
    setCanUnpublishMap(updatedUnpublishMap);
    setCanDeleteMap(updatedDeleteMap);
  };

  const togglePublish = async (assignmentId: number, publish: boolean) => {
    try {
      await assignmentApi.editAssignment(assignmentId.toString(), {
        published: publish,
      });
      refreshAssignments();
    } catch (err) {
      console.error("Failed to update publish status:", err);
      alert("Failed to update publish status.");
    }
  };

  const deleteAssignment = async (assignmentId: number) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await assignmentApi.deleteAssignment(assignmentId.toString());
      refreshAssignments();
    } catch (err) {
      console.error("Failed to delete assignment:", err);
      alert(
        "Failed to delete assignment. It may already have student submissions.",
      );
    }
  };

  const deleteCourse = async (courseId: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await courseApi.deleteCourse(courseId);
      setCourses((prev) =>
        prev.filter((course) => course.courseId !== courseId),
      );
      setAssignments((prev) => {
        const newState = { ...prev };
        delete newState[courseId];
        return newState;
      });
    } catch (err) {
      console.error("Failed to delete course:", err);
      alert(
        "Failed to delete course. It might have enrolled students or assignments.",
      );
    }
  };

  const toggleViewStudents = async (courseId: number) => {
    if (visibleStudents[courseId]) {
      setVisibleStudents((prev) => {
        const newState = { ...prev };
        delete newState[courseId];
        return newState;
      });
    } else {
      try {
        setLoadingStudents((prev) => ({ ...prev, [courseId]: true }));
        const res = await courseApi.getAllStudentsByCourseId(
          courseId.toString(),
        );
        setVisibleStudents((prev) => ({ ...prev, [courseId]: res.data }));
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoadingStudents((prev) => ({ ...prev, [courseId]: false }));
      }
    }
  };

  return (
    <>
      <Head>
        <title>Teacher Dashboard - My Learning Platform</title>
      </Head>
      <div className={styles.dashboardContainer}>
        <TeacherHeader />
        <p className={styles.welcomeText}>
          Welcome, Instructor! Manage your courses, assignments, and your
          profile from here.
        </p>
        <DashboardLinks />
        <h2 className={styles.header}>Your Courses & Assignments</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {courses.length === 0 ? (
          <p className={styles.mutedText}>No courses created yet.</p>
        ) : (
          <div className={styles.coursesContainer}>
            {courses.map((course) => (
              <CourseCard
                key={course.courseId}
                course={course}
                assignments={assignments[course.courseId] || []}
                canUnpublishMap={canUnpublishMap}
                canDeleteMap={canDeleteMap}
                visibleStudents={visibleStudents[course.courseId]}
                isLoadingStudents={loadingStudents[course.courseId]}
                onToggleStudents={() => toggleViewStudents(course.courseId)}
                onTogglePublish={togglePublish}
                onDelete={deleteAssignment}
                onDeleteCourse={() => deleteCourse(course.courseId)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
