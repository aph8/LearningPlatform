import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AssignmentRepository } from "../repositories/assignmentRepository";
import { AssignmentService } from "../services/assignmentService";
import { AssignmentController } from "../controllers/assignmentController";
import { SubmissionRepository } from "../repositories/submissionRepository";
import { SubmissionService } from "../services/submissionService";

const prisma = new PrismaClient();

const assignmentRepository = new AssignmentRepository(prisma);
const submissionRepository = new SubmissionRepository(prisma);

const assignmentService = new AssignmentService(
  assignmentRepository,
  submissionRepository,
);

const submissionService = new SubmissionService(submissionRepository);

const assignmentController = new AssignmentController(
  assignmentService,
  submissionService,
);

const router = Router();

router.post("", assignmentController.createAssignment);
router.get("", assignmentController.getAllAssignments);
router.get(
  "/:assignmentId/can-unpublish",
  assignmentController.getCanUnpublish,
);
router.get("/:assignmentId", assignmentController.getAssignmentById);
router.get("/courses/:courseId", assignmentController.getAssignmentsByCourse);
router.get("/:assignmentId/can-delete", assignmentController.getCanDelete);
router.patch("/:assignmentId", assignmentController.editAssignment);
router.delete("/:assignmentId", assignmentController.deleteAssignment);

export default router;
