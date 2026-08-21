import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { getPool } from "./aws-db";

const globalForPrisma = global as unknown as { 
  prismaClient: PrismaClient | null;
};

async function initPrisma() {
  try {
    const pool = await getPool();
    const adapter = new PrismaPg(pool);
    
    return new PrismaClient({ 
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (error) {
    console.error("Failed to initialize Prisma with IAM adapter:", error);
    // Fallback to basic client
    return new PrismaClient();
  }
}

// Create client lazily
if (!globalForPrisma.prismaClient && typeof window === 'undefined') {
  globalForPrisma.prismaClient = await initPrisma();
}

export const prisma = globalForPrisma.prismaClient!;

