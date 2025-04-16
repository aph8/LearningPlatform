"use client";

import QuestionEditorCard from "./QuestionEditorCard";
import { QuestionsSectionProps } from "../helper/apiTypes";
import styles from "../styles/QuestionsSection.module.scss";

const QuestionsSection: React.FC<QuestionsSectionProps> = ({
  questions,
  addQuestion,
  handleQuestionChange,
  removeQuestion,
}) => {
  return (
    <div className={styles.questionsSection}>
      <h2 className={styles.heading}>Questions</h2>
      {questions.map((q, index) => (
        <QuestionEditorCard
          key={index}
          index={index}
          question={q}
          handleQuestionChange={handleQuestionChange}
          removeQuestion={removeQuestion}
        />
      ))}
      <button
        type="button"
        onClick={addQuestion}
        className={styles.addQuestionButton}
      >
        + Add Question
      </button>
    </div>
  );
};

export default QuestionsSection;
