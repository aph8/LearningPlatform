import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { SubmissionRepository } from "../repositories/submissionRepository";
import { SubmissionService } from "../services/submissionService";
import { SubmissionController } from "../controllers/submissionController";
import { StudentRepository } from "../repositories/studentRepository";
import { StudentService } from "../services/studentService";
import { AssignmentRepository } from "../repositories/assignmentRepository";
import { AssignmentService } from "../services/assignmentService";
import { CourseRepository } from "../repositories/courseRepository";

const prisma = new PrismaClient();

const submissionRepository = new SubmissionRepository(prisma);
const studentRepository = new StudentRepository(prisma);
const assignmentRepository = new AssignmentRepository(prisma);
const courseRepository = new CourseRepository(prisma);

const assignmentServiceInstance = new AssignmentService(
  assignmentRepository,
  submissionRepository,
);

const submissionService = new SubmissionService(submissionRepository);

const studentService = new StudentService(
  studentRepository,
  assignmentServiceInstance,
  courseRepository,
);

const submissionController = new SubmissionController(
  submissionService,
  studentService,
  assignmentServiceInstance,
);

const router = Router();

router.get("/average/:assignmentId", submissionController.averageGrade);
router.get("/grades/:assignmentId", submissionController.grades);
router.get("/status/:assignmentId", submissionController.hasBeenSubmitted);
router.get(
  "/grades/student/:assignmentId",
  submissionController.assignmentGradesByStudent,
);
router.get(
  "/allgrades/:assignmentId",
  submissionController.allGradesForAssignment,
);
router.post("", submissionController.submitAssignment);

export default router;
