import { createClient } from "@vercel/postgres";

// Create a client using DATABASE_URL (direct connection with IAM)
const getClient = () => createClient({
  connectionString: process.env.DATABASE_URL,
});

export const db = {
  async query(text: string, params?: unknown[]) {
    const client = getClient();
    await client.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      await client.end();
    }
  },
  
  async execute(text: string, params?: unknown[]) {
    const client = getClient();
    await client.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      await client.end();
    }
  }
};

// Database helper functions
export async function createProject(name: string) {
  const client = getClient();
  await client.connect();
  try {
    const result = await client.query(
      `INSERT INTO "Project" (id, name, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, NOW(), NOW())
       RETURNING *`,
      [name]
    );
    return result.rows[0];
  } finally {
    await client.end();
  }
}

export async function createMessage(projectId: string, content: string, role: string, type: string) {
  const client = getClient();
  await client.connect();
  try {
    const result = await client.query(
      `INSERT INTO "Message" (id, content, role, type, "projectId", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2::"MessageRole", $3::"MessageType", $4, NOW(), NOW())
       RETURNING *`,
      [content, role, type, projectId]
    );
    return result.rows[0];
  } finally {
    await client.end();
  }
}

export async function getProject(id: string) {
  const client = getClient();
  await client.connect();
  try {
    const result = await client.query(
      `SELECT * FROM "Project" WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  } finally {
    await client.end();
  }
}

export async function getProjectMessages(projectId: string) {
  const client = getClient();
  await client.connect();
  try {
    const result = await client.query(
      `SELECT * FROM "Message" WHERE "projectId" = $1 ORDER BY "createdAt" ASC`,
      [projectId]
    );
    return result.rows;
  } finally {
    await client.end();
  }
}
