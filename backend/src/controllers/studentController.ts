import { Assignment } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { StudentService } from "../services/studentService";
import { CourseService } from "../services/courseService";

export class StudentController {
  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
  ) {}

  public getStudentByUserName = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userName } = req.params;
      const student = await this.studentService.getStudentByUserName(userName);
      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }
      res.status(200).json(student);
    } catch (err) {
      next(err);
    }
  };

  public hasStudentSubmitted = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userName, assignmentId } = req.params;
      const student = await this.studentService.getStudentByUserName(userName);
      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }
      const submitted = await this.studentService.hasStudentSubmitted(
        student,
        Number(assignmentId),
      );
      res.json({ hasSubmitted: submitted });
    } catch (err) {
      next(err);
    }
  };

  public getStudentsSubmittedAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userName } = req.params;
      const student = await this.studentService.getStudentByUserName(userName);
      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }
      const assignments: Assignment[] =
        await this.studentService.getAllSubmissionsByStudent(student);
      res.json(assignments);
    } catch (err) {
      next(err);
    }
  };

  public getGradeForAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userName, assignmentId } = req.params;
      const student = await this.studentService.getStudentByUserName(userName);
      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }
      const grade = await this.studentService.getGradeForAssignment(
        student,
        Number(assignmentId),
      );
      res.json({ grade });
    } catch (err) {
      next(err);
    }
  };

  public getAverageGradeForStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userName } = req.params;
      const student = await this.studentService.getStudentByUserName(userName);
      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }
      const average =
        await this.studentService.getAverageGradeForStudent(student);
      res.json({ average });
    } catch (err) {
      next(err);
    }
  };

  public getAverageGradeForStudentCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const { userName } = req.query;
      if (!userName || typeof userName !== "string") {
        res
          .status(400)
          .json({ message: "userName query parameter is required" });
        return;
      }
      const course = await this.courseService.getCourseById(Number(courseId));
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      const student = await this.studentService.getStudentByUserName(userName);
      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }
      const average = await this.studentService.getAverageFromCourse(
        course,
        student,
      );
      res.json({ average });
    } catch (err) {
      next(err);
    }
  };

  public getFilteredAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userName } = req.params;
      const student = await this.studentService.getStudentByUserName(userName);
      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }

      const courses =
        await this.studentService.getAllCoursesForStudent(student);
      let assignments: Assignment[] = [];
      for (const course of courses) {
        const courseAssignments = await this.courseService.getAllAssignments(
          course.courseId,
        );
        assignments = assignments.concat(courseAssignments);
      }
      res.json(assignments);
    } catch (err) {
      next(err);
    }
  };

  public leaveCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userName, courseId } = req.params;
      const removed = await this.studentService.removeSelfFromCourse(
        userName,
        Number(courseId),
      );
      if (removed) {
        res.json({ message: "Successfully removed from the course." });
      } else {
        res.status(400).json({
          message:
            "Failed to remove from the course. Either the student or course was not found.",
        });
      }
    } catch (err) {
      next(err);
    }
  };

  public getAllGradesGroupedByCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userName } = req.params;
      const result =
        await this.studentService.getAllGradesGroupedByCourse(userName);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
