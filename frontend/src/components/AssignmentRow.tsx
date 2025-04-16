import Link from "next/link";
import { format, parseISO } from "date-fns";
import { AssignmentRowProps } from "../helper/apiTypes";
import styles from "../styles/AssignmentRow.module.scss";

export default function AssignmentRow({
  assignment,
  isCompleted,
}: AssignmentRowProps) {
  return (
    <li
      className={`${styles.assignmentRow} ${isCompleted ? styles.completed : styles.notCompleted}`}
    >
      <div>
        <p className={styles.assignmentText}>
          {assignment.assignmentName} — Due:{" "}
          {format(parseISO(assignment.dueDate), "yyyy-MM-dd")}
        </p>
      </div>
      {isCompleted ? (
        <Link
          href={`/assignments/result/${assignment.assignmentId}`}
          className={styles.linkReview}
        >
          Review
        </Link>
      ) : (
        <Link
          href={`/assignments/take/${assignment.assignmentId}`}
          className={styles.linkTake}
        >
          Take Assignment
        </Link>
      )}
    </li>
  );
}
