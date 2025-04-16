import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../repositories/userRepository";
import { UserService } from "../services/userService";
import { StudentRepository } from "../repositories/studentRepository";
import { StudentService } from "../services/studentService";
import { SignupController } from "../controllers/signupController";
import { AssignmentRepository } from "../repositories/assignmentRepository";
import { AssignmentService } from "../services/assignmentService";
import { CourseRepository } from "../repositories/courseRepository";
import { SubmissionRepository } from "../repositories/submissionRepository";

const prisma = new PrismaClient();

const userRepository = new UserRepository(prisma);
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

const userService = new UserService(userRepository);
const signupController = new SignupController(userService, studentService);

const router = Router();
router.post("/", signupController.signUp);

export default router;
