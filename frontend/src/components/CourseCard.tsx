import Link from "next/link";
import AssignmentItem from "./AssignmentItem";
import { CourseCardProps } from "@/helper/apiTypes";
import styles from "../styles/CourseCard.module.scss";

export default function CourseCard({
  course,
  assignments,
  canUnpublishMap,
  canDeleteMap,
  visibleStudents,
  isLoadingStudents,
  onToggleStudents,
  onTogglePublish,
  onDelete,
  onDeleteCourse,
}: CourseCardProps) {
  return (
    <div className={styles.cardContainer}>
      <h3 className={styles.courseTitle}>{course.courseName}</h3>
      {course.description && (
        <p className={styles.courseDescription}>{course.description}</p>
      )}

      <div className={styles.actionArea}>
        <Link
          href={`/courses/editCourse?courseId=${course.courseId}`}
          className={styles.editLink}
        >
          Edit Course
        </Link>
        <button
          onClick={onToggleStudents}
          className={styles.toggleStudentsButton}
        >
          {visibleStudents ? "Hide Students" : "View Students"}
        </button>
        <button onClick={onDeleteCourse} className={styles.deleteCourseButton}>
          Delete Course
        </button>
      </div>

      {visibleStudents && (
        <ul className={styles.studentsList}>
          {isLoadingStudents ? (
            <li>Loading students...</li>
          ) : visibleStudents.length === 0 ? (
            <li>No students enrolled</li>
          ) : (
            visibleStudents.map((student) => (
              <li key={student.userName}>
                {student.name} ({student.userName})
              </li>
            ))
          )}
        </ul>
      )}

      <div className={styles.assignmentsHeader}>
        <h4 className={styles.assignmentsHeaderText}>Assignments:</h4>
        {assignments.length === 0 ? (
          <p className={styles.studentsList}>No assignments created yet.</p>
        ) : (
          <ul className={styles.assignmentsList}>
            {assignments.map((a) => (
              <AssignmentItem
                key={a.assignmentId}
                assignment={a}
                canUnpublish={canUnpublishMap[a.assignmentId]}
                canDelete={canDeleteMap[a.assignmentId]}
                onTogglePublish={onTogglePublish}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
