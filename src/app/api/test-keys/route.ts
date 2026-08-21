import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    environment: {
      // Database
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasDbHost: !!process.env.DATABASE_URL_PGHOST,
      hasDbUser: !!process.env.DATABASE_URL_PGUSER,
      hasDbDatabase: !!process.env.DATABASE_URL_PGDATABASE,
      hasDbPort: !!process.env.DATABASE_URL_PGPORT,
      
      // AWS
      hasAwsRegion: !!process.env.DATABASE_URL_AWS_REGION,
      hasAwsAccountId: !!process.env.DATABASE_URL_AWS_ACCOUNT_ID,
      hasAwsResourceArn: !!process.env.DATABASE_URL_AWS_RESOURCE_ARN,
      hasAwsRoleArn: !!process.env.DATABASE_URL_AWS_ROLE_ARN,
      
      // AI Keys
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasOpenAiKey: !!process.env.OPENAI_API_KEY,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasGroqKey: !!process.env.GROQ_API_KEY,
      
      // Services
      hasE2bKey: !!process.env.E2B_API_KEY,
      hasInngestEventKey: !!process.env.INNGEST_EVENT_KEY,
      hasInngestSigningKey: !!process.env.INNGEST_SIGNING_KEY,
      
      // App
      hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      
      // Partial values (for debugging - first 10 chars only)
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + "...",
      geminiKeyPrefix: process.env.GEMINI_API_KEY?.substring(0, 10) + "...",
      e2bKeyPrefix: process.env.E2B_API_KEY?.substring(0, 10) + "...",
    },
    timestamp: new Date().toISOString(),
  });
}
