import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { getPool } from "./aws-db";

const globalForPrisma = global as unknown as { 
  prismaClient: PrismaClient | null;
};

async function initPrisma() {
  // Skip initialization during build
  if (process.env.VERCEL_ENV === undefined && process.env.NODE_ENV === 'production') {
    return new PrismaClient();
  }

  const pool = await getPool();
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

// Create client lazily
if (!globalForPrisma.prismaClient && typeof window === 'undefined') {
  try {
    globalForPrisma.prismaClient = await initPrisma();
  } catch (err) {
    console.error("Failed to initialize Prisma:", err);
    // Fallback to basic client for build time
    globalForPrisma.prismaClient = new PrismaClient();
  }
}

export const prisma = globalForPrisma.prismaClient!;

