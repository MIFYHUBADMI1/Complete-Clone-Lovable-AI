import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {},
  };

  try {
    // Check 1: Environment variable
    diagnostics.checks.mongoUriExists = !!process.env.MONGODB_URI;
    diagnostics.checks.mongoUriPrefix = process.env.MONGODB_URI?.substring(0, 30) + "...";

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: "MONGODB_URI environment variable not found",
        diagnostics,
      }, { status: 500 });
    }

    // Check 2: Create client
    diagnostics.checks.clientCreated = false;
    const client = new MongoClient(process.env.MONGODB_URI);
    diagnostics.checks.clientCreated = true;

    // Check 3: Connect
    diagnostics.checks.connected = false;
    await client.connect();
    diagnostics.checks.connected = true;

    // Check 4: Ping
    diagnostics.checks.pingSuccessful = false;
    const db = client.db('vettcode');
    await db.command({ ping: 1 });
    diagnostics.checks.pingSuccessful = true;

    // Check 5: List collections
    diagnostics.checks.collectionsRetrieved = false;
    const collections = await db.listCollections().toArray();
    diagnostics.checks.collectionsRetrieved = true;
    diagnostics.collections = collections.map(c => c.name);

    // Check 6: Count documents in users collection (from WEB app)
    diagnostics.checks.usersCollectionExists = collections.some(c => c.name === 'users');
    if (diagnostics.checks.usersCollectionExists) {
      const userCount = await db.collection('users').countDocuments();
      diagnostics.userCount = userCount;
    }

    // Close connection
    await client.close();

    return NextResponse.json({
      success: true,
      message: "All MongoDB checks passed!",
      diagnostics,
    });

  } catch (error: unknown) {
    const err = error as { message: string; code?: string; stack?: string };
    console.error("MongoDB diagnostic error:", error);

    return NextResponse.json({
      success: false,
      error: err.message,
      code: err.code,
      stack: err.stack?.split('\n').slice(0, 5),
      diagnostics,
    }, { status: 500 });
  }
}
