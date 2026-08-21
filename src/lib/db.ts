import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { getPool } from "./aws-db";

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient;
  prismaPromise: Promise<PrismaClient> | null;
};

async function createPrismaClient() {
  const pool = await getPool();
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

if (!globalForPrisma.prismaPromise) {
  globalForPrisma.prismaPromise = createPrismaClient();
}

export const prisma = await globalForPrisma.prismaPromise;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

