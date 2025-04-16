import { QuestionRequest } from "./questionRequest";

export interface AssignmentResponse {
  assignmentId: number;
  dueDate: string;
  questionRequest: QuestionRequest[];
  courseId: number;
  assignmentName: string;
  published: boolean;
}
