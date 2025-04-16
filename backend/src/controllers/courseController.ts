import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { CourseService } from "../services/courseService";
import { CourseRequest } from "../dtos/courseRequest";
import { Course, Student } from "@prisma/client";

const CourseRequestSchema = z.object({
  courseName: z.string().min(1, "Course name is required"),
  description: z.string().optional().default(""),
  instructor: z.string().min(1, "Instructor is required"),
});

export class CourseController {
  constructor(private courseService: CourseService) {}

  public createCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = CourseRequestSchema.parse(req.body);
      const course = await this.courseService.addCourse(parsed);
      res.status(200).json({ message: "Course created", data: course });
    } catch (err) {
      next(err);
    }
  };

  public getAllCourses = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const courses = await this.courseService.getAllCourses();
      res.status(200).json(courses);
    } catch (err) {
      next(err);
    }
  };

  public getMyCourses = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userName } = req.params;

      const user = await this.courseService.getUserByUserName(userName);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      let courses: Course[] = [];

      if (user.isInstructor) {
        courses = await this.courseService.getAllCoursesByInstructor(userName);
      } else {
        const student = await this.courseService.getStudentByUserName(userName);
        if (!student) {
          res.status(404).json({ message: "Student not found" });
          return;
        }
        courses = await this.courseService.getAllCoursesByStudentId(student.id);
      }

      res.status(200).json(courses);
    } catch (err) {
      next(err);
    }
  };

  public registerStudentInCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId, userName } = req.params;
      const course = await this.courseService.getCourseById(Number(courseId));
      if (!course) {
        res.status(400).json({ message: "Course not found" });
        return;
      }

      const student = {
        id: Number(userName.replace(/\D/g, "")) || 0,
        userName,
        name: "Dummy Student",
      };
      const currentStudents = await this.courseService.getAllStudents(
        Number(courseId),
      );
      if (currentStudents.some((s: Student) => s.id === student.id)) {
        res.status(400).json({ message: "Student is already in this course" });
        return;
      }
      await this.courseService.registerStudentToCourse(student, course);
      res.status(200).json({ message: "Student registered successfully" });
    } catch (err) {
      next(err);
    }
  };

  public getAllStudentsByCourseId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const course = await this.courseService.getCourseById(Number(courseId));
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      const students = await this.courseService.getAllStudents(
        Number(courseId),
      );
      res.status(200).json(students);
    } catch (err) {
      next(err);
    }
  };

  public getStudentByGradeCriteria = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const gradeQuery = req.query.grade;
      const grade = typeof gradeQuery === "string" ? Number(gradeQuery) : 0;
      const course = await this.courseService.getCourseById(Number(courseId));
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      const students = await this.courseService.getAllStudents(
        Number(courseId),
      );
      const studentGrades = await this.courseService.calculateStudentGrades(
        Number(courseId),
        students,
      );
      const filtered = studentGrades.filter((s) => s.averageGrade <= grade);
      res.status(200).json(filtered);
    } catch (err) {
      next(err);
    }
  };

  public getAllAssignmentsByCourseId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const course = await this.courseService.getCourseById(Number(courseId));
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      const assignments = await this.courseService.getAllAssignments(
        Number(courseId),
      );
      res.status(200).json(assignments);
    } catch (err) {
      next(err);
    }
  };

  public deleteStudentFromCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId, studentId } = req.params;
      const course = await this.courseService.getCourseById(Number(courseId));
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      const removed = await this.courseService.removeStudentFromCourse(
        Number(courseId),
        Number(studentId),
      );
      if (removed) {
        res.status(200).json({ message: "Student removed from course" });
      } else {
        res.status(404).json({ message: "Student not found in this course" });
      }
    } catch (err) {
      next(err);
    }
  };

  public getCourseById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const courseId = Number(req.params.courseId);

      if (isNaN(courseId) || courseId <= 0) {
        res.status(400).json({ message: "Invalid course ID format" });
        return;
      }

      const course = await this.courseService.getCourseById(courseId);
      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: "Course not found" });
      }
    } catch (err) {
      next(err);
    }
  };

  public updateCourseDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const updates: CourseRequest = req.body;

      const courseIdNum = Number(courseId);
      if (isNaN(courseIdNum)) {
        res.status(400).json({ message: "Invalid course ID" });
        return;
      }

      const updateData: Partial<{ courseName: string; description: string }> =
        {};

      if (updates.courseName && updates.courseName.trim() !== "") {
        updateData.courseName = updates.courseName.trim();
      }

      if (updates.description && updates.description.trim() !== "") {
        updateData.description = updates.description.trim();
      }

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: "No fields provided to update" });
        return;
      }

      const updatedCourse = await this.courseService.updateCourseDetails(
        courseIdNum,
        updateData,
      );
      res
        .status(200)
        .json({ message: "Course updated successfully", data: updatedCourse });
    } catch (err) {
      next(err);
    }
  };

  public deleteCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      await this.courseService.deleteCourse(Number(courseId));
      res.status(200).json({ message: "Course deleted" });
    } catch (err) {
      next(err);
    }
  };
}
