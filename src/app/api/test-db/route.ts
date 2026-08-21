import { NextResponse } from "next/server";
import { createClient } from "@vercel/postgres";

export async function GET() {
  try {
    const connectionString = 
      process.env.POSTGRES_URL_NON_POOLING || 
      process.env.DATABASE_URL || 
      process.env.POSTGRES_URL;
      
    const client = createClient({ connectionString });
    await client.connect();
    
    // Test database connection
    const result = await client.query("SELECT 1 as test");
    
    await client.end();
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      result: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const err = error as { message: string; code?: string };
    console.error("Database connection error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        code: err.code,
        details: {
          hasHost: !!process.env.DATABASE_URL_PGHOST,
          hasUser: !!process.env.DATABASE_URL_PGUSER,
          hasDatabase: !!process.env.DATABASE_URL_PGDATABASE,
          hasPostgresUrl: !!process.env.POSTGRES_URL,
          hasPostgresUrlNonPooling: !!process.env.POSTGRES_URL_NON_POOLING,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasAwsRegion: !!process.env.DATABASE_URL_AWS_REGION,
          hasAwsAccountId: !!process.env.DATABASE_URL_AWS_ACCOUNT_ID,
        },
      },
      { status: 500 }
    );
  }
}
