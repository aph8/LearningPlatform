"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { courseApi } from "../../helper/api";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import AssignmentItem from "../../components/AssignmentItem";
import styles from "../../styles/SubmitAssignments.module.scss";
import { Assignment } from "../../helper/apiTypes";

export default function SubmitAssignmentsPage() {
  useAuthRedirect();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userName =
    typeof window !== "undefined"
      ? (localStorage.getItem("username") ?? "")
      : "";

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const courseRes = await courseApi.getCoursesByUser(userName);
        const allAssignments: Assignment[] = [];

        for (const course of courseRes.data) {
          const res = await courseApi.getAllAssignmentsByCourseId(
            course.courseId,
          );
          const publishedAssignments: Assignment[] = res.data.filter(
            (a: Assignment) => a.published,
          );
          allAssignments.push(...publishedAssignments);
        }

        setAssignments(allAssignments);
      } catch (err) {
        console.error(err);
        setError("Failed to load assignments.");
      } finally {
        setLoading(false);
      }
    };

    if (userName) fetchAssignments();
  }, [userName]);

  return (
    <>
      <Head>
        <title>Submit Assignments - Student Dashboard</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>Submit Assignments</h1>
        {loading ? (
          <p className={styles.loading}>Loading assignments...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : assignments.length === 0 ? (
          <p className={styles.noAssignments}>
            No published assignments available.
          </p>
        ) : (
          <ul className={styles.assignmentList}>
            {assignments.map((assignment) => (
              <li
                key={assignment.assignmentId}
                className={styles.assignmentItem}
              >
                <AssignmentItem
                  assignment={assignment}
                  canUnpublish={false}
                  canDelete={false}
                  onTogglePublish={() => {}}
                  onDelete={() => {}}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
