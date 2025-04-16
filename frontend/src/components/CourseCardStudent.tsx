import AssignmentRow from "./AssignmentRow";
import { CourseCardStudentProps } from "../helper/apiTypes";
import styles from "../styles/CourseCardStudent.module.scss";

export default function CourseCardStudent({
  course,
  assignments,
  completedAssignments,
}: CourseCardStudentProps) {
  return (
    <li className={styles.cardContainer}>
      <p className={styles.courseName}>{course.courseName}</p>
      {course.description && (
        <p className={styles.description}>{course.description}</p>
      )}

      <h3 className={styles.assignmentsHeader}>Assignments:</h3>
      {assignments.length === 0 ? (
        <p className={styles.noAssignments}>No published assignments yet.</p>
      ) : (
        <ul className={styles.assignmentList}>
          {assignments.map((a) => (
            <AssignmentRow
              key={a.assignmentId}
              assignment={a}
              isCompleted={completedAssignments.has(a.assignmentId)}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
