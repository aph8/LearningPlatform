"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { submissionApi, assignmentApi } from "../../../helper/api";
import GradeChart from "../../../components/GradeChart";
import GradesTable from "../../../components/GradesTable";
import styles from "../../../styles/AssignmentGrades.module.scss";
import { StudentGrade } from "../../../helper/apiTypes";

export default function AssignmentGradesPage() {
  const router = useRouter();
  const { assignmentId } = router.query;

  const [assignmentTitle, setAssignmentTitle] = useState<string>("");
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!assignmentId || typeof assignmentId !== "string") return;

    const fetchAssignment = async () => {
      try {
        const res = await assignmentApi.getAssignmentById(assignmentId);
        setAssignmentTitle(res.data.assignmentName || "");
      } catch (err) {
        console.error("Error fetching assignment:", err);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  useEffect(() => {
    if (!assignmentId || typeof assignmentId !== "string") return;

    const fetchGrades = async () => {
      try {
        const res = await submissionApi.allGrades(assignmentId);
        const sorted: StudentGrade[] = [...res.data].sort((a, b) => {
          const aGrade =
            typeof a.assignmentGrade === "number" ? a.assignmentGrade : -1;
          const bGrade =
            typeof b.assignmentGrade === "number" ? b.assignmentGrade : -1;
          return bGrade - aGrade;
        });
        setGrades(sorted);
      } catch (err) {
        console.error("Error fetching grades:", err);
        setError("Unable to load grades.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [assignmentId]);

  useEffect(() => {
    if (!assignmentId || typeof assignmentId !== "string") return;

    const fetchAverage = async () => {
      try {
        const res = await submissionApi.averageGrade(assignmentId);
        setAverage(res.data.average);
      } catch (err) {
        console.error("Error fetching average grade:", err);
      }
    };

    fetchAverage();
  }, [assignmentId]);

  return (
    <>
      <Head>
        <title>
          {assignmentTitle
            ? `Grades for ${assignmentTitle}`
            : `Grades for Assignment #${assignmentId}`}
        </title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {assignmentTitle
            ? `Grades for ${assignmentTitle}`
            : `Grades for Assignment #${assignmentId}`}
        </h1>

        {loading ? (
          <p className={styles.loading}>Loading grades...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <>
            {average !== null && (
              <p className={styles.average}>
                Average Grade: {average.toFixed(2)}
              </p>
            )}
            <GradeChart grades={grades} />
            <GradesTable grades={grades} />
          </>
        )}
      </div>
    </>
  );
}
