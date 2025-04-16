import { PrismaClient, Course, Student } from "@prisma/client";

export class CourseRepository {
  constructor(private prisma: PrismaClient) {}

  public async createCourse(data: {
    courseName: string;
    instructor: string;
    description: string;
  }): Promise<Course> {
    return this.prisma.course.create({ data });
  }

  public async findAllCourses(): Promise<Course[]> {
    return this.prisma.course.findMany();
  }

  public async findByCourseId(courseId: number): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { courseId },
      include: { students: true, assignments: true },
    });
  }

  async enrollStudent(courseId: number, userName: string): Promise<Course> {
    const student = await this.prisma.student.findUnique({
      where: { userName },
    });
    if (!student) {
      throw new Error("Student not found");
    }

    return this.prisma.course.update({
      where: { courseId },
      data: {
        students: {
          connect: { id: student.id },
        },
      },
    });
  }

  public async findStudentsByCourseId(courseId: number): Promise<Student[]> {
    const course = await this.prisma.course.findUnique({
      where: { courseId },
      include: { students: true },
    });
    return course?.students || [];
  }

  public async findCoursesByStudentId(studentId: number): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: {
        students: {
          some: { id: studentId },
        },
      },
    });
  }

  public async findByInstructor(userName: string): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: { instructor: userName },
    });
  }

  public async updateCourse(
    courseId: number,
    data: Partial<Omit<Course, "courseId">>,
  ): Promise<Course> {
    return this.prisma.course.update({
      where: { courseId },
      data,
    });
  }

  public async deleteCourse(courseId: number): Promise<void> {
    await this.prisma.course.delete({
      where: { courseId },
    });
  }

  public async removeStudentFromCourse(
    courseId: number,
    studentId: number,
  ): Promise<Course> {
    return this.prisma.course.update({
      where: { courseId },
      data: {
        students: {
          disconnect: { id: studentId },
        },
      },
    });
  }
}
