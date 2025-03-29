import { prisma } from '../../../libs/prisma';

export class UserService {
  async createUser(data: { name: string; email: string; password: string }) {
    return prisma.user.create({
      data
    });
  }

  async getAllUsers() {
    return prisma.user.findMany();
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  async updateUser(id: string, data: { name?: string; email?: string; password?: string }) {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id }
    });
  }
}