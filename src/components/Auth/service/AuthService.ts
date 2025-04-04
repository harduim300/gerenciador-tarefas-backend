import { prisma } from "../../../libs/prisma";
import * as argon2 from 'argon2';
import { createJWT } from '../../../libs/jwt';
import { authSigninSchema } from '../../../schemas/auth-signin';
import { authSignupSchema } from '../../../schemas/auth-signup';

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

  async signin(email: string, password: string) {
    const user = await this.findByEmail(email);
    
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      throw new Error('Email ou senha inválidos');
    }

    const token = createJWT(user.id);
    return { token, user };
  }

  async signup(data: { name: string; email: string; password: string }) {
    const validatedData = authSignupSchema.parse(data);
    const { name, email, password } = validatedData;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return user;
  }

  async verify(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('Acesso Negado');
    }
    return true;
  }
}