import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../repositories/userRepository";
import { UserService } from "../services/userService";
import { LoginController } from "../controllers/loginController";

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const loginController = new LoginController(userService);

const router = Router();
router.post("/", loginController.login);

export default router;
