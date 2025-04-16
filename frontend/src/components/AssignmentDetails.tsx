"use client";

import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/AssignmentDetails.module.scss";
import { AssignmentDetailsProps } from "../helper/apiTypes";

const AssignmentDetails: React.FC<AssignmentDetailsProps> = ({
  formData,
  setFormData,
  dueDate,
  setDueDate,
  courses,
}) => {
  useEffect(() => {
    console.log("AssignmentDetails - courses:", courses);
  }, [courses]);

  return (
    <div className={styles.container}>
      {/* Assignment Title */}
      <div>
        <label className={styles.label}>Assignment Title</label>
        <input
          type="text"
          name="assignmentName"
          value={formData.assignmentName}
          onChange={(e) =>
            setFormData({ ...formData, assignmentName: e.target.value })
          }
          className={styles.inputField}
          required
        />
      </div>

      {/* Due Date */}
      <div>
        <label className={styles.label}>Due Date</label>
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select due date"
          className={styles.inputField}
          minDate={new Date()}
        />
      </div>

      {/* Course Selection */}
      <div>
        <label className={styles.label}>Course</label>
        <select
          value={formData.courseId}
          onChange={(e) =>
            setFormData({ ...formData, courseId: e.target.value })
          }
          className={styles.inputField}
          required
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.courseName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AssignmentDetails;
