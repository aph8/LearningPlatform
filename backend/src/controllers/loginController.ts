import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { UserService } from "../services/userService";

const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export class LoginController {
  constructor(private userService: UserService) {}

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = LoginSchema.parse(req.body);
      const { username, password } = parsed;
      const user = await this.userService.getUserByUserName(username);
      if (!user) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
      }

      res
        .status(200)
        .json({ message: "Login successful", isInstructor: user.isInstructor });
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
