import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb';

/**
 * Health check endpoint to verify environment variables and MongoDB connection
 * Access at: /api/health
 */
export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    envVars: {
      MONGODB_URI: !!process.env.MONGODB_URI,
      MONGODB_URI_prefix: process.env.MONGODB_URI?.substring(0, 30) + "...",
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
      GROQ_API_KEY: !!process.env.GROQ_API_KEY,
      E2B_API_KEY: !!process.env.E2B_API_KEY,
      INNGEST_EVENT_KEY: !!process.env.INNGEST_EVENT_KEY,
      INNGEST_SIGNING_KEY: !!process.env.INNGEST_SIGNING_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    },
    mongoConnection: {
      status: 'pending',
      error: null as string | null,
      connectionTime: null as number | null,
    }
  };

  // Test MongoDB connection
  if (!process.env.MONGODB_URI) {
    diagnostics.mongoConnection.status = 'failed';
    diagnostics.mongoConnection.error = 'MONGODB_URI environment variable not found';
    return NextResponse.json({
      success: false,
      message: "MongoDB URI is missing",
      diagnostics,
    }, { status: 500 });
  }

  let client: MongoClient | null = null;
  const startTime = Date.now();

  try {
    client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    await client.connect();
    const db = client.db('vettcode');
    await db.command({ ping: 1 });
    
    diagnostics.mongoConnection.status = 'connected';
    diagnostics.mongoConnection.connectionTime = Date.now() - startTime;

    // Get collection stats
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    return NextResponse.json({
      success: true,
      message: "All systems operational",
      diagnostics,
      database: {
        name: 'vettcode',
        collections: collectionNames,
      }
    });

  } catch (error: unknown) {
    const err = error as { message: string; code?: string; name?: string };
    diagnostics.mongoConnection.status = 'failed';
    diagnostics.mongoConnection.error = err.message;
    diagnostics.mongoConnection.connectionTime = Date.now() - startTime;

    return NextResponse.json({
      success: false,
      message: "MongoDB connection failed",
      diagnostics,
      error: {
        message: err.message,
        code: err.code,
        name: err.name,
      }
    }, { status: 500 });

  } finally {
    if (client) {
      await client.close();
    }
  }
}
