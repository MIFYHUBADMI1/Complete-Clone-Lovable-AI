import { createPool, sql } from "@vercel/postgres";

// Create a connection pool using DATABASE_URL
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

export const db = {
  async query(text: string, params?: unknown[]) {
    return await pool.query(text, params);
  },
  
  async execute(text: string, params?: unknown[]) {
    return await pool.query(text, params);
  }
};

// Database helper functions using the pool
export async function createProject(name: string) {
  const result = await pool.query(
    `INSERT INTO "Project" (id, name, "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), $1, NOW(), NOW())
     RETURNING *`,
    [name]
  );
  return result.rows[0];
}

export async function createMessage(projectId: string, content: string, role: string, type: string) {
  const result = await pool.query(
    `INSERT INTO "Message" (id, content, role, type, "projectId", "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), $1, $2::\"MessageRole\", $3::\"MessageType\", $4, NOW(), NOW())
     RETURNING *`,
    [content, role, type, projectId]
  );
  return result.rows[0];
}

export async function getProject(id: string) {
  const result = await pool.query(
    `SELECT * FROM "Project" WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function getProjectMessages(projectId: string) {
  const result = await pool.query(
    `SELECT * FROM "Message" WHERE "projectId" = $1 ORDER BY "createdAt" ASC`,
    [projectId]
  );
  return result.rows;
}

