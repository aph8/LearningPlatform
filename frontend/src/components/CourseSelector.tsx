"use client";

import React, { useEffect } from "react";
import styles from "../styles/CourseSelector.module.scss";
import { CourseSelectorProps } from "../helper/apiTypes";

const CourseSelector: React.FC<CourseSelectorProps> = ({
  courses,
  selectedCourseId,
  onChange,
}) => {
  useEffect(() => {
    console.log("CourseSelector - courses:", courses);
  }, [courses]);

  return (
    <div className={styles.container}>
      <label className={styles.label}>Select Course</label>
      {courses.length === 0 ? (
        <p className={styles.message}>No courses available.</p>
      ) : (
        <select
          value={selectedCourseId}
          onChange={(e) => onChange(e.target.value)}
          className={styles.select}
          required
        >
          <option value="">-- Choose a course --</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.courseName}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CourseSelector;
