"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Head from "next/head";
import { assignmentApi, courseApi } from "../../helper/api";
import { format, parseISO } from "date-fns";
import AssignmentDetails from "../../components/AssignmentDetails";
import QuestionsSection from "../../components/QuestionsSection";
import {
  Question,
  AssignmentData,
  AssignmentWithQuestions,
  QuestionRequest,
  Course,
} from "../../helper/apiTypes";
import { AxiosError } from "axios";
import styles from "../../styles/EditAssignment.module.scss";

export default function EditAssignmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get("assignmentId");

  const [formData, setFormData] = useState<AssignmentData>({
    assignmentName: "",
    dueDate: "",
    published: false,
    courseId: 0,
    questionRequest: [],
  });

  const [dueDateObj, setDueDateObj] = useState<Date | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
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
      } catch (err) {
        console.error(err);
        setError("Failed to fetch your courses");
      }
    };

    if (username) {
      fetchCourses();
    }
  }, [username]);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        if (!assignmentId) return;

        const res = await assignmentApi.getAssignmentById(assignmentId);
        const data: AssignmentWithQuestions = res.data;

        const transformedQuestions: Question[] = data.questionRequest.map(
          (q) => ({
            question: q.question,
            correctAnswer: q.correctAnswer,
            questionText: q.question,
            options: q.options,
            correctAnswerIndex: q.options.indexOf(q.correctAnswer),
          }),
        );

        setFormData({
          assignmentName: data.assignmentName,
          dueDate: data.dueDate,
          published: data.published,
          courseId: data.courseId,
          questionRequest: transformedQuestions,
        });

        setDueDateObj(parseISO(data.dueDate));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch assignment");
      }
    };

    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId]);

  const handleQuestionChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updated = [...formData.questionRequest];
    if (field === "questionText") {
      updated[index].questionText = value as string;
    } else if (field.startsWith("option")) {
      const optionIndex = parseInt(field.replace("option", ""));
      updated[index].options[optionIndex] = value as string;
    } else if (field === "correctAnswerIndex") {
      updated[index].correctAnswerIndex = Number(value);
    }
    setFormData((prev) => ({ ...prev, questionRequest: updated }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questionRequest: [
        ...prev.questionRequest,
        {
          question: "",
          correctAnswer: "",
          questionText: "",
          options: ["", "", "", ""],
          correctAnswerIndex: 0,
        },
      ],
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questionRequest: prev.questionRequest.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transformedQuestions: QuestionRequest[] =
      formData.questionRequest.map((q) => ({
        question: q.questionText || q.question,
        options: q.options,
        correctAnswer: q.options[q.correctAnswerIndex],
      }));

    const payload = {
      assignmentName: formData.assignmentName,
      dueDate: dueDateObj ? format(dueDateObj, "yyyy-MM-dd") : "",
      courseId: formData.courseId,
      questionRequest: transformedQuestions,
      published: formData.published,
    };

    try {
      await assignmentApi.editAssignment(assignmentId!, payload);
      router.push("/dashboard/teacher");
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const message = axiosErr.response?.data?.message;
      console.error("API error:", message || err);
      setError(message || "Failed to update assignment.");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Edit Assignment</title>
      </Head>
      <h1 className={styles.title}>Edit Assignment</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <AssignmentDetails
          formData={{
            assignmentName: formData.assignmentName,
            courseId: formData.courseId.toString(),
          }}
          setFormData={(data) => {
            setFormData((prev) => ({
              ...prev,
              assignmentName: data.assignmentName,
              courseId: parseInt(data.courseId),
            }));
          }}
          dueDate={dueDateObj}
          setDueDate={setDueDateObj}
          courses={courses}
        />

        <QuestionsSection
          questions={formData.questionRequest}
          addQuestion={addQuestion}
          handleQuestionChange={handleQuestionChange}
          removeQuestion={removeQuestion}
        />

        <button type="submit" className={styles.submitButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
