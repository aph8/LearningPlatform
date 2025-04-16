"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { courseApi, userApi } from "../../helper/api";
import CourseSelector from "../../components/CourseSelector";
import AutocompleteInput from "../../components/AutocompleteInput";
import { Course, User } from "../../helper/apiTypes";
import styles from "../../styles/InviteToCourse.module.scss";

export default function InviteToCoursePage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [studentQuery, setStudentQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [message, setMessage] = useState("");

  const userName =
    typeof window !== "undefined"
      ? (localStorage.getItem("username") ?? "")
      : "";

  useEffect(() => {
    if (!userName) router.push("/auth/login");
  }, [userName, router]);

  useEffect(() => {
    const fetchCoursesAndUsers = async () => {
      try {
        const [coursesRes, usersRes] = await Promise.all([
          courseApi.getCoursesByUser(userName),
          userApi.getAllUsers(),
        ]);
        setCourses(coursesRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    if (userName) fetchCoursesAndUsers();
  }, [userName]);

  const filteredStudents = users.filter(
    (u) =>
      !u.isInstructor &&
      u.userName.toLowerCase().includes(studentQuery.toLowerCase()),
  );

  const handleInvite = async () => {
    if (!selectedCourseId || !selectedStudent) {
      setMessage("Please select both course and student.");
      return;
    }

    try {
      await courseApi.registerStudentInCourse(
        selectedCourseId,
        selectedStudent,
      );
      setMessage(`Student ${selectedStudent} successfully invited to course.`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to invite student.");
    }
  };

  return (
    <>
      <Head>
        <title>Invite Student to Course</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>Invite Student to Course</h1>
        {message && <p className={styles.message}>{message}</p>}
        <CourseSelector
          courses={courses}
          selectedCourseId={selectedCourseId}
          onChange={setSelectedCourseId}
        />
        <AutocompleteInput<User>
          label="Student"
          query={studentQuery}
          onQueryChange={setStudentQuery}
          items={filteredStudents}
          onItemSelect={(student) => {
            setSelectedStudent(student.userName);
            setStudentQuery(student.userName);
          }}
          itemKey={(student) => student.userName}
          itemLabel={(student) => student.userName}
        />
        <button onClick={handleInvite} className={styles.inviteButton}>
          Invite Student
        </button>
      </div>
    </>
  );
}
