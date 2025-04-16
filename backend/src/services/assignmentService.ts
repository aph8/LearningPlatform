import { AssignmentRepository } from "../repositories/assignmentRepository";
import { Assignment, AssignmentSubmission, Student } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { SubmissionRepository } from "../repositories/submissionRepository";

const prisma = new PrismaClient();

export class AssignmentService {
  private dateToday = new Date();

  constructor(
    private assignmentRepository: AssignmentRepository,
    private submissionRepository: SubmissionRepository,
  ) {}

  public async createAssignment(
    data: Omit<Assignment, "assignmentId">,
  ): Promise<Assignment> {
    return this.assignmentRepository.createAssignment(data);
  }

  public async updateAssignment(
    assignmentId: number,
    data: Partial<Omit<Assignment, "assignmentId">>,
  ): Promise<Assignment> {
    return this.assignmentRepository.updateAssignment(assignmentId, data);
  }

  public async doesAssignmentExist(assignmentId: number): Promise<boolean> {
    return this.assignmentRepository.existsByAssignmentId(assignmentId);
  }

  public async getAllAssignments(): Promise<Assignment[]> {
    return this.assignmentRepository.findAllAssignments();
  }

  public async getAssignmentById(assignmentId: number): Promise<Assignment> {
    const assignment =
      await this.assignmentRepository.findByAssignmentId(assignmentId);
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return assignment;
  }

  public async deleteAssignmentById(assignmentId: number): Promise<void> {
    await this.assignmentRepository.deleteAssignmentById(assignmentId);
  }

  public async isPublished(assignmentId: number): Promise<boolean> {
    const assignment = await this.getAssignmentById(assignmentId);
    return assignment.published;
  }

  public async canBeUnpublished(assignmentId: number): Promise<boolean> {
    const submissions = await prisma.assignmentSubmission.findMany({
      where: { assignmentId },
    });
    return submissions.length === 0;
  }

  public async getAllPublishedAssignmentByCourseId(
    courseId: number,
  ): Promise<Assignment[]> {
    const assignments =
      await this.assignmentRepository.findAssignmentsByCourseId(courseId);
    return assignments.filter((a) => a.published);
  }

  public async getAllAssignmentsByCourseId(
    courseId: number,
  ): Promise<Assignment[]> {
    return this.assignmentRepository.findAssignmentsByCourseId(courseId);
  }

  public async getSubmissionsByCourseAndStudent(
    courseId: number,
    studentId: number,
  ): Promise<AssignmentSubmission[]> {
    return await prisma.assignmentSubmission.findMany({
      where: {
        studentId,
        Assignment: {
          courseId,
        },
      },
      include: {
        Assignment: true,
      },
    });
  }

  public async canDeleteAssignment(assignmentId: number): Promise<boolean> {
    const submissions =
      await this.submissionRepository.getAssignmentSubmissionByAssignmentId(
        assignmentId,
      );
    return submissions.length === 0;
  }

  public async getAllCourseIdsByStudent(student: Student) {
    return this.submissionRepository.getAllCourseIdsByStudent(student.id);
  }

  public async getGradesForStudentInCourse(
    studentId: number,
    courseId: number,
  ) {
    return this.submissionRepository.getGradesForStudentInCourse(
      studentId,
      courseId,
    );
  }
}
