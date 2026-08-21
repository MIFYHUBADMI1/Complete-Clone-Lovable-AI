import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Database connection error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        details: {
          hasHost: !!process.env.DATABASE_URL_PGHOST,
          hasUser: !!process.env.DATABASE_URL_PGUSER,
          hasDatabase: !!process.env.DATABASE_URL_PGDATABASE,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasAwsRegion: !!process.env.DATABASE_URL_AWS_REGION,
          hasAwsAccountId: !!process.env.DATABASE_URL_AWS_ACCOUNT_ID,
        },
      },
      { status: 500 }
    );
  }
}
