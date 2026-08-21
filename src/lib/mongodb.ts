/**
 * MongoDB Connection
 * Shared with WEB application - same database
 */

import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your environment variables')
}

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// In development mode, use a global variable to preserve connection across hot reloads
if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production, create a new client
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

/**
 * Get MongoDB database instance
 * Uses 'vettcode' database - shared with WEB application
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db('vettcode')
}

/**
 * Close MongoDB connection (for cleanup)
 */
export async function closeDb(): Promise<void> {
  const client = await clientPromise
  await client.close()
}

export default clientPromise
