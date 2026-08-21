/**
 * Database operations for Projects, Messages, and Fragments
 * Uses MongoDB - shared with WEB application (vettcode database)
 */

import { ObjectId } from 'mongodb'
import { getDb } from './mongodb'

// Types
export interface Project {
  _id?: ObjectId
  id?: string // Serialized _id for frontend use
  name: string
  userId?: string // Link to user from WEB app
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  _id?: ObjectId
  content: string
  role: 'USER' | 'ASSISTANT'
  type: 'RESULT' | 'ERROR'
  projectId: string
  createdAt: Date
  updatedAt: Date
}

export interface Fragment {
  _id?: ObjectId
  messageId: string
  sandboxUrl: string
  title: string
  files: Record<string, string> // JSON object of files
  createdAt: Date
  updatedAt: Date
}

// Database helper functions
export async function createProject(name: string, userId?: string): Promise<Project> {
  const db = await getDb()
  const collection = db.collection<Project>('projects')
  
  const project: Project = {
    name,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  const result = await collection.insertOne(project)
  return { ...project, _id: result.insertedId }
}

export async function createMessage(
  projectId: string,
  content: string,
  role: 'USER' | 'ASSISTANT',
  type: 'RESULT' | 'ERROR'
): Promise<Message> {
  const db = await getDb()
  const collection = db.collection<Message>('messages')
  
  const message: Message = {
    content,
    role,
    type,
    projectId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  const result = await collection.insertOne(message)
  return { ...message, _id: result.insertedId }
}

export async function createFragment(
  messageId: string,
  sandboxUrl: string,
  title: string,
  files: Record<string, string>
): Promise<Fragment> {
  const db = await getDb()
  const collection = db.collection<Fragment>('fragments')
  
  const fragment: Fragment = {
    messageId,
    sandboxUrl,
    title,
    files,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  const result = await collection.insertOne(fragment)
  return { ...fragment, _id: result.insertedId }
}

export async function getProject(id: string): Promise<Project | null> {
  const db = await getDb()
  const collection = db.collection<Project>('projects')
  return await collection.findOne({ _id: new ObjectId(id) })
}

export async function getProjectMessages(projectId: string): Promise<Message[]> {
  const db = await getDb()
  const collection = db.collection<Message>('messages')
  return await collection
    .find({ projectId })
    .sort({ createdAt: 1 })
    .toArray()
}

export async function getAllProjects(): Promise<Project[]> {
  const db = await getDb()
  const collection = db.collection<Project>('projects')
  return await collection
    .find()
    .sort({ updatedAt: -1 })
    .toArray()
}

export async function getAllMessages(): Promise<Message[]> {
  const db = await getDb()
  const collection = db.collection<Message>('messages')
  return await collection
    .find()
    .sort({ updatedAt: -1 })
    .toArray()
}
