import { StudentRepository } from "../repositories/studentRepository";
import { AssignmentService } from "./assignmentService";
import { CourseRepository } from "../repositories/courseRepository";
import { Student } from "@prisma/client";

export class StudentService {
  constructor(
    private studentRepository: StudentRepository,
    private assignmentService: AssignmentService,
    private courseRepository: CourseRepository,
  ) {}

  public async getAllStudents(): Promise<Student[]> {
    return this.studentRepository.findAll();
  }

  public async getStudentById(id: number): Promise<Student | null> {
    return this.studentRepository.findById(id);
  }

  public async getStudentByUserName(userName: string): Promise<Student | null> {
    return this.studentRepository.getStudentByUserName(userName);
  }

  public async addStudent(data: {
    userName: string;
    name: string;
  }): Promise<Student> {
    return this.studentRepository.createStudent(data);
  }

  public async hasStudentSubmitted(
    student: Student,
    assignmentId: number,
  ): Promise<boolean> {
    const submissions = await this.studentRepository.getSubmissionsByStudentId(
      student.id,
    );
    return submissions.some((sub) => sub.assignmentId === assignmentId);
  }

  public async getAllSubmissionsByStudent(student: Student) {
    const submissions =
      await this.studentRepository.getSubmissionsWithAssignment(student.id);
    return submissions.map((sub) => sub.Assignment);
  }

  public async getGradeForAssignment(
    student: Student,
    assignmentId: number,
  ): Promise<number> {
    const submissions = await this.studentRepository.getSubmissionsByStudentId(
      student.id,
    );
    const submission = submissions.find(
      (sub) => sub.assignmentId === assignmentId,
    );
    return submission ? submission.assignmentGrade : -1;
  }

  public async getAverageGradeForStudent(student: Student): Promise<number> {
    const submissions = await this.studentRepository.getSubmissionsByStudentId(
      student.id,
    );
    if (submissions.length === 0) return 0;
    const total = submissions.reduce(
      (acc, sub) => acc + sub.assignmentGrade,
      0,
    );
    return total / submissions.length;
  }

  public async getAverageFromCourse(
    course: { courseId: number; courseName: string },
    student: Student,
  ): Promise<number> {
    const submissions =
      await this.studentRepository.prisma.assignmentSubmission.findMany({
        where: {
          studentId: student.id,
          Assignment: { courseId: course.courseId },
        },
        include: { Assignment: true },
      });
    if (submissions.length === 0) return 0;
    const total = submissions.reduce(
      (acc, sub) => acc + sub.assignmentGrade,
      0,
    );
    return total / submissions.length;
  }

  public async getAllCoursesForStudent(student: Student) {
    return this.studentRepository.getCoursesByStudentId(student.id);
  }

  public async removeSelfFromCourse(
    userName: string,
    courseId: number,
  ): Promise<boolean> {
    try {
      await this.studentRepository.removeCourse(userName, courseId);
      return true;
    } catch {
      return false;
    }
  }

  public async getStudentsByCourse(courseId: number): Promise<Student[]> {
    return this.studentRepository.getStudentsByCourse(courseId);
  }

  public async getAllGradesGroupedByCourse(userName: string) {
    const student = await this.studentRepository.getStudentByUserName(userName);
    if (!student) {
      throw new Error("Student not found");
    }

    const courseIds =
      await this.assignmentService.getAllCourseIdsByStudent(student);
    const result = [];

    for (const courseId of courseIds) {
      const course = await this.courseRepository.findByCourseId(courseId);
      const assignments =
        await this.assignmentService.getAllAssignmentsByCourseId(courseId);
      const grades = await this.assignmentService.getGradesForStudentInCourse(
        student.id,
        courseId,
      );
      const assignmentGrades = assignments.map((a) => {
        const gradeEntry = grades.find(
          (g: { assignmentId: number; assignmentGrade: number }) =>
            g.assignmentId === a.assignmentId,
        );
        return {
          assignmentName: a.assignmentName,
          grade: gradeEntry?.assignmentGrade ?? null,
        };
      });

      if (!course) {
        throw new Error(`Course with ID ${courseId} not found.`);
      }

      result.push({
        courseName: course.courseName,
        assignments: assignmentGrades,
      });
    }

    return result;
  }
}
