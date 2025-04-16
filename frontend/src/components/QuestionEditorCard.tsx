"use client";

import React from "react";
import styles from "../styles/QuestionEditorCard.module.scss";
import { QuestionEditorCardProps } from "../helper/apiTypes";

const QuestionEditorCard: React.FC<QuestionEditorCardProps> = ({
  index,
  question,
  handleQuestionChange,
  removeQuestion,
  selectedAnswer,
  onAnswerChange,
}) => {
  if (onAnswerChange && typeof selectedAnswer === "string") {
    return (
      <div className={styles.answerContainer}>
        <p className={styles.questionText}>
          Question {index + 1}: {question.questionText}
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
  }

  return (
    <div className={styles.editorContainer}>
      <div>
        <label className={styles.formLabel}>Question {index + 1}</label>
        <input
          type="text"
          value={question.questionText}
          onChange={(e) =>
            handleQuestionChange &&
            handleQuestionChange(index, "questionText", e.target.value)
          }
          className={styles.formInput}
          required
        />
      </div>
      {question.options.map((option, i) => (
        <div key={i}>
          <label className={styles.formLabel}>
            Option {String.fromCharCode(65 + i)}
          </label>
          <input
            type="text"
            value={option}
            onChange={(e) =>
              handleQuestionChange &&
              handleQuestionChange(index, `option${i}`, e.target.value)
            }
            className={styles.formInput}
            required
          />
        </div>
      ))}
      <div>
        <label className={styles.formLabel}>Correct Answer</label>
        <select
          value={question.correctAnswerIndex}
          onChange={(e) =>
            handleQuestionChange &&
            handleQuestionChange(
              index,
              "correctAnswerIndex",
              Number(e.target.value),
            )
          }
          className={styles.selectInput}
        >
          {question.options.map((_, i) => (
            <option key={i} value={i}>
              Option {String.fromCharCode(65 + i)}
            </option>
          ))}
        </select>
      </div>
      {removeQuestion && (
        <button
          type="button"
          onClick={() => removeQuestion(index)}
          className={styles.removeButton}
        >
          Remove Question
        </button>
      )}
    </div>
  );
};

export default QuestionEditorCard;
