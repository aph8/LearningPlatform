import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../repositories/userRepository";
import { UserService } from "../services/userService";
import { UserController } from "../controllers/userController";
import upload from "../middleware/uploadMiddleware";

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

router.post("/register", userController.register);
router.get("/", userController.getAllUsers);
router.get("/:userName", userController.getUserInfo);
router.delete("/:userName", userController.deleteAccount);
router.patch(
  "/:userName",
  upload.single("profileImage"),
  userController.updateUser,
);
router.get("/:userName/profileImage", userController.getProfileImage);
router.post(
  "/upload/:userName",
  upload.single("image"),
  userController.uploadProfileImage,
);

export default router;
