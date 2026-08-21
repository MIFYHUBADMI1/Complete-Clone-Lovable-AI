import { PrismaClient } from "@/generated/prisma";
import { getPool } from "./aws-db";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Configure Prisma with AWS IAM authentication
async function createPrismaClient() {
  const pool = await getPool();
  
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

export const prisma = globalForPrisma.prisma || await createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

