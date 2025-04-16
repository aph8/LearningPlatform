import Link from "next/link";
import { format, parseISO } from "date-fns";
import { AssignmentItemProps } from "../helper/apiTypes";
import styles from "../styles/AssignmentItem.module.scss";

export default function AssignmentItem({
  assignment,
  canUnpublish,
  canDelete,
  onTogglePublish,
  onDelete,
}: AssignmentItemProps) {
  return (
    <li className={styles.assignmentItem}>
      <div className={styles.container}>
        <div>
          <span className={styles.assignmentName}>
            {assignment.assignmentName}
          </span>{" "}
          — Due: {format(parseISO(assignment.dueDate), "yyyy-MM-dd")}{" "}
          {assignment.published ? (
            <span className={styles.publishedLabel}>(Published)</span>
          ) : (
            <span className={styles.unpublishedLabel}>(Unpublished)</span>
          )}
        </div>

        <div className={styles.actions}>
          {canDelete && (
            <Link
              href={`/assignments/edit?assignmentId=${assignment.assignmentId}`}
              className={styles.editLink}
            >
              Edit
            </Link>
          )}

          <Link
            href={`/assignments/grades/${assignment.assignmentId}`}
            className={styles.viewGradesLink}
          >
            View Grades
          </Link>

          {assignment.published ? (
            canUnpublish && (
              <button
                onClick={() => onTogglePublish(assignment.assignmentId, false)}
                className={`${styles.button} ${styles.unpublishButton}`}
              >
                Unpublish
              </button>
            )
          ) : (
            <button
              onClick={() => onTogglePublish(assignment.assignmentId, true)}
              className={`${styles.button} ${styles.publishButton}`}
            >
              Publish
            </button>
          )}

          <button
            onClick={() => onDelete(assignment.assignmentId)}
            disabled={!canDelete}
            className={`${styles.deleteButton} ${styles.button} ${
              canDelete ? styles.enabled : styles.disabled
            }`}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
