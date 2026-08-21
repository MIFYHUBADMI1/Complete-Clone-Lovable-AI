import { Signer } from "@aws-sdk/rds-signer";
import { Pool } from "pg";

let pool: Pool | null = null;

async function getAuthToken() {
  const signer = new Signer({
    region: process.env.DATABASE_URL_AWS_REGION!,
    hostname: process.env.DATABASE_URL_PGHOST!,
    port: parseInt(process.env.DATABASE_URL_PGPORT || "5432"),
    username: process.env.DATABASE_URL_PGUSER!,
  });

  return await signer.getAuthToken();
}

export async function getPool() {
  if (!pool) {
    const token = await getAuthToken();

    pool = new Pool({
      host: process.env.DATABASE_URL_PGHOST,
      port: parseInt(process.env.DATABASE_URL_PGPORT || "5432"),
      database: process.env.DATABASE_URL_PGDATABASE,
      user: process.env.DATABASE_URL_PGUSER,
      password: token,
      ssl: {
        rejectUnauthorized: true,
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    // Refresh token before it expires (15 minutes)
    setInterval(async () => {
      const newToken = await getAuthToken();
      pool = new Pool({
        host: process.env.DATABASE_URL_PGHOST,
        port: parseInt(process.env.DATABASE_URL_PGPORT || "5432"),
        database: process.env.DATABASE_URL_PGDATABASE,
        user: process.env.DATABASE_URL_PGUSER,
        password: newToken,
        ssl: {
          rejectUnauthorized: true,
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });
    }, 14 * 60 * 1000); // Refresh every 14 minutes
  }

  return pool;
}
