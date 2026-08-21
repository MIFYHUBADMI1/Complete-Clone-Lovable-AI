import { Signer } from "@aws-sdk/rds-signer";
import { Pool } from "pg";
import { fromEnv } from "@aws-sdk/credential-providers";

let pool: Pool | null = null;
let tokenRefreshInterval: NodeJS.Timeout | null = null;

async function getAuthToken() {
  const signer = new Signer({
    region: process.env.DATABASE_URL_AWS_REGION!,
    hostname: process.env.DATABASE_URL_PGHOST!,
    port: parseInt(process.env.DATABASE_URL_PGPORT || "5432"),
    username: process.env.DATABASE_URL_PGUSER!,
    credentials: fromEnv(),
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
    if (!tokenRefreshInterval) {
      tokenRefreshInterval = setInterval(async () => {
        try {
          const newToken = await getAuthToken();
          // End existing pool and create new one with fresh token
          await pool?.end();
          
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
        } catch (error) {
          console.error("Failed to refresh database token:", error);
        }
      }, 14 * 60 * 1000); // Refresh every 14 minutes
    }
  }

  return pool;
}
