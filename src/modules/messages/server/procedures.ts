import { inngest } from "@/inngest/client";
import { createMessage } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const result = await pool.query(
      'SELECT * FROM "Message" ORDER BY "updatedAt" DESC'
    );
    return result.rows;
  }),

  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Message is required" })
          .max(10000, { message: "Message is too long" }),
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .mutation(async ({ input }) => {
      const createdMessage = await createMessage(input.projectId, input.value, "USER", "RESULT");

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      });
      return createdMessage;
    }),
});
