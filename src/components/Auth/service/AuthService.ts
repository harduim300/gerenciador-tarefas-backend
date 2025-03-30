import { prisma } from "../../../libs/prisma";

export class AuthService {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    });
  }
}