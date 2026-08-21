import { sql } from "@vercel/postgres";

export const db = {
  async query(text: string, params?: unknown[]) {
    return await sql.query(text, params);
  },
  
  async execute(text: string, params?: unknown[]) {
    return await sql.query(text, params);
  }
};

// Database helper functions using Vercel's sql tagged template
export async function createProject(name: string) {
  const result = await sql`
    INSERT INTO "Project" (id, name, "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), ${name}, NOW(), NOW())
    RETURNING *
  `;
  return result.rows[0];
}

export async function createMessage(projectId: string, content: string, role: string, type: string) {
  const result = await sql`
    INSERT INTO "Message" (id, content, role, type, "projectId", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), ${content}, ${role}::"MessageRole", ${type}::"MessageType", ${projectId}, NOW(), NOW())
    RETURNING *
  `;
  return result.rows[0];
}

export async function getProject(id: string) {
  const result = await sql`
    SELECT * FROM "Project" WHERE id = ${id}
  `;
  return result.rows[0];
}

export async function getProjectMessages(projectId: string) {
  const result = await sql`
    SELECT * FROM "Message" WHERE "projectId" = ${projectId} ORDER BY "createdAt" ASC
  `;
  return result.rows;
}
