// Cleaned and unified apiTypes.ts

// ==================== Question Types ====================
export interface QuestionRequest {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Question extends QuestionRequest {
  correctAnswerIndex: number;
  questionText?: string;
}

export interface QuestionForAnswer {
  question: string;
  options: string[];
}

export interface QuestionsSectionProps {
  questions: Question[];
  addQuestion: () => void;
  handleQuestionChange: (
    index: number,
    field: string,
    value: string | number,
  ) => void;
  removeQuestion: (index: number) => void;
}

// ==================== Assignment Types ====================
export interface AssignmentBase {
  assignmentId: number;
  assignmentName: string;
  dueDate: string;
}

export interface Assignment extends AssignmentBase {
  published: boolean;
}

export interface AssignmentWithQuestions extends Assignment {
  courseId: number;
  questionRequest: Question[];
}

export interface AssignmentRequest {
  dueDate: string;
  questionRequest: QuestionRequest[];
  courseId: number;
  assignmentName: string;
  published?: boolean;
}

export interface AssignmentPatch {
  published?: boolean;
}

export interface AssignmentData {
  assignmentName: string;
  dueDate: string;
  published: boolean;
  courseId: number;
  questionRequest: Question[];
}

interface AssignmentGrade {
  assignmentName: string;
  grade: number | null;
  published?: boolean;
}

// ==================== Course Types ====================
export interface Course {
  courseId: number;
  courseName: string;
  description?: string;
}

export interface CourseRequest extends Omit<Course, "courseId"> {
  instructor: string;
}

// ==================== User & Auth ====================
export interface Student {
  userName: string;
  name: string;
}

export interface User {
  userName: string;
  name: string;
  email: string;
  isInstructor: boolean;
  recoveryEmail?: string | null;
}

export interface SignupData {
  userName: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface Credentials {
  userName: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

// ==================== Submissions & Grades ====================
export interface SubmissionRequest {
  assignmentId: number;
  userName: string;
  answers: string[];
}

export interface StudentGrade {
  userName: string;
  assignmentGrade: number;
}

export interface Grade {
  assignmentGrade: number;
}

export interface GradeProps {
  grades: Grade[];
}

export interface GradesTableProps {
  grades: StudentGrade[];
}

export interface CourseGrades {
  courseName: string;
  assignments: AssignmentGrade[];
}

// ==================== Component Props ====================
export interface AssignmentDetailsProps {
  formData: { assignmentName: string; courseId: string };
  setFormData: (data: { assignmentName: string; courseId: string }) => void;
  dueDate: Date | null;
  setDueDate: (date: Date | null) => void;
  courses: Course[];
}

export interface AssignmentItemProps {
  assignment: Assignment;
  canUnpublish: boolean;
  canDelete: boolean;
  onTogglePublish: (assignmentId: number, publish: boolean) => void;
  onDelete: (assignmentId: number) => void;
}

export interface AssignmentRowProps {
  assignment: Assignment;
  isCompleted: boolean;
}

export interface CourseCardStudentProps {
  course: Course;
  assignments: Assignment[];
  completedAssignments: Set<number>;
}

export interface CourseCardProps {
  course: Course;
  assignments: Assignment[];
  canUnpublishMap: Record<number, boolean>;
  canDeleteMap: Record<number, boolean>;
  visibleStudents: Student[];
  isLoadingStudents: boolean;
  onToggleStudents: () => void;
  onTogglePublish: (assignmentId: number, publish: boolean) => void;
  onDelete: (assignmentId: number) => void;
  onDeleteCourse: () => void;
}

export interface QuestionEditorCardProps {
  index: number;
  question: Question;
  handleQuestionChange?: (
    index: number,
    field: string,
    value: string | number,
  ) => void;
  removeQuestion?: (index: number) => void;
  selectedAnswer?: string;
  onAnswerChange?: (index: number, answer: string) => void;
}

export interface QuestionsSectionProps {
  questions: Question[];
  addQuestion: () => void;
  handleQuestionChange: (
    index: number,
    field: string,
    value: string | number,
  ) => void;
  removeQuestion: (index: number) => void;
}

export interface QuestionAnswerCardProps {
  index: number;
  question: QuestionForAnswer;
  selectedAnswer: string;
  onAnswerChange: (index: number, answer: string) => void;
}

export interface QuestionResultCardProps {
  index: number;
  question: Question;
  studentAnswer: string;
  isCorrect: boolean;
}

export interface AutocompleteInputProps<T> {
  label: string;
  query: string;
  onQueryChange: (query: string) => void;
  items: T[];
  onItemSelect: (item: T) => void;
  itemKey: (item: T) => string;
  itemLabel: (item: T) => string;
}

export interface CourseSelectorProps {
  courses: Course[];
  selectedCourseId: string;
  onChange: (courseId: string) => void;
}
