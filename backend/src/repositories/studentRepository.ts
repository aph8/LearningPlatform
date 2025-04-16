import {
  PrismaClient,
  Student,
  Course,
  AssignmentSubmission,
} from "@prisma/client";

export class StudentRepository {
  constructor(public prisma: PrismaClient) {}

  public async findById(id: number): Promise<Student | null> {
    return this.prisma.student.findUnique({ where: { id } });
  }

  public async getStudentByUserName(userName: string): Promise<Student | null> {
    return this.prisma.student.findUnique({ where: { userName } });
  }

  public async findAll(): Promise<Student[]> {
    return this.prisma.student.findMany();
  }

  public async createStudent(data: {
    userName: string;
    name: string;
  }): Promise<Student> {
    return this.prisma.student.create({ data });
  }

  public async save(student: Student): Promise<Student> {
    return this.prisma.student.update({
      where: { id: student.id },
      data: student,
    });
  }

  public async getCoursesByStudentId(studentId: number): Promise<Course[]> {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      select: { courses: true },
    });
    return student?.courses || [];
  }

  public async getSubmissionsByStudentId(
    studentId: number,
  ): Promise<AssignmentSubmission[]> {
    return this.prisma.assignmentSubmission.findMany({
      where: { studentId },
    });
  }

  public async getSubmissionsWithAssignment(studentId: number) {
    return this.prisma.assignmentSubmission.findMany({
      where: { studentId },
      include: { Assignment: true },
    });
  }

  public async getStudentsByCourse(courseId: number): Promise<Student[]> {
    return this.prisma.student.findMany({
      where: {
        courses: {
          some: {
            courseId: courseId,
          },
        },
      },
    });
  }

  public async removeCourse(userName: string, courseId: number) {
    return this.prisma.student.update({
      where: { userName },
      data: {
        courses: {
          disconnect: { courseId },
        },
      },
    });
  }
}
