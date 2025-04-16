import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { CourseRepository } from "../repositories/courseRepository";
import { StudentRepository } from "../repositories/studentRepository";
import { AssignmentRepository } from "../repositories/assignmentRepository";
import { SubmissionRepository } from "../repositories/submissionRepository";
import { CourseService } from "../services/courseService";
import { AssignmentService } from "../services/assignmentService";
import { CourseController } from "../controllers/courseController";

const prisma = new PrismaClient();

const courseRepository = new CourseRepository(prisma);
const studentRepository = new StudentRepository(prisma);
const assignmentRepository = new AssignmentRepository(prisma);
const submissionRepository = new SubmissionRepository(prisma);

const assignmentService = new AssignmentService(
  assignmentRepository,
  submissionRepository,
);

const courseService = new CourseService(
  prisma,
  courseRepository,
  assignmentService,
  studentRepository,
);

const courseController = new CourseController(courseService);

const router = Router();

router.post("", courseController.createCourse);
router.get("", courseController.getAllCourses);
router.get("/instructor/:userName", courseController.getMyCourses);
router.post("/:courseId/:userName", courseController.registerStudentInCourse);
router.get("/:courseId/students", courseController.getAllStudentsByCourseId);
router.get(
  "/:courseId/students/grades",
  courseController.getStudentByGradeCriteria,
);
router.get(
  "/:courseId/assignments",
  courseController.getAllAssignmentsByCourseId,
);
router.delete(
  "/:courseId/students/:studentId",
  courseController.deleteStudentFromCourse,
);
router.delete("/:courseId", courseController.deleteCourse);
router.get("/courses/:courseId", courseController.getCourseById);
router.patch("/:courseId", courseController.updateCourseDetails);

export default router;
