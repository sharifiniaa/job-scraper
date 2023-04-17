import { PrismaClient } from '../../../prisma/generated/prisma-client-js'

const prisma = new PrismaClient();

(async function prismaConnection() {
  try {
    await prisma.$connect();
    console.log('Connected to database successfully!');
  } catch (e: any) {
    console.error(`Error connecting to database: ${e.message}`);
  } finally {
    await prisma.$disconnect();
  }
})();

export default prisma;
