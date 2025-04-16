import { PrismaClient, User } from "@prisma/client";

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  public async createUser(data: Omit<User, "Student">): Promise<User> {
    return this.prisma.user.create({ data });
  }

  public async findByUserName(userName: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { userName } });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  }

  public async updateUser(
    userName: string,
    data: Partial<User>,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { userName },
      data,
    });
  }

  public async deleteUser(userName: string): Promise<User> {
    return this.prisma.user.delete({ where: { userName } });
  }

  public async findAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
