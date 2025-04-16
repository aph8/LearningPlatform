import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { UserService } from "../services/userService";
import { StudentService } from "../services/studentService";
import { User } from "@prisma/client";

const SignupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z
    .string()
    .min(6, "Confirm password must be at least 6 characters"),
  isInstructor: z.boolean().optional().default(false),
});

export class SignupController {
  constructor(
    private userService: UserService,
    private studentService: StudentService,
  ) {}

  public signUp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = SignupSchema.parse(req.body);
      const { username, name, email, password, confirmPassword, isInstructor } =
        parsed;

      if (password !== confirmPassword) {
        res.status(400).json({ message: "Passwords do not match" });
        return;
      }

      const exists = await this.userService.doesUserExistByEmail(email);
      if (exists) {
        res.status(400).json({ message: "Email already exists" });
        return;
      }

      const newUser: User = await this.userService.registerUser({
        userName: username,
        name,
        email,
        password,
        isInstructor,
        profileImagePath: null,
        recoveryEmail: null,
      });

      if (!isInstructor) {
        await this.studentService.addStudent({
          userName: newUser.userName,
          name: newUser.name,
        });
      }

      res.status(200).json(newUser);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Validation failed", issues: err.errors });
        return;
      }
      next(err);
    }
  };
}
