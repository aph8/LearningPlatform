import { UserRepository } from "../repositories/userRepository";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  public async registerUser(data: Omit<User, "Student">): Promise<User> {
    const hashed = await bcrypt.hash(data.password, 10);
    return this.userRepository.createUser({
      ...data,
      password: hashed,
    });
  }

  public async getUserByUserName(userName: string): Promise<User | null> {
    return this.userRepository.findByUserName(userName);
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  public async doesUserExistByEmail(email: string): Promise<boolean> {
    return this.userRepository.existsByEmail(email);
  }

  public async changePassword(user: User, newPassword: string): Promise<User> {
    const hashed = await bcrypt.hash(newPassword, 10);
    return this.userRepository.updateUser(user.userName, { password: hashed });
  }

  public async deleteUser(user: User): Promise<User> {
    return this.userRepository.deleteUser(user.userName);
  }

  public async updateRecoveryEmail(
    userName: string,
    recoveryEmail: string,
  ): Promise<User> {
    const user = await this.getUserByUserName(userName);
    if (!user) {
      throw new Error("User not found");
    }
    return this.userRepository.updateUser(userName, { recoveryEmail });
  }

  public async addUser(user: User): Promise<User> {
    return this.userRepository.updateUser(user.userName, user);
  }

  public async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAllUsers();
  }
}
