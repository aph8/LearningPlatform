import { z } from "zod";
import { QuestionRequest } from "./questionRequest";

export interface AssignmentRequest {
  dueDate: string;
  questionRequest: QuestionRequest[];
  courseId: number;
  assignmentName: string;
  published?: boolean;
}

export const AssignmentRequestSchema = z.object({
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  questionRequest: z.array(
    z.object({
      question: z.string().min(1, "Question is required"),
      options: z.array(z.string()),
      correctAnswer: z.string().min(1, "Correct answer is required"),
    }),
  ),
  courseId: z.number(),
  assignmentName: z.string().min(1, "Assignment name required"),
  published: z.boolean().optional(),
});
