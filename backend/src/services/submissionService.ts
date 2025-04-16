import { SubmissionRepository } from "../repositories/submissionRepository";
import { Student, AssignmentSubmission } from "@prisma/client";

export class SubmissionService {
  constructor(private submissionRepository: SubmissionRepository) {}

  public async getAverageGradeFromId(assignmentId: number): Promise<number> {
    const grades =
      await this.submissionRepository.getMaxGradeOfAssignmentForStudent(
        assignmentId,
      );
    if (grades.length === 0) return 0;
    const average =
      grades.reduce((acc, grade) => acc + grade, 0) / grades.length;
    return Math.round(average * 100) / 100;
  }

  public async getAllAssignmentGrades(assignmentId: number) {
    return this.submissionRepository.getAssignmentGradesWithUsernames(
      assignmentId,
    );
  }

  public async submittedByStudent(
    assignmentId: number,
    studentId: number,
  ): Promise<boolean> {
    return this.submissionRepository.existsByAssignmentIdAndStudent(
      assignmentId,
      studentId,
    );
  }

  public async getLatestSubmission(
    assignmentId: number,
    studentId: number,
  ): Promise<AssignmentSubmission | null> {
    const submissions =
      await this.submissionRepository.findByAssignmentIdAndStudent(
        assignmentId,
        studentId,
      );
    if (!submissions.length) return null;
    return submissions.sort((a, b) => b.submissionId - a.submissionId)[0];
  }

  public async updateSubmission(
    assignmentId: number,
    student: Student,
    assignmentGrade: number,
    answers: string[],
  ): Promise<void> {
    const submissions =
      await this.submissionRepository.findByAssignmentIdAndStudent(
        assignmentId,
        student.id,
      );
    if (submissions.length > 0) {
      for (const submission of submissions) {
        submission.assignmentGrade = assignmentGrade;
        submission.answers = answers;
      }
      await this.submissionRepository.updateSubmissions(submissions);
    }
  }

  public async hasAnySubmissions(assignmentId: number): Promise<boolean> {
    const submissions =
      await this.submissionRepository.getAssignmentSubmissionByAssignmentId(
        assignmentId,
      );
    return submissions.length > 0;
  }

  public async previousSubmissionExists(
    assignmentId: number,
    student: Student,
  ): Promise<boolean> {
    return this.submissionRepository.existsByAssignmentIdAndStudent(
      assignmentId,
      student.id,
    );
  }

  public async getAssignmentSubmissions(assignmentId: number) {
    return this.submissionRepository.getAssignmentSubmissionByAssignmentId(
      assignmentId,
    );
  }

  public async createSubmission(
    assignmentId: number,
    studentId: number,
    answers: string[],
    assignmentGrade: number,
  ): Promise<AssignmentSubmission> {
    return this.submissionRepository.createSubmission({
      assignmentId,
      studentId,
      answers,
      assignmentGrade,
    });
  }
}
