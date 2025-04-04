import { PrismaClient } from '@prisma/client';
import DATABASE_URL from '../environment/database.env'; // importa a URL configurada

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL, // usa a URL corretamente
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  if (!global.prisma) {
    global.prisma = prismaClient;
  }
}

export const prisma = global.prisma || prismaClient;
