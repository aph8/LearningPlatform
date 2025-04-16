import { Request, Response, NextFunction } from "express";
import { SubmissionService } from "../services/submissionService";
import { StudentService } from "../services/studentService";
import { AssignmentService } from "../services/assignmentService";

// Define the shape of a question and a submission
type Question = {
  correctAnswer: string;
};

type Submission = {
  studentId: number;
  assignmentGrade: number;
  answers?: string[];
  submissionId: number;
};

export class SubmissionController {
  constructor(
    private submissionService: SubmissionService,
    private studentService: StudentService,
    private assignmentService: AssignmentService,
  ) {}

  public averageGrade = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const assignmentId = Number(req.params.assignmentId);
      const average =
        await this.submissionService.getAverageGradeFromId(assignmentId);
      res.status(200).json({ average });
    } catch (err) {
      next(err);
    }
  };

  public grades = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const assignmentId = Number(req.params.assignmentId);
      const grades =
        await this.submissionService.getAllAssignmentGrades(assignmentId);
      res.status(200).json(grades);
    } catch (err) {
      next(err);
    }
  };

  public hasBeenSubmitted = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const assignmentId = Number(req.params.assignmentId);
      const { userName } = req.query;
      if (typeof userName !== "string") {
        res
          .status(400)
          .json({ message: "userName query parameter is required" });
        return;
      }
      const student = await this.studentService.getStudentByUserName(userName);
      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }
      const submitted = await this.submissionService.submittedByStudent(
        assignmentId,
        student.id,
      );
      res.status(200).json({ submitted });
    } catch (err) {
      next(err);
    }
  };

  public assignmentGradesByStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const assignmentId = Number(req.params.assignmentId);
      const { userName } = req.query;
      if (typeof userName !== "string") {
        res
          .status(400)
          .json({ message: "userName query parameter is required" });
        return;
      }

      const student = await this.studentService.getStudentByUserName(userName);
      const assignment =
        await this.assignmentService.getAssignmentById(assignmentId);

      if (!student || !assignment) {
        res.status(404).json({ message: "Student or assignment not found" });
        return;
      }

      const submission = await this.submissionService.getLatestSubmission(
        assignmentId,
        student.id,
      );
      if (!submission) {
        res.status(404).json({ message: "No submission found" });
        return;
      }

      const questions = JSON.parse(assignment.jsonData) as Question[];
      const correctness = questions.map(
        (q, i) => submission.answers?.[i] === q.correctAnswer,
      );

      res.status(200).json({
        assignmentGrade: submission.assignmentGrade,
        answers: submission.answers,
        correctness,
      });
    } catch (err) {
      next(err);
    }
  };

  public submitAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { assignmentId, userName, answers } = req.body;

      if (!assignmentId || !userName || !Array.isArray(answers)) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const student = await this.studentService.getStudentByUserName(userName);
      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }

      const assignment =
        await this.assignmentService.getAssignmentById(assignmentId);
      if (!assignment) {
        res.status(404).json({ message: "Assignment not found" });
        return;
      }

      const questions = JSON.parse(assignment.jsonData) as Question[];
      const correctAnswers = questions.map((q) => q.correctAnswer);

      let score = 0;
      for (let i = 0; i < correctAnswers.length; i++) {
        if (answers[i] === correctAnswers[i]) {
          score++;
        }
      }

      const gradeRaw = (score / correctAnswers.length) * 10;
      const grade = Math.round(gradeRaw * 100) / 100;

      const correctness = correctAnswers.map(
        (correct: string, i: number) => answers[i] === correct,
      );

      const submission = await this.submissionService.createSubmission(
        assignmentId,
        student.id,
        answers,
        grade,
      );

      res.status(201).json({
        message: "Submission successful",
        grade,
        answers,
        correctness,
        submissionId: submission.submissionId,
      });
    } catch (err) {
      console.error("❌ Error in submitAssignment:", err);
      next(err);
    }
  };

  public allGradesForAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const assignmentId = Number(req.params.assignmentId);
      const assignment =
        await this.assignmentService.getAssignmentById(assignmentId);
      if (!assignment) {
        res.status(404).json({ message: "Assignment not found" });
        return;
      }
      const courseId = assignment.courseId;

      const students = await this.studentService.getStudentsByCourse(courseId);
      const submissions =
        await this.submissionService.getAssignmentSubmissions(assignmentId);

      const submissionMap = new Map<number, Submission>();
      submissions.forEach((sub: Submission) =>
        submissionMap.set(sub.studentId, sub),
      );

      const grades = students.map((student) => ({
        student: student.userName,
        assignmentGrade: submissionMap.get(student.id)?.assignmentGrade ?? null,
      }));

      res.status(200).json(grades);
    } catch (err) {
      next(err);
    }
  };
}
