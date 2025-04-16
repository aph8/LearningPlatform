"use client";

import React from "react";
import { QuestionAnswerCardProps } from "../helper/apiTypes";
import styles from "../styles/QuestionAnswerCard.module.scss";

const QuestionAnswerCard: React.FC<QuestionAnswerCardProps> = ({
  index,
  question,
  selectedAnswer,
  onAnswerChange,
}) => {
  return (
    <div className={styles.cardContainer}>
      <p className={styles.questionText}>
        Question {index + 1}: {question.question}
      </p>
      <div className={styles.optionsContainer}>
        {question.options.map((option, i) => (
          <label key={i} className={styles.optionLabel}>
            <input
              type="radio"
              name={`question-${index}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => onAnswerChange(index, option)}
              className={styles.radioInput}
              required
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionAnswerCard;
