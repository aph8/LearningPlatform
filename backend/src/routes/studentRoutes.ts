import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { StudentRepository } from "../repositories/studentRepository";
import { AssignmentRepository } from "../repositories/assignmentRepository";
import { CourseRepository } from "../repositories/courseRepository";
import { SubmissionRepository } from "../repositories/submissionRepository";
import { StudentService } from "../services/studentService";
import { AssignmentService } from "../services/assignmentService";
import { CourseService } from "../services/courseService";
import { StudentController } from "../controllers/studentController";

const prisma = new PrismaClient();

const studentRepository = new StudentRepository(prisma);
const assignmentRepository = new AssignmentRepository(prisma);
const courseRepository = new CourseRepository(prisma);
const submissionRepository = new SubmissionRepository(prisma);

const assignmentService = new AssignmentService(
  assignmentRepository,
  submissionRepository,
);

const studentService = new StudentService(
  studentRepository,
  assignmentService,
  courseRepository,
);
const courseService = new CourseService(
  prisma,
  courseRepository,
  assignmentService,
  studentRepository,
);

const studentController = new StudentController(studentService, courseService);

const router = Router();

router.get("/student/:userName", studentController.getStudentByUserName);
router.get(
  "/student/:userName/assignments/:assignmentId",
  studentController.hasStudentSubmitted,
);
router.get(
  "/student/:userName/average",
  studentController.getAverageGradeForStudent,
);
router.get(
  "/:userName/grades-overview",
  studentController.getAllGradesGroupedByCourse,
);

export default router;
