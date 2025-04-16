import { PrismaClient, Assignment } from "@prisma/client";

export class AssignmentRepository {
  constructor(private prisma: PrismaClient) {}

  public async createAssignment(
    data: Omit<Assignment, "assignmentId">,
  ): Promise<Assignment> {
    return this.prisma.assignment.create({ data });
  }

  public async updateAssignment(
    assignmentId: number,
    data: Partial<Omit<Assignment, "assignmentId">>,
  ): Promise<Assignment> {
    return this.prisma.assignment.update({
      where: { assignmentId },
      data,
    });
  }

  public async existsByAssignmentId(assignmentId: number): Promise<boolean> {
    const assignment = await this.prisma.assignment.findUnique({
      where: { assignmentId },
    });
    return !!assignment;
  }

  public async findByAssignmentId(
    assignmentId: number,
  ): Promise<Assignment | null> {
    return this.prisma.assignment.findUnique({ where: { assignmentId } });
  }

  public async deleteAssignmentById(assignmentId: number): Promise<Assignment> {
    return this.prisma.assignment.delete({ where: { assignmentId } });
  }

  public async findAssignmentsByCourseId(
    courseId: number,
  ): Promise<Assignment[]> {
    return this.prisma.assignment.findMany({ where: { courseId } });
  }

  public async findAllAssignments(): Promise<Assignment[]> {
    return this.prisma.assignment.findMany();
  }
}
