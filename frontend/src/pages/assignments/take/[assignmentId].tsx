"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { assignmentApi, submissionApi } from "../../../helper/api";
import QuestionCard from "../../../components/QuestionEditorCard";
import styles from "../../../styles/TakeAssignment.module.scss";
import {
  Question,
  QuestionRequest,
  AssignmentWithQuestions,
} from "../../../helper/apiTypes";

export default function TakeAssignmentPage() {
  const router = useRouter();
  const { assignmentId } = router.query;

  const [assignment, setAssignment] = useState<AssignmentWithQuestions | null>(
    null,
  );
  const [answers, setAnswers] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const username =
    typeof window !== "undefined"
      ? (localStorage.getItem("username") ?? "")
      : "";

  useEffect(() => {
    if (!assignmentId || typeof assignmentId !== "string") return;

    const fetchAssignment = async () => {
      try {
        const res = await assignmentApi.getAssignmentById(assignmentId);

        const transformedQuestions: Question[] = res.data.questionRequest.map(
          (q: QuestionRequest) => {
            const correctAnswerIndex = q.options.indexOf(q.correctAnswer);
            return {
              ...q,
              questionText: q.question || "Untitled Question",
              correctAnswerIndex:
                correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
            };
          },
        );

        setAssignment({ ...res.data, questionRequest: transformedQuestions });
        setAnswers(new Array(transformedQuestions.length).fill(""));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching assignment:", err);
        setError("Failed to load assignment.");
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!assignmentId || !username) {
      setError("Missing assignment ID or username.");
      setSubmitting(false);
      return;
    }

    const payload = {
      assignmentId: Number(assignmentId),
      userName: username,
      answers: answers,
    };

    console.log("📤 Submitting assignment:", payload);

    try {
      const response = await submissionApi.submitAssignment(payload);
      console.log("✅ Submission response:", response.data);
      router.push(`/assignments/result/${assignmentId}`);
    } catch (err: unknown) {
      console.error("❌ Submission error:", err);
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(
          axiosErr?.response?.data?.message || "Failed to submit assignment",
        );
      } else {
        setError("Failed to submit assignment");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading assignment...</div>;
  }

  if (!assignment) {
    return <div className={styles.error}>Failed to load assignment.</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{assignment.assignmentName}</title>
      </Head>
      <h1 className={styles.title}>{assignment.assignmentName}</h1>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {assignment.questionRequest.map((q, index) => (
          <QuestionCard
            key={index}
            index={index}
            question={q}
            selectedAnswer={answers[index]}
            onAnswerChange={handleAnswerChange}
          />
        ))}

        <button
          type="submit"
          disabled={submitting}
          className={styles.submitButton}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
