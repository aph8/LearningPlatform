"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { assignmentApi, submissionApi } from "../../../helper/api";
import QuestionResultCard from "../../../components/QuestionResultCard";
import styles from "../../../styles/AssignmentResult.module.scss";
import { AssignmentWithQuestions } from "../../../helper/apiTypes";

export default function AssignmentResultPage() {
  const router = useRouter();
  const { assignmentId } = router.query;

  const [assignment, setAssignment] = useState<AssignmentWithQuestions | null>(
    null,
  );
  const [submission, setSubmission] = useState<{
    assignmentGrade: number;
    answers: string[];
    correctness: boolean[];
  } | null>(null);

  const [error, setError] = useState("");

  const userName =
    typeof window !== "undefined"
      ? (localStorage.getItem("username") ?? "")
      : "";

  useEffect(() => {
    if (!assignmentId || typeof assignmentId !== "string" || !userName) return;

    const fetchData = async () => {
      try {
        const [assignmentRes, submissionRes] = await Promise.all([
          assignmentApi.getAssignmentById(assignmentId),
          submissionApi.assignmentGradesByStudent(assignmentId, userName),
        ]);
        setAssignment(assignmentRes.data);
        setSubmission(submissionRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load assignment or submission data.");
      }
    };

    fetchData();
  }, [assignmentId, userName]);

  if (error) return <p className={styles.error}>{error}</p>;
  if (!assignment || !submission)
    return <p className={styles.loading}>Loading results...</p>;

  return (
    <>
      <Head>
        <title>
          {assignment.assignmentName
            ? `Grades for ${assignment.assignmentName}`
            : `Grades for Assignment #${assignmentId}`}
        </title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {assignment.assignmentName
            ? `Grades for ${assignment.assignmentName}`
            : `Grades for Assignment #${assignmentId}`}
        </h1>

        <p className={styles.gradeText}>
          Grade: {submission.assignmentGrade.toFixed(1)} / 10
        </p>

        {assignment.questionRequest.map((q, index) => {
          const studentAnswer = submission.answers?.[index] ?? "No answer";
          const isCorrect = submission.correctness?.[index] ?? false;
          return (
            <QuestionResultCard
              key={index}
              index={index}
              question={q}
              studentAnswer={studentAnswer}
              isCorrect={isCorrect}
            />
          );
        })}

        <div className={styles.gradeText}>
          <button
            onClick={() => router.push("/dashboard/student")}
            className={styles.backButton}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
}
