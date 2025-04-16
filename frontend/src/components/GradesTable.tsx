"use client";

import React from "react";
import { GradesTableProps } from "@/helper/apiTypes";
import styles from "../styles/GradesTable.module.scss";

const GradesTable: React.FC<GradesTableProps> = ({ grades }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Individual Grades</h2>
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th className={styles.headerCell}>Student</th>
            <th className={styles.headerCell}>Grade</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g, index) => (
            <tr key={index} className={styles.bodyRow}>
              <td className={styles.bodyCell}>
                {g.userName || "Unknown Student"}
              </td>
              <td className={styles.bodyCell}>
                {typeof g.assignmentGrade === "number"
                  ? g.assignmentGrade.toFixed(2)
                  : "Incomplete"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradesTable;
