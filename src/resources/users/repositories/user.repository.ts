import { Prisma, PrismaClient, User } from "@prisma/client";

export class UserRepository {
  private prisma: PrismaClient;

  /**
   * Construct the repository
   */
  public constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Find a user by their email address
   */
  public async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  /**
   * Create a new user
   */
  public async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }
  
}
