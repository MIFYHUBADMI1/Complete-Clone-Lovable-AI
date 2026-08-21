import { createClient } from "@vercel/postgres";

// Use POSTGRES_URL_NON_POOLING or DATABASE_URL for direct connections
const getConnectionString = () => 
  process.env.POSTGRES_URL_NON_POOLING || 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL;

export const db = {
  async query(text: string, params?: unknown[]) {
    const client = createClient({ connectionString: getConnectionString() });
    await client.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      await client.end();
    }
  },
  
  async execute(text: string, params?: unknown[]) {
    const client = createClient({ connectionString: getConnectionString() });
    await client.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      await client.end();
    }
  }
};

// Database helper functions using createClient (for direct connections)
export async function createProject(name: string) {
  const client = createClient({ connectionString: getConnectionString() });
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
  const client = createClient({ connectionString: getConnectionString() });
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
  const client = createClient({ connectionString: getConnectionString() });
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
  const client = createClient({ connectionString: getConnectionString() });
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
