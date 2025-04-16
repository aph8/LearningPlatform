"use client";

import React from "react";
import { QuestionResultCardProps } from "../helper/apiTypes";
import styles from "../styles/QuestionResultCard.module.scss";

const QuestionResultCard: React.FC<QuestionResultCardProps> = ({
  index,
  question,
  studentAnswer,
  isCorrect,
}) => {
  return (
    <div
      className={`${styles.container} ${
        isCorrect ? styles.correct : styles.incorrect
      }`}
    >
      <p className={styles.fontMedium}>
        Q{index + 1}: {question.question}
      </p>
      <p>
        Your Answer:{" "}
        <span className={styles.fontSemibold}>{studentAnswer}</span>
      </p>
      <p>
        Correct Answer:{" "}
        <span className={styles.fontSemibold}>{question.correctAnswer}</span>
      </p>
      <p className={isCorrect ? styles.correctText : styles.incorrectText}>
        {isCorrect ? "Correct ✅" : "Incorrect ❌"}
      </p>
    </div>
  );
};

export default QuestionResultCard;
