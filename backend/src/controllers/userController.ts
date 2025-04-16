import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import { z } from "zod";
import cloudinary from "../utils/cloudinary";

const CreateUserSchema = z.object({
  userName: z.string().min(1, "userName is required"),
  name: z.string().min(1, "name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profileImagePath: z
    .string()
    .optional()
    .transform((val) => val ?? null),
  recoveryEmail: z
    .string()
    .optional()
    .transform((val) => val ?? null),
});

const UpdateUserSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    recoveryEmail: z.string().email().optional(),
  })
  .partial();

export class UserController {
  constructor(private userService: UserService) {}

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsedBody = CreateUserSchema.parse(req.body);
      const userData: Omit<User, "Student"> = {
        ...parsedBody,
        isInstructor: false,
      };
      const newUser = await this.userService.registerUser(userData);
      res
        .status(201)
        .json({ data: newUser, message: "User created successfully" });
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

  public updatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { newPassword, oldPassword } = req.body;
      const { userName } = req.params;
      const user = await this.userService.getUserByUserName(userName);
      if (!user) {
        res.status(404).json({ status: "User not found" });
        return;
      }
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) {
        res.status(400).json({ status: "Wrong password" });
        return;
      }
      await this.userService.changePassword(user, newPassword);
      res.status(200).json({ status: "Password changed successfully" });
    } catch (err) {
      next(err);
    }
  };

  public deleteAccount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userName } = req.params;
      const user = await this.userService.getUserByUserName(userName);
      if (!user) {
        res.status(404).json({ status: "User not found" });
        return;
      }
      const exists = await this.userService.doesUserExistByEmail(user.email);
      if (!exists) {
        res.status(400).json({ status: "Wrong email" });
        return;
      }
      await this.userService.deleteUser(user);
      res.status(200).json({ status: "Account deleted successfully" });
    } catch (err) {
      next(err);
    }
  };

  public updateRecoveryEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { recoveryEmail } = req.body;
      const { userName } = req.params;
      await this.userService.updateRecoveryEmail(userName, recoveryEmail);
      res.status(200).json({ status: "Recovery email updated successfully" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        next(err);
      } else {
        res.status(400).json({ status: "Unknown error occurred" });
      }
    }
  };

  public uploadProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userName } = req.params;
      const file = req.file;
      if (!file) {
        res
          .status(400)
          .json({ status: "File is empty. Please select an image." });
        return;
      }

      const user = await this.userService.getUserByUserName(userName);
      if (!user) {
        res.status(404).json({ status: "User not found" });
        return;
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "profile-images",
        public_id: `${userName}_${Date.now()}`,
      });

      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting local file:", err);
      });

      const newProfileImagePath = result.secure_url;

      await this.userService.addUser({
        ...user,
        profileImagePath: newProfileImagePath,
      });

      res.status(200).json({
        status: "Profile image uploaded successfully",
        imagePath: newProfileImagePath,
      });
    } catch (err) {
      next(err);
    }
  };

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userName } = req.params;
      const updateData = UpdateUserSchema.parse(req.body);

      const user = await this.userService.getUserByUserName(userName);
      if (!user) {
        res.status(404).json({ status: "User not found" });
        return;
      }

      const updatedUser = await this.userService.addUser({
        ...user,
        ...updateData,
      });
      res.status(200).json(updatedUser);
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

  public getProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userName } = req.params;
      const user = await this.userService.getUserByUserName(userName);
      if (!user) {
        res.status(404).json({ status: "User not found" });
        return;
      }
      if (!user.profileImagePath) {
        res.status(404).json({ status: "No profile image found" });
        return;
      }
      res.status(200).json({
        status: "Profile image found",
        imagePath: user.profileImagePath,
      });
    } catch (err) {
      next(err);
    }
  };

  public getUserInfo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userName } = req.params;
      const user = await this.userService.getUserByUserName(userName);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ status: "User not found" });
      }
    } catch (err) {
      next(err);
    }
  };

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };
}
