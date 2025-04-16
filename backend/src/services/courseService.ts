import { CourseRepository } from "../repositories/courseRepository";
import { StudentRepository } from "../repositories/studentRepository";
import { AssignmentService } from "./assignmentService";
import { Course, Student, Assignment } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export class CourseService {
  constructor(
    private prisma: PrismaClient,
    private courseRepository: CourseRepository,
    private assignmentService: AssignmentService,
    private studentRepository: StudentRepository,
  ) {}

  public async addCourse(data: {
    courseName: string;
    instructor: string;
    description: string;
  }): Promise<Course> {
    return this.courseRepository.createCourse(data);
  }

  public async getAllCourses(): Promise<Course[]> {
    return this.courseRepository.findAllCourses();
  }

  public async getCourseById(courseId: number): Promise<Course | null> {
    return this.courseRepository.findByCourseId(courseId);
  }

  public async getAllStudents(courseId: number): Promise<Student[]> {
    return this.courseRepository.findStudentsByCourseId(courseId);
  }

  public async getAllAssignments(courseId: number): Promise<Assignment[]> {
    return this.assignmentService.getAllAssignmentsByCourseId(courseId);
  }

  public async getAllCoursesByInstructor(userName: string): Promise<Course[]> {
    return this.courseRepository.findByInstructor(userName);
  }

  public async getAllCoursesByStudentId(studentId: number): Promise<Course[]> {
    return this.courseRepository.findCoursesByStudentId(studentId);
  }

  public async updateCourseName(
    courseId: number,
    newCourseName: string,
  ): Promise<Course> {
    return this.courseRepository.updateCourse(courseId, {
      courseName: newCourseName,
    });
  }

  public async updateCourseDescription(
    courseId: number,
    newDescription: string,
  ): Promise<Course> {
    return this.courseRepository.updateCourse(courseId, {
      description: newDescription,
    });
  }

  public async updateCourseDetails(
    courseId: number,
    updates: Partial<{ courseName: string; description: string }>,
  ): Promise<Course> {
    return this.courseRepository.updateCourse(courseId, updates);
  }

  public async registerStudentToCourse(
    student: { id: number; userName: string; name: string },
    course: Course,
  ): Promise<Course> {
    return this.courseRepository.enrollStudent(
      course.courseId,
      student.userName,
    );
  }

  public async calculateStudentGrades(
    courseId: number,
    students: Student[],
  ): Promise<
    {
      studentId: number;
      name: string;
      userName: string;
      averageGrade: number;
      submissionCount: number;
    }[]
  > {
    const results = await Promise.all(
      students.map(async (student) => {
        const submissions =
          await this.assignmentService.getSubmissionsByCourseAndStudent(
            courseId,
            student.id,
          );
        const grades = submissions.map(
          (s: { assignmentGrade: number }) => s.assignmentGrade,
        );
        const averageGrade = grades.length
          ? grades.reduce((a, b) => a + b, 0) / grades.length
          : 0;
        return {
          studentId: student.id,
          name: student.name,
          userName: student.userName,
          averageGrade,
          submissionCount: submissions.length,
        };
      }),
    );
    return results;
  }

  public async removeStudentFromCourse(
    courseId: number,
    studentId: number,
  ): Promise<boolean> {
    try {
      await this.courseRepository.removeStudentFromCourse(courseId, studentId);
      return true;
    } catch {
      return false;
    }
  }
  async getUserByUserName(userName: string) {
    return this.prisma.user.findUnique({ where: { userName } });
  }

  async getStudentByUserName(userName: string) {
    return this.prisma.student.findUnique({ where: { userName } });
  }

  public async deleteCourse(courseId: number): Promise<void> {
    return this.courseRepository.deleteCourse(courseId);
  }
}
