"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { assignmentApi, courseApi } from "../../helper/api";
import { format } from "date-fns";
import AssignmentDetails from "../../components/AssignmentDetails";
import QuestionsSection from "../../components/QuestionsSection";
import { Question, Course, QuestionRequest } from "../../helper/apiTypes";
import styles from "../../styles/CreateAssignment.module.scss";
import { AxiosError } from "axios";

export default function CreateAssignmentPage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    assignmentName: "",
    courseId: "",
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");

  const username =
    typeof window !== "undefined"
      ? (localStorage.getItem("username") ?? "")
      : "";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseApi.getCoursesByUser(username);
        setCourses(res.data);
      } catch {
        setError("Failed to fetch your courses");
      }
    };
    if (username) fetchCourses();
  }, [username]);

  const handleQuestionChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updated = [...questions];
    if (field === "questionText") {
      updated[index].questionText = value as string;
    } else if (field.startsWith("option")) {
      const optionIndex = parseInt(field.replace("option", ""));
      updated[index].options[optionIndex] = value as string;
    } else if (field === "correctAnswerIndex") {
      updated[index].correctAnswerIndex = Number(value);
    }
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        correctAnswer: "",
        questionText: "",
        options: ["", "", "", ""],
        correctAnswerIndex: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transformedQuestions: QuestionRequest[] = questions.map((q) => ({
      question: q.questionText || q.question,
      options: q.options,
      correctAnswer: q.options[q.correctAnswerIndex],
    }));

    const payload = {
      assignmentName: formData.assignmentName,
      dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : "",
      courseId: parseInt(formData.courseId),
      questionRequest: transformedQuestions,
      published: false,
    };

    try {
      await assignmentApi.createAssignment(payload);
      router.push("/dashboard/teacher");
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const message = axiosErr.response?.data?.message;
      console.error("API error:", message || err);
      setError(message || "Failed to create assignment.");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Assignment</title>
      </Head>
      <h1 className={styles.title}>Create Assignment</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <AssignmentDetails
          formData={formData}
          setFormData={setFormData}
          dueDate={dueDate}
          setDueDate={setDueDate}
          courses={courses}
        />

        <QuestionsSection
          questions={questions}
          addQuestion={addQuestion}
          handleQuestionChange={handleQuestionChange}
          removeQuestion={removeQuestion}
        />

        <button type="submit" className={styles.submitButton}>
          Create Assignment
        </button>
      </form>
    </div>
  );
}
