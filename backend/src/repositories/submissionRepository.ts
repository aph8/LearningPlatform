import { PrismaClient, AssignmentSubmission, Student } from "@prisma/client";

export class SubmissionRepository {
  constructor(private prisma: PrismaClient) {}

  public async getAllAssignmentGradesById(
    assignmentId: number,
  ): Promise<number[]> {
    const submissions = await this.prisma.assignmentSubmission.findMany({
      where: { assignmentId },
      select: { assignmentGrade: true },
    });
    return submissions.map((s) => s.assignmentGrade);
  }

  public async getAllAssignmentIdsByStudent(
    student: Student,
  ): Promise<number[]> {
    const submissions = await this.prisma.assignmentSubmission.findMany({
      where: { studentId: student.id },
      select: { assignmentId: true },
    });
    return submissions.map((s) => s.assignmentId);
  }

  public async getMaxGradeOfAssignmentForStudent(
    assignmentId: number,
  ): Promise<number[]> {
    const results: Array<{ maxGrade: number }> = await this.prisma.$queryRaw`
      SELECT MAX("assignmentGrade") as "maxGrade"
      FROM "AssignmentSubmission"
      WHERE "assignmentId" = ${assignmentId}
      GROUP BY "studentId"
    `;
    return results.map((r) => r.maxGrade);
  }

  public async existsByAssignmentIdAndStudent(
    assignmentId: number,
    studentId: number,
  ): Promise<boolean> {
    const count = await this.prisma.assignmentSubmission.count({
      where: { assignmentId, studentId },
    });
    return count > 0;
  }

  public async findByAssignmentIdAndStudent(
    assignmentId: number,
    studentId: number,
  ): Promise<AssignmentSubmission[]> {
    return this.prisma.assignmentSubmission.findMany({
      where: { assignmentId, studentId },
    });
  }

  public async getAssignmentSubmissionByAssignmentId(
    assignmentId: number,
  ): Promise<AssignmentSubmission[]> {
    return this.prisma.assignmentSubmission.findMany({
      where: { assignmentId },
    });
  }

  public async createSubmission(data: {
    assignmentId: number;
    studentId: number;
    assignmentGrade: number;
    answers: string[];
  }): Promise<AssignmentSubmission> {
    return this.prisma.assignmentSubmission.create({
      data: {
        assignmentId: data.assignmentId,
        studentId: data.studentId,
        assignmentGrade: data.assignmentGrade,
        answers: data.answers,
      },
    });
  }

  public async updateSubmissions(
    submissions: AssignmentSubmission[],
  ): Promise<AssignmentSubmission[]> {
    const updated: AssignmentSubmission[] = [];
    for (const sub of submissions) {
      const updatedSub = await this.prisma.assignmentSubmission.update({
        where: { submissionId: sub.submissionId },
        data: {
          assignmentGrade: sub.assignmentGrade,
          answers: sub.answers,
        },
      });
      updated.push(updatedSub);
    }
    return updated;
  }

  public async getAssignmentGradesWithUsernames(assignmentId: number) {
    return this.prisma.assignmentSubmission.findMany({
      where: { assignmentId },
      include: {
        Student: {
          select: {
            userName: true,
          },
        },
      },
    });
  }

  public async getAllCourseIdsByStudent(studentId: number): Promise<number[]> {
    const submissions = await this.prisma.assignmentSubmission.findMany({
      where: { studentId },
      include: { Assignment: true },
    });

    const courseIds = new Set<number>();
    submissions.forEach((s) => {
      if (s.Assignment && s.Assignment.courseId) {
        courseIds.add(s.Assignment.courseId);
      }
    });

    return Array.from(courseIds);
  }

  public async getGradesForStudentInCourse(
    studentId: number,
    courseId: number,
  ): Promise<{ assignmentId: number; assignmentGrade: number }[]> {
    const submissions = await this.prisma.assignmentSubmission.findMany({
      where: {
        studentId,
        Assignment: {
          courseId,
        },
      },
      select: {
        assignmentId: true,
        assignmentGrade: true,
      },
    });

    return submissions;
  }
}
