import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    // Test MongoDB connection
    const db = await getDb();
    
    // Ping the database
    await db.command({ ping: 1 });
    
    // Get collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
      database: "vettcode",
      collections: collectionNames,
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
          hasMongoUri: !!process.env.MONGODB_URI,
        },
      },
      { status: 500 }
    );
  }
}
